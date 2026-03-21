# MediCare Server API

The backend for the MediCare platform, built on a modern **Node.js** architecture utilizing **Express 5.x**.

## 🛠 Tech Stack
- **Framework**: Express 5.x (Modern routing, strict path-to-regexp parsing)
- **Runtime**: Node.js 22.x
- **Database**: MongoDB via Mongoose
- **Real-time**: Socket.io
- **Mailing**: Nodemailer
- **Environment**: Dotenv for secret management

## 📁 Key Directories
- `/api`: Aggregated API endpoints and route registration.
- `/config`: Database connections and middleware configurations.
- `/controller`: Business logic for various modules (Medicine, Patient, Wellness, Cafeteria).
- `/models`: Mongoose schemas for healthcare and engagement data.
- `/routes`: Specific route definitions.
- `/services`: Core logic services including Blockchain anchoring, AI recommendations, and Email notifications.

## 🚀 Recent Updates
- **Express 5 Migration**: Updated all routes to comply with Express 5 path parsing (replaced old `*` wildcards with compatible catch-all patterns).
- **Module Integration**: Unified PromoTrack (Healthcare), Wellness Tracker (AI Mood logs), and Food Ordering controllers.
- **Enhanced Security**: Integrated IP log tracking and cookie-based JWT authentication.

## 🔐 Authentication & Security Notes
The server uses **HttpOnly Cookies** for JWT storage to prevent XSS attacks.

### Cookie Configuration Summary:
1. **auth_token**: The cookie name used to store the JWT.
2. **httpOnly: true**: Crucial for security; prevents JavaScript from accessing the cookie.
3. **secure: false**: (Current Dev setting) Set to `true` in production for HTTPS.
4. **sameSite: "lax"**: Balance between security (CSRF protection) and usability.

## 🏃 Running Locally
1. Ensure MongoDB is running.
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. The server will start on `http://localhost:5000` by default.

## 📡 Health Check
Perform a GET request to `/health` to verify server status.