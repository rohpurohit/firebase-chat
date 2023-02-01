importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAccOdWqKGOz3AwwTM-8kL3TEEoZ2Wm-74",
  authDomain: "huddl-chat-test.firebaseapp.com",
  databaseURL: "https://huddl-chat-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "huddl-chat-test",
  storageBucket: "huddl-chat-test.appspot.com",
  messagingSenderId: "616259801931",
  appId: "1:616259801931:web:748b3b60c3abad87fc0ece",
  measurementId: "G-811SEKE85N"
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
