import React from "react";
import ReactDOM from "react-dom/client";
import { initializeApp } from "firebase/app";
import { FirebaseAppProvider } from "reactfire";

import App from "./App";
import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyADRsMXqv8T97F0HLIBe-7Cex9GrqsVjsQ",
  authDomain: "fir-chat-8efa3.firebaseapp.com",
  projectId: "fir-chat-8efa3",
  storageBucket: "fir-chat-8efa3.appspot.com",
  messagingSenderId: "349687834948",
  appId: "1:349687834948:web:a4d6e3b1bd769addc34f11",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>
);
