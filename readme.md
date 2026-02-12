🔍 Option-by-option explanation
1️⃣ "auth_token" (cookie name)
"auth_token"


Name of the cookie

Browser stores it under this name

Backend reads it later (req.cookies.auth_token)

2️⃣ authToken (value)
authToken


Your JWT

Contains user identity (phone, userId, etc.)

Signed by your server

⚠️ Never store OTP here — only auth tokens.

3️⃣ httpOnly: true 🔒 (MOST IMPORTANT)
httpOnly: true


✔ JavaScript cannot access this cookie
✔ Protects from XSS attacks

❌ This fails:

document.cookie // auth_token NOT visible


👉 This is why cookies are safer than localStorage

4️⃣ secure: false 🔐
secure: false


Cookie is sent over HTTP

Used only in development

✅ In production:

secure: true


👉 Ensures cookie is sent only over HTTPS

5️⃣ sameSite: "lax" 🛡️
sameSite: "lax"


Controls cross-site request behavior (CSRF protection).

Value	Meaning
strict	Sent only from same site
lax	Sent on top-level navigation (recommended)
none	Cross-site allowed (needs HTTPS)

✅ lax is best for login flows.

6️⃣ maxAge ⏱️
maxAge: 24 * 60 * 60 * 1000


Cookie expires after 24 hours

User stays logged in for 1 day

Browser auto-deletes after expiry

🔁 What happens after this?
1️⃣ Browser stores cookie
auth_token=JWT_VALUE; HttpOnly

2️⃣ Every API request sends it automatically
GET /api/profile
Cookie: auth_token=JWT_VALUE

3️⃣ Backend verifies token
jwt.verify(req.cookies.auth_token, SECRET)

4️⃣ User is authenticated 🎉
🔐 Why this is SAFE (compared to localStorage)
Storage	XSS Safe	Auto sent	Recommended
localStorage	❌	❌	NO
sessionStorage	❌	❌	NO
HttpOnly cookie	✅	✅	YES
🚀 Production-ready version
res.cookie("auth_token", authToken, {
  httpOnly: true,
  secure: true,       // HTTPS only
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000
});

🧠 TL;DR

This line securely logs the user in by storing the JWT in a protected browser cookie that JavaScript cannot touch.

If you want, next I can:

Show middleware to read this cookie

Explain logout (cookie clear)

Explain CSRF protection

Compare cookie vs Authorization header

Show Postman testing

Just say 👍