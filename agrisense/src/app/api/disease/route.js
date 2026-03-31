import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { text, imageBase64, imageMime } = body

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    let result

    if (imageBase64) {
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: imageMime || 'image/jpeg',
            data: imageBase64
          }
        },
        `You are an expert plant pathologist. Analyze this image carefully.

If this image does NOT contain a plant, leaf or crop, respond ONLY with:
NO_PLANT_DETECTED

If it does contain a plant, respond in this format:
PLANT_DETECTED
Plant/Crop: [name]
Status: [Healthy / Disease detected]
Disease Name: [name or None]
Severity: [Mild / Moderate / Severe / N/A]
Symptoms: [brief description]
Precautions & Treatment:
- [point 1]
- [point 2]
- [point 3]
Additional Notes: [any extra advice]
${text ? `Farmer also says: ${text}` : ''}`
      ])
    } else {
      result = await model.generateContent(
        `You are an expert plant pathologist. A farmer describes this problem:

"${text}"

Respond in this format:
PLANT_DETECTED
Plant/Crop: [name if mentioned, else Not specified]
Status: [Healthy / Disease detected]
Disease Name: [name or None]
Severity: [Mild / Moderate / Severe / N/A]
Symptoms: [brief description]
Precautions & Treatment:
- [point 1]
- [point 2]
- [point 3]
Additional Notes: [any extra advice]`
      )
    }

    const response = result.response.text()
    return NextResponse.json({ result: response })

  } catch (error) {
    console.error('Disease API Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}