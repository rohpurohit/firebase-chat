import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useFirestore } from "reactfire";
import { addDoc, collection } from "firebase/firestore";

const SignIn = () => {
  const firestore = useFirestore();
  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    await addDoc(collection(firestore, "tavant-users"), {
      name: user.user.displayName,
      email: user.user.email,
      uid: user.user.uid,
      profileUrl: user.user.photoURL,
    });
  };
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  );
};

export default SignIn;
