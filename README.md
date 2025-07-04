PARKकर 🚗🔍
A Smart, AI‑Powered Parking Management & Live Video Streaming System

🚀 Project Overview
PARKकर is an end‑to‑end parking management solution that combines AI‑driven slot detection with live video streaming to give users real‑time visibility into available parking spaces. By leveraging computer vision, WebSockets, and mapping APIs, PARKकर helps reduce parking search time, minimize congestion, and improve overall urban mobility.

✨ Key Features
🎯 AI‑Based Slot Detection
Uses OpenCV to classify each slot as Free or Occupied in real time

🎥 Live Video Stream
Stream live camera feeds for each parking zone with slot‑status overlays

🌍 Interactive Map & Navigation
Mapbox integration to display parking areas and guide drivers; click‑to‑reserve selected slots

⚡ Real‑Time Updates & Notifications
WebSocket (Socket.IO) pushes slot‑status changes instantly to all clients

🔐 Secure & Role‑Based Access
JWT authentication for drivers, attendants, and admins; encrypted credentials & fine‑grained permissions

🏗️ Tech Stack
Layer	Technology
🖥️ Frontend	HTML5, CSS3, JavaScript PUG
🚀 Backend	Node.js, Express.js
🗄️ Database	MongoDB (Mongoose ORM)
🤖 AI Processing	Python, OpenCV
🔄 Real‑Time Comm.	Socket.IO
🗺️ Mapping	Mapbox GL JS
🛡️ Security	JWT, bcrypt, HTTPS

📸 System Architecture

+------------------------+       Video Stream       +---------------------------+
| Parking Surveillance   | ───────────────────────► | Python AI Processor       |
| (IP/USB Cameras)       |                          | • OpenCV detection        |
+------------+-----------+                          | • Slot status overlay     |
             |                                      | • WebSocket emitter       |
             | RTSP / HTTP                         +-------------+-------------+
             |                                                |
             ▼                                                |
+------------+-----------+           REST & WS          +-----+------+
| Node.js Central API    | ◀──────────────────────────► | FrontendUI |
| • /api/v1/parkings     |    (JSON + Socket.IO)       | • MapView  |
| • /api/stream/:id      |                             | • VideoUI  |
+------------+-----------+                             +------------+
             |
             | MongoDB (slots, users, logs)
             ▼
       +-----------+
       |  MongoDB  |
       +-----------+


🚀 Usage Workflow
Register & Login

Browse Nearby Parking Zones on the map

View Live Camera Feed to confirm availability

Reserve Desired Slot with one click

Receive Real‑Time Updates on reservation expiry

Checkout & Payment using Stripe

🛣️ Roadmap
 Multiple camera inputs & PTZ control

 AI model retraining with custom datasets

 Predictive availability forecasting

 Mobile‑responsive UI

📬 Contact & Support
Email: chauhandhruv245@gmail.com

LinkedIn: dhruvchauhan245

Drive smarter. Park easier. PARKकर your way to hassle‑free parking! 🚗💡
