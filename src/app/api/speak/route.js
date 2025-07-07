import { NextResponse } from 'next/server'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  const { text } = await req.json()

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      data: {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer',
    })

    const filePath = path.join(process.cwd(), 'public', 'voice.mp3')
    fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'))

    return NextResponse.json({ success: true, audio: '/voice.mp3' })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'TTS failed' }, { status: 500 })
  }
}
