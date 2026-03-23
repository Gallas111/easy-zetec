import { google } from 'googleapis';

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { marked } from 'marked';

dotenv.config({ path: '.env.local' });
dotenv.config();

const KEY_FILE_PATH = path.join(process.cwd(), 'google-credentials.json');
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GSC_SITE_URL = process.env.GSC_SITE_URL;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;

// --- Authentication ---

async function authenticateGoogle() {
    let auth;
    if (fs.existsSync(KEY_FILE_PATH)) {
        auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: [
                'https://www.googleapis.com/auth/webmasters.readonly',
                'https://www.googleapis.com/auth/analytics.readonly',
            ],
        });
    } else {
        const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
        if (!credentialsBase64) {
            throw new Error(
                'Google Credentials needed. Provide google-credentials.json or set GOOGLE_CREDENTIALS_BASE64 env var.'
            );
        }
        const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
        fs.writeFileSync(KEY_FILE_PATH, credentialsJson);
        auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: [
                'https://www.googleapis.com/auth/webmasters.readonly',
                'https://www.googleapis.com/auth/analytics.readonly',
            ],
        });
    }
    return await auth.getClient();
}

// --- Search Console Data ---

async function fetchSearchConsoleData(authClient: any) {
    const searchconsole = google.searchconsole({ version: 'v1', auth: authClient });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 3);

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 3);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    console.log(`[GSC] Current period: ${formatDate(startDate)} ~ ${formatDate(endDate)}`);
    console.log(`[GSC] Previous period: ${formatDate(prevStartDate)} ~ ${formatDate(prevEndDate)}`);

    // Current period - queries
    const currentQueries = await searchconsole.searchanalytics.query({
        siteUrl: GSC_SITE_URL!,
        requestBody: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ['query'],
            rowLimit: 20,
        },
    });

    // Previous period - queries
    const prevQueries = await searchconsole.searchanalytics.query({
        siteUrl: GSC_SITE_URL!,
        requestBody: {
            startDate: formatDate(prevStartDate),
            endDate: formatDate(prevEndDate),
            dimensions: ['query'],
            rowLimit: 20,
        },
    });

    // Current period - pages
    const currentPages = await searchconsole.searchanalytics.query({
        siteUrl: GSC_SITE_URL!,
        requestBody: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ['page'],
            rowLimit: 15,
        },
    });

    // Previous period - pages
    const prevPages = await searchconsole.searchanalytics.query({
        siteUrl: GSC_SITE_URL!,
        requestBody: {
            startDate: formatDate(prevStartDate),
            endDate: formatDate(prevEndDate),
            dimensions: ['page'],
            rowLimit: 15,
        },
    });

    return {
        currentQueries: currentQueries.data.rows || [],
        prevQueries: prevQueries.data.rows || [],
        currentPages: currentPages.data.rows || [],
        prevPages: prevPages.data.rows || [],
        period: {
            current: `${formatDate(startDate)} ~ ${formatDate(endDate)}`,
            previous: `${formatDate(prevStartDate)} ~ ${formatDate(prevEndDate)}`,
        },
    };
}

// --- GA4 Data ---

async function fetchGA4Data(authClient: any) {
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth: authClient });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 3);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    console.log(`[GA4] Period: ${formatDate(startDate)} ~ ${formatDate(endDate)}`);

    // Traffic overview filtered by easyzetec.com
    const trafficResponse = await analyticsData.properties.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            metrics: [
                { name: 'sessions' },
                { name: 'totalUsers' },
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: 'hostName',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: 'easyzetec.com',
                    },
                },
            },
        },
    });

    // Top pages
    const pagesResponse = await analyticsData.properties.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'totalUsers' },
                { name: 'averageSessionDuration' },
            ],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 15,
            dimensionFilter: {
                filter: {
                    fieldName: 'hostName',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: 'easyzetec.com',
                    },
                },
            },
        },
    });

    // Traffic sources
    const sourcesResponse = await analyticsData.properties.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        requestBody: {
            dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [
                { name: 'sessions' },
                { name: 'totalUsers' },
            ],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 10,
            dimensionFilter: {
                filter: {
                    fieldName: 'hostName',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: 'easyzetec.com',
                    },
                },
            },
        },
    });

    return {
        traffic: trafficResponse.data,
        topPages: pagesResponse.data,
        sources: sourcesResponse.data,
    };
}

