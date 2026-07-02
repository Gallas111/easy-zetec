"use client";

import { useState, useMemo } from "react";

// 원 단위 숫자 포맷 (천 단위 콤마)
function fmt(n: number): string {
  if (!isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR");
}

type Mode = "deposit" | "installment"; // 예금(거치식) / 적금(월적립)
type InterestType = "simple" | "compound"; // 단리 / 월복리
type TaxType = "normal" | "preferential" | "taxfree"; // 15.4% / 9.5% / 0%

const TAX_RATE: Record<TaxType, number> = {
  normal: 0.154, // 이자소득세 14% + 지방소득세 1.4%
  preferential: 0.095, // 이자소득세 9% + 농어촌특별세 0.5%
  taxfree: 0,
};

interface MonthRow {
  month: number; // 경과 개월
  principal: number; // 누적 납입 원금(원)
  interest: number; // 누적 세전 이자(원)
  balance: number; // 원금+세전이자(원)
}

// 예금(거치식): 원금 P를 m개월 예치
// 단리: 이자 = P × r × t/12
// 월복리: 이자 = P × ((1+r/12)^t − 1)
function depositRows(P: number, r: number, m: number, type: InterestType): MonthRow[] {
  const rows: MonthRow[] = [];
  const i = r / 12;
  for (let t = 1; t <= m; t++) {
    const interest = type === "simple" ? P * r * (t / 12) : P * (Math.pow(1 + i, t) - 1);
    rows.push({ month: t, principal: P, interest, balance: P + interest });
  }
  return rows;
}

// 적금(월적립·매월 초 납입 가정): 월납입액 M을 n개월 납입
// k회차 납입금의 예치기간 = (n − k + 1)개월
// 단리: 총이자 = M × r × n(n+1)/2 ÷ 12
// 월복리: 만기금 = M × (1+i) × ((1+i)^n − 1) ÷ i   (i = r/12)
function installmentRows(M: number, r: number, n: number, type: InterestType): MonthRow[] {
  const rows: MonthRow[] = [];
  const i = r / 12;
  for (let t = 1; t <= n; t++) {
    const principal = M * t;
    let interest: number;
    if (type === "simple") {
      // t개월 경과 시점: k회차(k=1..t) 납입금이 (t−k+1)개월 예치
      interest = M * r * ((t * (t + 1)) / 2 / 12);
    } else {
      const fv = i === 0 ? M * t : M * (1 + i) * ((Math.pow(1 + i, t) - 1) / i);
      interest = fv - principal;
    }
    rows.push({ month: t, principal, interest, balance: principal + interest });
  }
  return rows;
}

export default function SavingsCompoundCalculator() {
  const [mode, setMode] = useState<Mode>("installment");
  const [amount, setAmount] = useState<string>("1000"); // 예금 원금(만원)
  const [monthly, setMonthly] = useState<string>("50"); // 적금 월납입액(만원)
  const [rate, setRate] = useState<string>("3.5"); // 연 금리(%)
  const [months, setMonths] = useState<string>("12"); // 기간(개월)
  const [interestType, setInterestType] = useState<InterestType>("simple");
  const [taxType, setTaxType] = useState<TaxType>("normal");

  const num = (s: string) => {
    const v = parseFloat((s || "").replace(/,/g, ""));
    return isFinite(v) && v > 0 ? v : 0;
  };

  const result = useMemo(() => {
    const r = num(rate) / 100;
    const m = Math.min(Math.floor(num(months)), 120); // 최대 120개월
    const won = mode === "deposit" ? num(amount) * 10000 : num(monthly) * 10000;

    if (won <= 0 || m <= 0) {
      return null;
    }

    const rows =
      mode === "deposit"
        ? depositRows(won, r, m, interestType)
        : installmentRows(won, r, m, interestType);

    const last = rows[rows.length - 1];
    const totalPrincipal = last.principal;
    const preTaxInterest = last.interest;
    const tax = preTaxInterest * TAX_RATE[taxType];
    const afterTaxInterest = preTaxInterest - tax;
    const maturity = totalPrincipal + afterTaxInterest;

    // 단리 vs 월복리 비교 (같은 조건)
    const otherType: InterestType = interestType === "simple" ? "compound" : "simple";
    const otherRows =
      mode === "deposit"
        ? depositRows(won, r, m, otherType)
        : installmentRows(won, r, m, otherType);
    const otherInterest = otherRows[otherRows.length - 1].interest;
    const compoundGain =
      interestType === "compound" ? preTaxInterest - otherInterest : otherInterest - preTaxInterest;

    return {
      rows,
      totalPrincipal,
      preTaxInterest,
      tax,
      afterTaxInterest,
      maturity,
      compoundGain,
      m,
    };
  }, [mode, amount, monthly, rate, months, interestType, taxType]);

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all";
  const labelCls = "block text-sm font-medium text-[var(--color-text)] mb-1.5";
  const unitWrap = "relative flex items-center";
  const unitCls = "absolute right-3 text-sm text-[var(--color-text-light)] pointer-events-none";
  const segBtn = (active: boolean) =>
    `py-2 rounded-lg text-sm font-medium border transition-colors ${
      active
        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
        : "bg-white text-[var(--color-text)] border-[var(--color-border)]"
    }`;
  const segBtnSm = (active: boolean) =>
    `py-2 rounded-lg text-[13px] font-medium border transition-colors ${
      active
        ? "bg-[var(--color-primary-dark)] text-white border-[var(--color-primary-dark)]"
        : "bg-white text-[var(--color-text)] border-[var(--color-border)]"
    }`;

  // 그래프 스케일
  const maxBalance = result ? result.rows[result.rows.length - 1].balance : 0;

  return (
    <div className="not-prose my-8 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-[var(--color-primary)] px-5 py-4 sm:px-6">
        <h2 className="text-lg sm:text-xl font-bold text-white m-0 border-0 p-0">
          예금·적금 이자 계산기 (단리·월복리)
        </h2>
        <p className="text-[13px] text-white/85 mt-1 mb-0">
          금액·금리·기간만 넣으면 세전 이자와 이자소득세(15.4%)를 뺀 만기 실수령액을 바로 계산해
          드려요.
        </p>
      </div>

      <div className="p-5 sm:p-6 grid gap-6 md:grid-cols-2">
        {/* 좌: 입력 */}
        <div className="space-y-5">
          {/* 예금/적금 */}
          <div>
            <span className={labelCls}>상품 유형</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode("deposit")} className={segBtn(mode === "deposit")}>
                예금 (목돈 거치)
              </button>
              <button type="button" onClick={() => setMode("installment")} className={segBtn(mode === "installment")}>
                적금 (매월 적립)
              </button>
            </div>
          </div>

          {mode === "deposit" ? (
            <div>
              <label className={labelCls} htmlFor="scc-amount">
                예치 금액 (한 번에 넣는 목돈)
              </label>
              <div className={unitWrap}>
                <input
                  id="scc-amount"
                  inputMode="numeric"
                  className={inputCls + " pr-12"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                />
                <span className={unitCls}>만원</span>
              </div>
            </div>
          ) : (
            <div>
              <label className={labelCls} htmlFor="scc-monthly">
                월 납입액 (매월 초 납입 가정)
              </label>
              <div className={unitWrap}>
                <input
                  id="scc-monthly"
                  inputMode="numeric"
                  className={inputCls + " pr-16"}
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  placeholder="50"
                />
                <span className={unitCls}>만원/월</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="scc-rate">
                연 금리 (세전)
              </label>
              <div className={unitWrap}>
                <input
                  id="scc-rate"
                  inputMode="decimal"
                  className={inputCls + " pr-9"}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="3.5"
                />
                <span className={unitCls}>%</span>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="scc-months">
                기간
              </label>
              <div className={unitWrap}>
                <input
                  id="scc-months"
                  inputMode="numeric"
                  className={inputCls + " pr-12"}
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  placeholder="12"
                />
                <span className={unitCls}>개월</span>
              </div>
            </div>
          </div>

          {/* 기간 퀵버튼 */}
          <div className="grid grid-cols-4 gap-2">
            {[6, 12, 24, 36].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMonths(String(v))}
                className={segBtnSm(num(months) === v)}
              >
                {v}개월
              </button>
            ))}
          </div>

          {/* 단리/월복리 */}
          <div>
            <span className={labelCls}>이자 계산 방식</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInterestType("simple")}
                className={segBtn(interestType === "simple")}
              >
                단리
              </button>
              <button
                type="button"
                onClick={() => setInterestType("compound")}
                className={segBtn(interestType === "compound")}
              >
                월복리
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-1.5">
              시중 예·적금 대부분은 단리예요. 월복리는 일부 복리 상품 비교용으로 쓰세요.
            </p>
          </div>

          {/* 과세 */}
          <div>
            <span className={labelCls}>이자 과세 방식</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTaxType("normal")}
                className={segBtnSm(taxType === "normal")}
              >
                일반과세
                <span className="block text-[11px] opacity-80">15.4%</span>
              </button>
              <button
                type="button"
                onClick={() => setTaxType("preferential")}
                className={segBtnSm(taxType === "preferential")}
              >
                세금우대
                <span className="block text-[11px] opacity-80">9.5%</span>
              </button>
              <button
                type="button"
                onClick={() => setTaxType("taxfree")}
                className={segBtnSm(taxType === "taxfree")}
              >
                비과세
                <span className="block text-[11px] opacity-80">0%</span>
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-1.5">
              일반과세 15.4% = 이자소득세 14% + 지방소득세 1.4% · 세금우대 9.5% = 소득세 9% +
              농어촌특별세 0.5%
            </p>
          </div>
        </div>

        {/* 우: 결과 */}
        <div className="space-y-4">
          <div className="rounded-xl bg-[#F0FDFA] border border-[#99F6E4] p-5">
            <p className="text-sm text-[var(--color-text-light)] mb-1">만기 실수령액 (세후)</p>
            <p className="text-3xl font-extrabold text-[var(--color-primary-dark)] tabular-nums">
              {result ? fmt(result.maturity) : "-"}
              <span className="text-base font-bold ml-1">원</span>
            </p>
            {result && (
              <div className="mt-4 space-y-2 text-sm">
                <Row label="납입 원금 합계" value={`${fmt(result.totalPrincipal)} 원`} />
                <Row label="세전 이자" value={`${fmt(result.preTaxInterest)} 원`} />
                <Row
                  label={`이자 과세 (−${(TAX_RATE[taxType] * 100).toFixed(1)}%)`}
                  value={`−${fmt(result.tax)} 원`}
                />
                <Row label="세후 이자" value={`${fmt(result.afterTaxInterest)} 원`} highlight />
              </div>
            )}
          </div>

          {result && (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-4 text-sm">
              <p className="font-semibold text-[var(--color-text)] mb-1">단리 vs 월복리 차이</p>
              <p className="text-[var(--color-text-light)]">
                같은 조건에서 월복리로 계산하면 단리보다 세전 이자가{" "}
                <strong className="text-[var(--color-accent-dark)] tabular-nums">
                  {fmt(Math.abs(result.compoundGain))}원
                </strong>{" "}
                더 붙어요.
              </p>
            </div>
          )}

          {/* 간단 그래프 */}
          {result && (
            <div className="rounded-xl bg-[#FAFAF8] border border-[var(--color-border)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-3">
                월별 잔액 추이 (원금+세전이자)
              </p>
              <div className="flex items-end gap-[2px] h-28" role="img" aria-label="월별 잔액 막대 그래프">
                {result.rows.map((row) => (
                  <div
                    key={row.month}
                    className="flex-1 rounded-t bg-[var(--color-primary)] min-w-[2px] relative group"
                    style={{ height: `${Math.max((row.balance / maxBalance) * 100, 2)}%` }}
                    title={`${row.month}개월: ${fmt(row.balance)}원`}
                  >
                    <span className="absolute inset-x-0 top-0 h-full bg-[var(--color-primary-dark)] opacity-0 group-hover:opacity-100 rounded-t transition-opacity" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-[var(--color-text-light)] mt-1">
                <span>1개월</span>
                <span>{result.m}개월</span>
              </div>
            </div>
          )}

          {/* 월별 누적 표 */}
          {result && (
            <div className="rounded-xl bg-white border border-[var(--color-border)] overflow-hidden">
              <p className="text-sm font-semibold text-[var(--color-text)] px-4 pt-3 pb-2">
                월별 누적 내역
              </p>
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-[13px] tabular-nums">
                  <thead className="sticky top-0 bg-[#F7FAF9]">
                    <tr className="text-[var(--color-text-light)]">
                      <th className="py-1.5 px-3 text-left font-medium">경과</th>
                      <th className="py-1.5 px-3 text-right font-medium">납입 원금</th>
                      <th className="py-1.5 px-3 text-right font-medium">세전 이자</th>
                      <th className="py-1.5 px-3 text-right font-medium">잔액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row) => (
                      <tr key={row.month} className="border-t border-[var(--color-border)]">
                        <td className="py-1.5 px-3 text-[var(--color-text-light)]">
                          {row.month}개월
                        </td>
                        <td className="py-1.5 px-3 text-right">{fmt(row.principal)}</td>
                        <td className="py-1.5 px-3 text-right text-[var(--color-primary-dark)]">
                          {fmt(row.interest)}
                        </td>
                        <td className="py-1.5 px-3 text-right font-medium">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-[var(--color-text-light)]">
            본 계산기는 참고용 추정치예요. 예금 단리는 원금×금리×개월/12, 적금 단리는 매월 초 납입
            가정으로 회차별 예치 개월 수만큼 이자를 계산해요(총이자 = 월납입액×연금리×n(n+1)/2÷12).
            월복리는 연금리÷12를 매월 원리금에 굴리는 방식이에요. 실제 은행 이자는 일할 계산·납입일·
            원단위 절사 등에 따라 소액 차이가 날 수 있어요.
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
        className={`tabular-nums font-medium ${
          highlight ? "text-[var(--color-primary-dark)] font-semibold" : "text-[var(--color-text)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
