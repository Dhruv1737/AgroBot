🌱 AgroBot — AI-Powered Agricultural Assistant

Empowering farmers with AI-driven plant disease detection and smart crop recommendations.


📌 Overview
AgroBot is a full-stack AI-powered web application built to assist farmers in making smarter agricultural decisions. It leverages Google's Gemini 2.5 Flash model to detect plant diseases from images or text descriptions, and recommends the most suitable crops based on real-time weather data and the farmer's location.
Built for the modern farmer — simple, fast, and accessible even on mobile.

✨ Features
🔬 Plant Disease Detection

Text Mode — Describe symptoms in plain language and get an instant AI diagnosis
Voice Mode — Speak symptoms using the browser's built-in Speech Recognition API
Image Mode — Upload a photo of a plant or leaf and let Gemini analyze it visually
Returns disease name, severity, symptoms, and actionable treatment steps

🌾 Crop Recommendation

Enter your location and current month
Fetches real-time weather data (temperature, humidity, wind speed) via OpenWeatherMap API
Gemini analyzes agro-climatic conditions and recommends 6 suitable crops with reasons
Results displayed with crop emojis, names, and tailored reasoning


🛠️ Tech Stack
LayerTechnologyFrontendNext.js 15, React, Tailwind CSSAI ModelGoogle Gemini 2.5 Flash APIWeatherOpenWeatherMap APIVoice InputWeb Speech API (browser native)

📁 Project Structure
AgroBot/
├── app/
│   ├── api/
│   │   ├── disease/
│   │   │   └── route.js
│   │   └── crop/
│   │       └── route.js
│   ├── disease/
│   │   └── page.jsx
│   ├── crop/
│   │   └── page.jsx
│   └── page.jsx
├── public/
├── .env.local
└── README.md

🚀 Getting Started
Prerequisites

Node.js 18+
A Google Gemini API key
An OpenWeatherMap API key

# 1. Clone the repository
git clone https://github.com/Dhruv1737/AgroBot.git
cd AgroBot

# 2. Install dependencies
npm install


Environment Variables
Create a .env.local file in the root directory:
envGEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_openweather_api_key_here
bash# 3. Run the development server
npm run dev
Open http://localhost:3000 in your browser.

🔌 API Routes
POST /api/disease
Analyzes plant disease from text or image.
Request Body:
json{
  "text": "Yellow spots on leaves with wilting",
  "imageBase64": "base64_encoded_image_string",
  "imageMime": "image/jpeg"
}
Response:
json{
  "result": "PLANT_DETECTED\nPlant/Crop: Tomato\nStatus: Disease detected\n..."
}
POST /api/crop
Recommends crops based on location and month.
Request Body:
json{
  "city": "Bhopal",
  "month": "June"
}
Response:
json{
  "weather": { "temp": 32, "humidity": 75, "description": "haze" },
  "summary": "June in Bhopal brings pre-monsoon conditions ideal for...",
  "crops": [
    { "name": "Soybean", "emoji": "🫘", "reason": "Thrives in pre-monsoon humidity" }
  ]
}

🗺️ Roadmap

 Plant disease detection (text, voice, image)
 Crop recommendation with live weather data
 IoT sensor integration (soil pH, moisture, NPK)
 ML model integration (trained on 25–30 years of pan-India crop data)
 Multilingual support (Hindi, regional languages)
 Offline mode for low-connectivity rural areas
 Mobile app (React Native)


👨‍💻 Author
Dhruv Sharma

GitHub: @Dhruv1737
LinkedIn: dhruv-sharma-a193463


<p align="center">Made with ❤️ for farmers across India</p>