// --- Cloudflare Workers AI Analysis ---

async function generateGeminiInsights(gscData: any, ga4Data: any): Promise<string> {
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
        return '## AI 분석\nCF_ACCOUNT_ID 및 CF_API_TOKEN이 설정되지 않아 AI 분석을 건너뜁니다.';
    }

    const CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`;

    const prompt = `
당신은 한국 금융/재테크 블로그 "쉬운재테크" (https://www.easyzetec.com)의 SEO 및 성장 분석 전문가입니다.
이 블로그는 재테크, 저축, 투자, 절세, 부동산 등 실용적인 금융 정보를 다룹니다.

아래 3일간의 Google Search Console 및 GA4 데이터를 분석하여, 블로그 성장을 위한 실행 가능한 리포트를 작성해 주세요.

## Search Console 데이터 (최근 3일)
### 현재 기간 (${gscData.period.current})
검색 키워드 상위:
${JSON.stringify(gscData.currentQueries.slice(0, 15), null, 2)}

상위 페이지:
${JSON.stringify(gscData.currentPages.slice(0, 10), null, 2)}

### 이전 기간 (${gscData.period.previous})
검색 키워드:
${JSON.stringify(gscData.prevQueries.slice(0, 15), null, 2)}

## GA4 데이터 (최근 3일)
트래픽 개요:
${JSON.stringify(ga4Data.traffic, null, 2)}

인기 페이지:
${JSON.stringify(ga4Data.topPages, null, 2)}

트래픽 소스:
${JSON.stringify(ga4Data.sources, null, 2)}

---

아래 형식으로 리포트를 작성해 주세요. 모든 내용은 한국어로 작성하세요.

# 📊 주요 성과 요약

## 🔍 검색 성과
- GSC 상위 키워드 TOP 5와 각각의 클릭수, 노출수, CTR, 평균 순위를 표로 정리
- 이전 3일 대비 변화가 있는 키워드 하이라이트
- CTR이 낮은데 노출이 높은 키워드 → 개선 기회로 분석

## 📈 트래픽 분석
- GA4 기준 총 세션, 사용자, 페이지뷰, 평균 세션 시간, 이탈률 요약
- 트래픽 소스별 분석 (검색, 직접, 소셜 등)
- 인기 페이지 TOP 5와 각각의 페이지뷰, 사용자 수

# 🎯 3단계 개선 전략

## 1단계: 제목 및 메타 최적화 (즉시 실행)
- CTR이 낮은 키워드에 대한 구체적인 제목 개선 제안 (재테크/금융 키워드 중심)
- 메타 디스크립션 개선 포인트

## 2단계: 콘텐츠 구조 개선 (1주 내)
- 검색 의도에 맞는 콘텐츠 구조 제안
- 내부 링크 전략 (관련 재테크 글 간 연결)
- 새로 작성하면 좋을 콘텐츠 주제 3가지 (재테크, 저축, 투자, 절세, 부동산 관련)

## 3단계: 성과 추적 (3일 후 확인)
- 다음 리포트에서 확인할 핵심 지표
- 개선 효과 측정 기준

# 💡 분석 도우미 요청 프롬프트 가이드
- 블로그 운영자가 AI에게 추가 분석을 요청할 때 사용할 수 있는 프롬프트 3가지 제안
- 예: "이 키워드로 CTR을 높이려면 제목을 어떻게 바꿔야 할까?", "이 글의 SEO 점수를 분석해줘" 등
`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 8192,
        }),
    });
    if (!response.ok) throw new Error(`CF Workers AI error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    return data.result?.response || '';
}

// --- Email Sending ---

