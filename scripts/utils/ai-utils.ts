import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing!");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function callGemini(
    prompt: string,
    systemInstruction?: string,
    retries: number = 3
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction,
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err: any) {
            const isRetryable = err.status === 429 || err.status === 503;
            if (isRetryable && attempt < retries) {
                const waitMs = Math.pow(2, attempt) * 1000;
                console.warn(`⏳ Rate limit hit. Retrying in ${waitMs / 1000}s... (${attempt}/${retries})`);
                await new Promise(r => setTimeout(r, waitMs));
            } else {
                console.error(`❌ Gemini API failed after ${attempt} attempts: ${err.message}`);
                throw err;
            }
        }
    }
    throw new Error('Gemini API call failed after all retries.');
}

export async function callGeminiJSON<T>(
    prompt: string,
    systemInstruction?: string,
    fallback?: T
): Promise<T> {
    try {
        const raw = await callGemini(prompt, systemInstruction);
        const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned) as T;
    } catch (err: any) {
        console.error(`❌ Failed to parse Gemini JSON: ${err.message}`);
        if (fallback !== undefined) return fallback;
        throw err;
    }
}
