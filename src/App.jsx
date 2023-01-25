import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import reactLogo from "./assets/react.svg";
import "./App.css";
import useGetAllUsers from "./hooks/useGetAllUsers";
import { getFirestore } from "firebase/firestore";
import SignIn from "./components/SignIn";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useAuth,
  useFirebaseApp,
} from "reactfire";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRoom from "./components/ChatRoom";
import Users from "./components/Users";
import Chats from "./components/Chats";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/chats",
    element: <Chats />,
  },
]);
function App() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const messaging = getMessaging();

  useEffect(() => {
    messaging &&
      getToken(messaging, {
        vapidKey: `BCD8vfg1GUXOem3yg9Ljmt-5EJRSZqN_fdiMCSjYBNg1F3uIil8LEt0og42OlXncxImf1DLXUanHA38MgskFKAw`,
      })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log("FirebaseToken", currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });
    getToken();
  }, [messaging]);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <RouterProvider router={router} />
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
