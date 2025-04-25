# 📱 REACT NATIVE TO-DO LIST APP – SETUP & RUN GUIDE

**Frontend Repo:** `frontend`  
**Backend Repo:** `backend`  
**Backend URL (Hosted on Render):** [https://todo-fastapi-apk.onrender.com](https://todo-fastapi-apk.onrender.com)

---

## 📲 Install the App

**App link:** [Download .aab File](https://expo.dev/artifacts/eas/hhBxaET9VVvtcZWEYby9iB.aab)  
**OR Scan the QR Code below to install:**  
![scan_me](https://api.qrserver.com/v1/create-qr-code/?data=https://expo.dev/artifacts/eas/hhBxaET9VVvtcZWEYby9iB.aab&size=200x200)

---

## ✅ PREREQUISITES

Ensure the following tools are installed:

| Tool               | Purpose                          | Install Guide               |
|--------------------|----------------------------------|-----------------------------|
| Node.js            | JavaScript runtime               | [nodejs.org](https://nodejs.org) |
| Expo CLI           | Run React Native apps            | [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) |
| Git                | Clone GitHub repo                | [git-scm.com](https://git-scm.com) |
| Expo Go app        | Test the app on your device      | [expo.dev](https://expo.dev/client) or Google Play Store |

---

## 🧩 STEP 1: CLONE THE FRONTEND REPOSITORY

```bash
git clone https://github.com/your-username/frontend.git
cd frontend
```

---

## 📦 STEP 2: INSTALL DEPENDENCIES

```bash
npm install
# or
yarn install
```

---

## 🔗 STEP 3: CONNECT TO THE BACKEND

Inside your React Native project, locate the file where the API URL is defined (e.g., `App.js` or `api.js`).

Make sure the URL is set to:

```js
const API_URL = 'https://todo-fastapi-apk.onrender.com';
```

This connects your frontend to the deployed FastAPI backend.

---

## 🟣 STEP 4: RUN THE REACT NATIVE APP

### ✅ Option 1: Using Expo

```bash
npx expo start
```

A QR code will appear.  
Scan it using the **Expo Go** app on your phone to launch the app.

---

## ✨ APP FEATURES

- ✅ Add, edit, delete tasks  
- ✅ Mark tasks as complete/incomplete  
- ✅ Filter tasks by status (All, Completed, Pending)  
- ✅ Dark mode and light mode toggle 🌑🌞  
- ✅ Stylish Black & Pink UI theme 🎀

---

## 🧪 STEP 5: VERIFY BACKEND COMMUNICATION

Open this link in your browser to check if the backend is working:

[🔗 https://todo-fastapi-apk.onrender.com/tasks](https://todo-fastapi-apk.onrender.com/tasks)

> ℹ️ Note: On first load, Render may take a few seconds to "wake up."

---

## 🚀 Happy Tasking!