async function sendEmailReport(markdownContent: string, gscData: any) {
    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_RECEIVER) {
        console.log('[Email] EMAIL_USER, EMAIL_PASS, EMAIL_RECEIVER 환경변수가 필요합니다. 이메일 전송을 건너뜁니다.');
        console.log('\n--- Report Preview ---\n');
        console.log(markdownContent);
        return;
    }

    const htmlBody = await marked(markdownContent);

    const reportDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const fullHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif;
            line-height: 1.7;
            color: #1a1a2e;
            max-width: 800px;
            margin: 0 auto;
            padding: 0;
            background-color: #f8fffe;
        }
        .header {
            background: linear-gradient(135deg, #0D9488, #134E4A);
            color: white;
            padding: 32px 24px;
            text-align: center;
            border-radius: 0 0 16px 16px;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 22px;
            font-weight: 700;
        }
        .header .subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 24px;
        }
        h1 { color: #0D9488; font-size: 20px; border-bottom: 2px solid #0D9488; padding-bottom: 8px; margin-top: 32px; }
        h2 { color: #134E4A; font-size: 17px; margin-top: 24px; }
        h3 { color: #0F766E; font-size: 15px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 13px;
        }
        th {
            background-color: #0D9488;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 8px 12px;
            border-bottom: 1px solid #e0f2f1;
        }
        tr:nth-child(even) { background-color: #f0fdfa; }
        tr:hover { background-color: #ccfbf1; }
        code {
            background-color: #f0fdfa;
            border: 1px solid #99f6e4;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
            color: #0F766E;
        }
        pre {
            background-color: #f0fdfa;
            border: 1px solid #99f6e4;
            border-radius: 8px;
            padding: 16px;
            overflow-x: auto;
            font-size: 13px;
        }
        blockquote {
            border-left: 4px solid #0D9488;
            margin: 16px 0;
            padding: 12px 16px;
            background-color: #f0fdfa;
            border-radius: 0 8px 8px 0;
        }
        ul, ol { padding-left: 24px; }
        li { margin-bottom: 6px; }
        strong { color: #134E4A; }
        .footer {
            text-align: center;
            padding: 24px;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e0f2f1;
            margin-top: 32px;
        }
        .badge {
            display: inline-block;
            background: #0D9488;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 쉬운재테크 3일 주기 AI 성장 리포트</h1>
        <div class="subtitle">${reportDate} | 분석 기간: ${gscData.period.current}</div>
    </div>
    <div class="content">
        ${htmlBody}
    </div>
    <div class="footer">
        <p>이 리포트는 Google Search Console, GA4, Cloudflare Workers AI를 활용하여 자동 생성되었습니다.</p>
        <p>&copy; 2026 쉬운재테크 Automation | <a href="https://www.easyzetec.com" style="color: #0D9488;">easyzetec.com</a></p>
    </div>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"쉬운재테크 분석 도우미" <${EMAIL_USER}>`,
        to: EMAIL_RECEIVER,
        subject: `📊 쉬운재테크 성장 리포트 - ${reportDate}`,
        html: fullHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] 리포트 이메일 발송 완료: ${info.messageId}`);
}

// --- Main ---

async function main() {
    console.log('=== 쉬운재테크 3일 주기 AI 성장 리포트 ===\n');

    // Step 1: Authenticate
    console.log('[1/4] Google API 인증 중...');
    const authClient = await authenticateGoogle();

    // Step 2: Fetch GSC data
    console.log('[2/4] Search Console 데이터 수집 중...');
    let gscData;
    try {
        gscData = await fetchSearchConsoleData(authClient);
        console.log(`  - 현재 키워드: ${gscData.currentQueries.length}개`);
        console.log(`  - 이전 키워드: ${gscData.prevQueries.length}개`);
        console.log(`  - 현재 페이지: ${gscData.currentPages.length}개`);
    } catch (error: any) {
        console.warn(`  ⚠️ GSC 데이터 수집 실패 (${error.code || error.message}). GA4 데이터만으로 리포트를 생성합니다.`);
        const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(now.getDate() - 6);
        const fmt = (d: Date) => d.toISOString().split('T')[0];
        gscData = {
            currentQueries: [],
            prevQueries: [],
            currentPages: [],
            prevPages: [],
            period: {
                current: `${fmt(threeDaysAgo)} ~ ${fmt(now)}`,
                previous: `${fmt(sixDaysAgo)} ~ ${fmt(threeDaysAgo)}`,
            },
        };
    }

    // Step 3: Fetch GA4 data
    console.log('[3/4] GA4 데이터 수집 중...');
    const ga4Data = await fetchGA4Data(authClient);
    console.log('  - 트래픽 데이터 수집 완료');

    // Step 4: Generate AI insights
    console.log('[4/4] Cloudflare Workers AI 분석 중...');
    const insights = await generateGeminiInsights(gscData, ga4Data);

    // Send email report
    console.log('\n[Email] 리포트 이메일 발송 중...');
    await sendEmailReport(insights, gscData);

    console.log('\n=== 리포트 생성 완료 ===');
}

main().catch((error) => {
    console.error('리포트 생성 실패:', error);
    process.exit(1);
});
