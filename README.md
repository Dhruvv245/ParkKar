# PARKकर 🚗🔍  
_A Smart, AI‑Powered Parking Management & Live Video Streaming System_

---

## 🚀 Project Overview  
**PARKकर** is a full‑stack, microservice-based smart parking system combining **AI-driven slot detection** with **real-time video streaming**. Designed to optimize urban parking, it gives users visibility into available spaces, reduces search time, and enhances efficiency — powered by **OpenCV**, **FastAPI**, **Node.js**, and **Socket.IO**.

---

## ✨ Key Features  

- 🎯 **AI‑Based Slot Detection**  
  Each parking slot is continuously analyzed using **OpenCV**, detecting occupancy status in real time  

- 🎥 **Live Video Stream**  
  View actual camera feeds for parking zones using MJPEG streams with dynamic slot updates  

- ⚡ **Real‑Time Updates via WebSockets**  
  Uses **Socket.IO** to broadcast slot availability to all users instantly  

- 🌍 **Interactive Map Interface**  
  Mapbox integration displays parking zones, lets users preview feeds, and navigate to spots  

- 🔐 **Secure, Role‑Based Access**  
  Admins, attendants, and drivers are protected via **JWT**, with fine-grained permissions and secure authentication  

---

## 🏗️ Tech Stack  

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| 🖥️ Frontend        | HTML5, CSS3, JavaScript, PUG      |
| 🚀 Backend (UI/API)| Node.js, Express.js               |
| 📡 Microservice     | Python, FastAPI, OpenCV           |
| 🔄 Realtime Comm.  | Socket.IO (WebSocket)             |
| 🗄️ Database        | MongoDB (via Mongoose)            |
| 🗺️ Mapping         | Mapbox GL JS                      |
| 📦 Deployment      | Docker + Railway (Containers)     |
| 🛡️ Security        | JWT, bcrypt, HTTPS                |

---

## ⚙️ Microservice Architecture

      +-------------------------------+
      |     Client (Browser/PWA)      |
      |-------------------------------|
      | Socket.IO Client              |
      | MJPEG video stream (via <img>)|
      | REST API calls (Express)      |
      +---------------+---------------+
                      |
     WebSocket + REST |          
                      v
      +---------------+---------------+
      |     Node.js Backend (SSR)     |
      |-------------------------------|
      | Express + Socket.IO           |
      | MongoDB (parkings, users)     |
      | Receives slot updates         |
      | Emits freeSlotsUpdate events  |
      +---------------+---------------+
                      |
    Slot Status JSON  |   
                      v
      +---------------+---------------+
      | Python Microservice (FastAPI) |
      |-------------------------------|
      | OpenCV + Detection Logic      |
      | MJPEG stream (/stream/:id)    |
      | Slot updates to Node via REST |
      +-------------------------------+

---

## 🔁 Communication Flow

### ✅ Slot Status Update  
1. Python detects change in occupancy  
2. Sends `POST` to Node.js: `/api/v1/parkings/slot-update`  
3. Node validates and emits `freeSlotsUpdate-<id>` via Socket.IO  
4. Frontend updates slot UI in real-time

### 🎥 Live Stream  
1. Python serves MJPEG via `/stream/<parkingId>`  
2. Node renders it via an `<img>` tag in the frontend  
3. Stream updates in sync with slot detection

---
📌 Current Features in Production
 Live slot detection and MJPEG feed per lot

 Real-time slot update syncing

 Socket.IO push updates

 Admin + Owner dashboards

 Map view with reservation options

🛣️ Roadmap
 Multi-camera fusion

 Slot reservation expiration timers

 SMS/Push notification integration

 Native mobile app

 Enhanced analytics dashboard

 Contact & Support
📧 Email: chauhandhruv245@gmail.com

🔗 LinkedIn: dhruvchauhan245

📂 Source Code:

Node.js: [parkkar](https://github.com/Dhruvv245/ParkKar)

Python Microservice: [slot-detection](https://github.com/Dhruvv245/parkkar-slotdetection-microservice)


Drive smarter. Park easier. PARKकर your way to hassle‑free parking! 🚗💡

