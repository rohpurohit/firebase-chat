import { useState } from "react";
import { getAuth } from "firebase/auth";
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

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <RouterProvider router={router} />
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
