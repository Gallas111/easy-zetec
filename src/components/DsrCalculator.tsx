"use client";

import { useState, useMemo } from "react";

// 만원 단위 숫자 포맷 (천 단위 콤마)
function fmt(n: number): string {
  if (!isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR");
}

// 원리금균등 월 상환액 = P * r * (1+r)^n / ((1+r)^n - 1)
// P: 원금(원), annualRate: 연이율(%), years: 기간(년)
function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const n = years * 12;
  if (n <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}

// 원리금균등 기준, 연간 상환액으로부터 역산한 대출 가능 원금
// monthly = P * r(1+r)^n / ((1+r)^n -1)  →  P = monthly * ((1+r)^n -1) / (r(1+r)^n)
function principalFromMonthly(monthly: number, annualRate: number, years: number): number {
  const n = years * 12;
  if (n <= 0 || monthly <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return monthly * n;
  const pow = Math.pow(1 + r, n);
  return (monthly * (pow - 1)) / (r * pow);
}

type RateType = "variable" | "mixed" | "periodic";
type Region = "metro" | "local";

// 스트레스 DSR 3단계(2025.7.1~, 작성 시점 2026.6 현행) 기준 가산금리 산정
// 기본 스트레스 금리 1.5%
// 금리유형별 적용비율: 변동 100% / 혼합형 60% / 주기형 30%
// 지역: 수도권·규제지역 3단계(100%) / 지방 주담대는 2026 상반기 2단계(0.75%, 50%) 한시 유예
function stressRate(rateType: RateType, region: Region): number {
  const BASE = 1.5; // %p
  const typeMul = rateType === "variable" ? 1.0 : rateType === "mixed" ? 0.6 : 0.3;
  if (region === "local") {
    // 지방 주담대: 2026.1.1~6.30 한시 2단계(기본 스트레스 금리의 50%) 적용
    return BASE * 0.5 * typeMul;
  }
  return BASE * typeMul;
}

export default function DsrCalculator() {
  // 입력 (만원 단위 / % / 년)
  const [annualIncome, setAnnualIncome] = useState<string>("5000"); // 연소득(만원)

  // 기존 대출 연간 원리금상환액(만원/년)
  const [existMortgage, setExistMortgage] = useState<string>("0"); // 기존 주담대 연 원리금
  const [existCredit, setExistCredit] = useState<string>("0"); // 기존 신용대출 연 원리금
  const [existEtc, setExistEtc] = useState<string>("0"); // 기타대출 연 원리금

  // 신규 대출 희망 조건
  const [newAmount, setNewAmount] = useState<string>("30000"); // 신규 대출 희망액(만원)
  const [newRate, setNewRate] = useState<string>("4.5"); // 금리(%)
  const [newYears, setNewYears] = useState<string>("30"); // 기간(년)

  // 규제·스트레스 옵션
  const [lender, setLender] = useState<"bank" | "nonbank">("bank"); // 은행권 40% / 2금융 50%
  const [rateType, setRateType] = useState<RateType>("variable");
  const [region, setRegion] = useState<Region>("metro");
  const [applyStress, setApplyStress] = useState<boolean>(true);

  const num = (s: string) => {
    const v = parseFloat((s || "").replace(/,/g, ""));
    return isFinite(v) && v > 0 ? v : 0;
  };

  const result = useMemo(() => {
    const income = num(annualIncome) * 10000; // 원
    const existAnnual =
      (num(existMortgage) + num(existCredit) + num(existEtc)) * 10000; // 원/년
    const principal = num(newAmount) * 10000; // 원
    const baseRate = num(newRate);
    const years = num(newYears);

    const limitRatio = lender === "bank" ? 40 : 50; // %

    // 스트레스 가산금리 (신규 대출 심사에만 적용)
    const sRate = applyStress ? stressRate(rateType, region) : 0;
    const stressedRate = baseRate + sRate;

    // 신규 대출 연간 원리금 (실제 약정금리 기준 — 차주 실제 부담)
    const newMonthlyReal = monthlyPayment(principal, baseRate, years);
    const newAnnualReal = newMonthlyReal * 12;

    // 신규 대출 연간 원리금 (스트레스 금리 기준 — 은행 DSR 심사용)
    const newMonthlyStress = monthlyPayment(principal, stressedRate, years);
    const newAnnualStress = newMonthlyStress * 12;

    // 현재 DSR (신규 미반영, 실제 금리)
    const currentDsr = income > 0 ? (existAnnual / income) * 100 : 0;

    // 신규 반영 DSR (심사 기준 = 스트레스 적용)
    const totalAnnualStress = existAnnual + newAnnualStress;
    const newDsr = income > 0 ? (totalAnnualStress / income) * 100 : 0;

    // 신규 반영 DSR (실제 부담 기준)
    const totalAnnualReal = existAnnual + newAnnualReal;
    const realDsr = income > 0 ? (totalAnnualReal / income) * 100 : 0;

    const pass = newDsr <= limitRatio;

    // 역산: 한도(40/50%) 기준 추가로 받을 수 있는 신규 대출 원금
    // 가용 연간 상환여력 = income*limit/100 - existAnnual
    const availAnnual = income * (limitRatio / 100) - existAnnual;
    const availMonthly = availAnnual / 12;
    // 신규 대출은 스트레스 금리로 심사되므로, 한도 환산도 스트레스 금리로
    const maxPrincipal =
      availMonthly > 0 ? principalFromMonthly(availMonthly, stressedRate, years) : 0;

    return {
      income,
      existAnnual,
      principal,
      limitRatio,
      sRate,
      stressedRate,
      newAnnualReal,
      newAnnualStress,
      currentDsr,
      newDsr,
      realDsr,
      pass,
      availAnnual,
      maxPrincipal,
      hasNew: principal > 0 && years > 0,
    };
  }, [
    annualIncome,
    existMortgage,
    existCredit,
    existEtc,
    newAmount,
    newRate,
    newYears,
    lender,
    rateType,
    region,
    applyStress,
  ]);

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all";
  const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";
  const unitWrap =
    "relative flex items-center";
  const unitCls =
    "absolute right-3 text-sm text-[var(--color-text-light)] pointer-events-none";

  return (
    <div className="not-prose my-8 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-[var(--color-primary)] px-5 py-4 sm:px-6">
        <h2 className="text-lg sm:text-xl font-bold text-white m-0 border-0 p-0">
          DSR 계산기 (총부채원리금상환비율)
        </h2>
        <p className="text-[13px] text-white/85 mt-1 mb-0">
          연소득·기존 대출·신규 대출 조건을 넣으면 DSR과 대출 가능 한도를 바로 계산해 드려요.
        </p>
      </div>

      <div className="p-5 sm:p-6 grid gap-6 md:grid-cols-2">
        {/* 좌: 입력 */}
        <div className="space-y-5">
          <div>
            <label className={labelCls} htmlFor="dsr-income">
              연소득 (세전)
            </label>
            <div className={unitWrap}>
              <input
                id="dsr-income"
                inputMode="numeric"
                className={inputCls + " pr-12"}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="5000"
              />
              <span className={unitCls}>만원</span>
            </div>
          </div>

          <fieldset className="space-y-3 rounded-xl bg-[#F7FAF9] p-4 border border-[var(--color-border)]">
            <legend className="text-sm font-semibold text-[var(--color-primary-dark)] px-1">
              기존 대출 연간 원리금 상환액
            </legend>
            <div>
              <label className={labelCls} htmlFor="dsr-em">
                주택담보대출
              </label>
              <div className={unitWrap}>
                <input id="dsr-em" inputMode="numeric" className={inputCls + " pr-20"} value={existMortgage} onChange={(e) => setExistMortgage(e.target.value)} />
                <span className={unitCls}>만원/년</span>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="dsr-ec">
                신용대출
              </label>
              <div className={unitWrap}>
                <input id="dsr-ec" inputMode="numeric" className={inputCls + " pr-20"} value={existCredit} onChange={(e) => setExistCredit(e.target.value)} />
                <span className={unitCls}>만원/년</span>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="dsr-ee">
                기타대출 (학자금·자동차 등)
              </label>
              <div className={unitWrap}>
                <input id="dsr-ee" inputMode="numeric" className={inputCls + " pr-20"} value={existEtc} onChange={(e) => setExistEtc(e.target.value)} />
                <span className={unitCls}>만원/년</span>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl bg-[#FFFBEB] p-4 border border-[#FDE68A]">
            <legend className="text-sm font-semibold text-[var(--color-accent-dark)] px-1">
              신규 대출 희망 조건
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls} htmlFor="dsr-na">
                  대출 희망액
                </label>
                <div className={unitWrap}>
                  <input id="dsr-na" inputMode="numeric" className={inputCls + " pr-12"} value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                  <span className={unitCls}>만원</span>
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="dsr-nr">
                  금리
                </label>
                <div className={unitWrap}>
                  <input id="dsr-nr" inputMode="decimal" className={inputCls + " pr-9"} value={newRate} onChange={(e) => setNewRate(e.target.value)} />
                  <span className={unitCls}>%</span>
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="dsr-ny">
                  기간
                </label>
                <div className={unitWrap}>
                  <input id="dsr-ny" inputMode="numeric" className={inputCls + " pr-9"} value={newYears} onChange={(e) => setNewYears(e.target.value)} />
                  <span className={unitCls}>년</span>
                </div>
              </div>
            </div>
          </fieldset>

          {/* 규제·스트레스 옵션 */}
          <div className="space-y-3">
            <div>
              <span className={labelCls}>적용 업권 (DSR 한도)</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLender("bank")}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${lender === "bank" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text)] border-[var(--color-border)]"}`}
                >
                  은행권 (40%)
                </button>
                <button
                  type="button"
                  onClick={() => setLender("nonbank")}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${lender === "nonbank" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text)] border-[var(--color-border)]"}`}
                >
                  제2금융권 (50%)
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyStress}
                  onChange={(e) => setApplyStress(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                스트레스 DSR 적용 (2026년 현행)
              </label>
            </div>

            {applyStress && (
              <div className="grid grid-cols-1 gap-3 pl-1">
                <div>
                  <span className={labelCls}>금리 유형</span>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["variable", "변동형"],
                      ["mixed", "혼합형"],
                      ["periodic", "주기형"],
                    ] as [RateType, string][]).map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRateType(v)}
                        className={`py-2 rounded-lg text-[13px] font-medium border transition-colors ${rateType === v ? "bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)]" : "bg-white text-[var(--color-text)] border-[var(--color-border)]"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>대상 지역 (주담대 기준)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegion("metro")}
                      className={`py-2 rounded-lg text-[13px] font-medium border transition-colors ${region === "metro" ? "bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)]" : "bg-white text-[var(--color-text)] border-[var(--color-border)]"}`}
                    >
                      수도권·규제지역
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegion("local")}
                      className={`py-2 rounded-lg text-[13px] font-medium border transition-colors ${region === "local" ? "bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)]" : "bg-white text-[var(--color-text)] border-[var(--color-border)]"}`}
                    >
                      지방
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우: 결과 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-[#F0FDFA] border border-[#99F6E4] p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[var(--color-text-light)]">현재 DSR (신규 대출 전)</span>
              <span className="text-2xl font-extrabold text-[var(--color-primary-dark)] tabular-nums">
                {result.income > 0 ? result.currentDsr.toFixed(1) : "-"}%
              </span>
            </div>
            <hr className="my-3 border-[#CCFBF1]" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                신규 반영 DSR <span className="text-xs font-normal text-[var(--color-text-light)]">(심사 기준)</span>
              </span>
              <span
                className={`text-3xl font-extrabold tabular-nums ${result.pass ? "text-[var(--color-primary-dark)]" : "text-[var(--color-danger)]"}`}
              >
                {result.income > 0 && result.hasNew ? result.newDsr.toFixed(1) : "-"}%
              </span>
            </div>
            {result.income > 0 && result.hasNew && (
              <div
                className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-center ${result.pass ? "bg-[#10B981] text-white" : "bg-[#EF4444] text-white"}`}
              >
                {result.pass
                  ? `통과 — 한도 ${result.limitRatio}% 이내`
                  : `초과 — 한도 ${result.limitRatio}%를 ${(result.newDsr - result.limitRatio).toFixed(1)}%p 넘었어요`}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white border border-[var(--color-border)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
              DSR {result.limitRatio}% 기준 추가 대출 가능 한도
            </p>
            <p className="text-xs text-[var(--color-text-light)] mb-3">
              현재 소득·기존 대출을 그대로 두고, 같은 금리·기간으로 더 받을 수 있는 최대 원금이에요.
            </p>
            <p className="text-3xl font-extrabold text-[var(--color-accent-dark)] tabular-nums">
              약 {fmt(result.maxPrincipal / 10000)}
              <span className="text-base font-bold ml-1">만원</span>
            </p>
            {result.availAnnual <= 0 && result.income > 0 && (
              <p className="text-xs text-[var(--color-danger)] mt-2">
                이미 기존 대출만으로 한도를 채워 추가 대출 여력이 없어요.
              </p>
            )}
          </div>

          {/* 세부 내역 */}
          <div className="rounded-xl bg-[#FAFAF8] border border-[var(--color-border)] p-4 text-sm space-y-2">
            <p className="font-semibold text-[var(--color-text)] mb-1">계산 내역</p>
            <Row label="연소득" value={`${fmt(result.income / 10000)} 만원`} />
            <Row label="기존 대출 연간 원리금" value={`${fmt(result.existAnnual / 10000)} 만원`} />
            {result.hasNew && (
              <>
                <Row
                  label="신규 대출 연 원리금 (실제 금리)"
                  value={`${fmt(result.newAnnualReal / 10000)} 만원`}
                />
                {result.sRate > 0 && (
                  <Row
                    label={`신규 대출 연 원리금 (스트레스 +${result.sRate.toFixed(2)}%p)`}
                    value={`${fmt(result.newAnnualStress / 10000)} 만원`}
                    highlight
                  />
                )}
              </>
            )}
            {result.sRate > 0 && (
              <Row
                label="심사 적용 금리"
                value={`${result.stressedRate.toFixed(2)}%`}
              />
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-[var(--color-text-light)]">
            본 계산기는 원리금균등상환을 가정한 추정치이며, 실제 한도는 은행별 내규·DTI·LTV·보증한도 등에 따라 달라질 수 있어요. 스트레스 금리는 2026년 6월 기준 3단계(기본 1.5%) 가정이며, 지방 주담대는 2026년 상반기 한시 2단계가 반영돼요.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--color-text-light)]">{label}</span>
      <span
        className={`tabular-nums font-medium ${highlight ? "text-[var(--color-accent-dark)] font-semibold" : "text-[var(--color-text)]"}`}
      >
        {value}
      </span>
    </div>
  );
}
