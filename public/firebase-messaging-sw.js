importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyADRsMXqv8T97F0HLIBe-7Cex9GrqsVjsQ",
  authDomain: "fir-chat-8efa3.firebaseapp.com",
  projectId: "fir-chat-8efa3",
  storageBucket: "fir-chat-8efa3.appspot.com",
  messagingSenderId: "349687834948",
  appId: "1:349687834948:web:a4d6e3b1bd769addc34f11",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
let count = 0;

messaging.onBackgroundMessage((payload) => {
  count++;

  console.log(
    "🚀 ~ file: firebase-messaging-sw.js ~ line 33 ~ messaging.onBackgroundMessage ~ count",
    count
  );
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});
