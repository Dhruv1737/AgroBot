🌱 AgroBot — AI-Powered Agricultural Assistant

Empowering farmers with AI-driven plant disease detection and smart crop recommendations.

📌 Overview AgroBot is a full-stack AI-powered web application built to assist farmers in making smarter agricultural decisions. It leverages Google's Gemini 2.5 Flash model to detect plant diseases from images or text descriptions, and recommends the most suitable crops based on real-time weather data and the farmer's location. Built for the modern farmer

✨ Features 🔬 Plant Disease Detection

Text Mode — Describe symptoms in plain language and get an instant AI diagnosis Voice Mode — Speak symptoms using the browser's built-in Speech Recognition API Image Mode — Upload a photo of a plant or leaf and let Gemini analyze it visually Returns disease name, severity, symptoms, and actionable treatment steps

🌾 Crop Recommendation

Enter your location and current month Fetches real-time weather data (temperature, humidity, wind speed) via OpenWeatherMap API Gemini analyzes agro-climatic conditions and recommends 6 suitable crops with reasons Results displayed with crop emojis, names, and tailored reasoning

🛠️ Tech Stack LayerTechnologyFrontendNext.js 15, React, Tailwind CSSAI ModelGoogle Gemini 2.5 Flash APIWeatherOpenWeatherMap APIVoice InputWeb Speech API (browser native)

📁 Project Structure AgroBot/ ├── app/ │ ├── api/ │ │ ├── disease/ │ │ │ └── route.js │ │ └── crop/ │ │ └── route.js │ ├── disease/ │ │ └── page.jsx │ ├── crop/ │ │ └── page.jsx │ └── page.jsx ├── public/ ├── .env.local └── README.md

🚀 Getting Started Prerequisites

Node.js 18+ A Google Gemini API key An OpenWeatherMap API key

🔌 API Routes POST /api/disease Analyzes plant disease from text or image. Request Body: json{ "text": "Yellow spots on leaves with wilting", "imageBase64": "base64_encoded_image_string", "imageMime": "image/jpeg" } Response: json{ "result": "PLANT_DETECTED\nPlant/Crop: Tomato\nStatus: Disease detected\n..." } POST /api/crop Recommends crops based on location and month. Request Body: json{ "city": "Bhopal", "month": "June" } Response: json{ "weather": { "temp": 32, "humidity": 75, "description": "haze" }, "summary": "June in Bhopal brings pre-monsoon conditions ideal for...", "crops": [ { "name": "Soybean", "emoji": "🫘", "reason": "Thrives in pre-monsoon humidity" } ] }

🗺️ Roadmap

Plant disease detection (text, voice, image) Crop recommendation with live weather data Multilingual support (Hindi, regional languages) Offline mode for low-connectivity rural areas

👨‍💻 Author Dhruv Sharma
