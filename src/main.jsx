import React from "react";
import ReactDOM from "react-dom/client";
import { initializeApp } from "firebase/app";
import { DatabaseProvider, FirebaseAppProvider } from "reactfire";

import App from "./App";
import "./index.css";
import { getDatabase } from "firebase/database";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

const firebaseConfig = {
  apiKey: "AIzaSyAccOdWqKGOz3AwwTM-8kL3TEEoZ2Wm-74",
  authDomain: "huddl-chat-test.firebaseapp.com",
  databaseURL: "https://huddl-chat-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "huddl-chat-test",
  storageBucket: "huddl-chat-test.appspot.com",
  messagingSenderId: "616259801931",
  appId: "1:616259801931:web:748b3b60c3abad87fc0ece",
  measurementId: "G-811SEKE85N"
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <App />
  </FirebaseAppProvider>
);
