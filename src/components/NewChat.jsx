import { collection, doc, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CheckBox from "./CheckBox";

const NewChat = ({ localUsers, setUsers, createGroupAndStartChat }) => {
  const firestore = useFirestore();
  const usersRef = collection(firestore, "tavant-users");
  const usersQuery = query(usersRef, orderBy("uid"));
  const { status, data: users } = useFirestoreCollectionData(usersQuery);
  const addUser = (user) => {
    const prevUsers = [...localUsers];
    prevUsers.push(user);
    // console.log("prevUser", user);
    setUsers(prevUsers);
  };
  return (
    <>
      {users &&
        users.map((user) => {
          const { uid, name } = user;
          return (
            <CheckBox
              key={`user-${uid}-${name}`}
              user={user}
              addUser={addUser}
            />
          );
        })}
      <button style={{ color: "black" }} onClick={createGroupAndStartChat}>
        Start chat
      </button>
    </>
  );
};

export default NewChat;
