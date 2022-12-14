import { getAuth } from "firebase/auth";
import React from "react";

const SignOut = () => {
  const auth = getAuth();
  return (
    <button className="sign-out" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
};

export default SignOut;
