# Valetventure

A premium mobile-first travel itinerary planner.

## Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Java 17 + Spring Boot 3.2 + PostgreSQL + JWT

## Features
- 🗺️ Day-by-day trip planning with swipeable cards
- 🏨 Hotel & restaurant management
- 💸 Expense tracking
- 👤 User profiles
- 🌙 Dark/light mode (system default)
- 📱 Mobile-first design

## Local Setup

### Prerequisites
- Java 17+, Maven 3.9+
- Node.js 18+
- PostgreSQL 14+

### Backend
```bash
cd backend
# Edit src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
