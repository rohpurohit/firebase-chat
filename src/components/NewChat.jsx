import React, { useState } from "react";
import { users } from "../constants";
import CheckBox from "./CheckBox";

const NewChat = ({ localUsers, setUsers, createGroupAndStartChat }) => {
  const addUser = (user) => {
    const prevUsers = [...localUsers];
    prevUsers.push(user);
    setUsers(prevUsers);
  };

  return (
    <>
      {users &&
        users.map((user) => {
          const { id } = user;
          return (
            <CheckBox
              key={`user-${id}-${name}`}
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
