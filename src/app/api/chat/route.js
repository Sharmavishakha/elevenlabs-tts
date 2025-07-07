import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  const { message } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })  // or gemini-1.5-pro

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 150,  // ✅ Only limit the output
        temperature: 0.7,
        topK: 40,
        topP: 0.9
      }
    })

    const response = result.response
    const text = response.text()

    return NextResponse.json({ success: true, reply: text })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Gemini failed' }, { status: 500 })
  }
}
