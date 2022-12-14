import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { docExists, users } from "../constants";
import ChatRoom from "./ChatRoom";
import CheckBox from "./CheckBox";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import Chats from "./Chats";

const Users = () => {
  const { data: user } = useUser();
  console.log("userData", user);
  // const firestore = useFirestore();
  // const groupsRef = collection(firestore, "groups");
  // const allDocs = query(groupsRef);
  // const { status, data } = useFirestoreCollectionData(allDocs);

  // console.log("data", data);

  return (
    <>
      <header>
        <h1>⚛️🔥💬</h1>
        {user && <SignOut />}
      </header>
      {!user ? (
        <section>
          <SignIn />
        </section>
      ) : (
        <>
          {user && (
            <Chats uid={user.uid} author={user.displayName.split(" ")[0]} />
          )}
        </>
      )}
    </>
  );
};

export default Users;
