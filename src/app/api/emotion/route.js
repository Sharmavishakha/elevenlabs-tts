// app/api/emotion/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  const { messages } = await req.json()

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You're an emotion-aware assistant. Read this chat history:
${messages.map(m => `${m.role}: ${m.text}`).join('\n')}

Determine the user's dominant emotion (only one): sad, angry, or happy.
Then based on that:
- If sad: generate a short soothing poem.
- If angry: describe a calm visual scene (like a peaceful lake, rain, or forest).
- If happy: return a joyful message or uplifting surprise.

Respond in this format:
Emotion: <emotion>
Response: <generated content>
`

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7
      }
    })

    const response = await result.response
    const text = response.text()

    return NextResponse.json({ success: true, content: text })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
