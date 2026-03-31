import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { city, month } = body

    if (!city || !month) {
      return NextResponse.json(
        { error: 'City and month are required' },
        { status: 400 }
      )
    }

    // Step 1 — Get weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    )

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: 'City not found. Please check the spelling.' },
        { status: 404 }
      )
    }

    const weather = await weatherRes.json()

    const weatherInfo = {
      city: weather.name,
      country: weather.sys.country,
      temp: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      description: weather.weather[0].description,
      windSpeed: weather.wind.speed,
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are an expert agronomist. A farmer is in ${weatherInfo.city}, ${weatherInfo.country} and planning for ${month}.

Current weather:
- Temperature: ${weatherInfo.temp}°C (feels like ${weatherInfo.feelsLike}°C)
- Humidity: ${weatherInfo.humidity}%
- Condition: ${weatherInfo.description}
- Wind speed: ${weatherInfo.windSpeed} m/s

Based on this location, weather and month, recommend 6 suitable crops.
Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "summary": "2 sentence explanation of why these crops suit this season",
  "crops": [
    { "name": "Wheat", "emoji": "🌾", "reason": "short reason under 10 words" },
    { "name": "Tomato", "emoji": "🍅", "reason": "short reason under 10 words" }
  ]
}`

    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const clean = raw.replace(/```json|```/g, '').trim()
    const cropData = JSON.parse(clean)

    return NextResponse.json({
      weather: weatherInfo,
      ...cropData
    })

  } catch (error) {
    console.error('Crop API Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}