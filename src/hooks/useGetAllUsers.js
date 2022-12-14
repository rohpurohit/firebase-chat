import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
const useGetAllUsers = (db) => {
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const users = [];
    const getAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
          console.log("users=> ", doc.data());
          users.push(doc.data());
        });
      } catch (error) {
        console.error("firebase get all users error", error);
      }
    };
    getAllUsers();

    setAllUsers(users);
  }, []);
  return allUsers;
};

export default useGetAllUsers;
