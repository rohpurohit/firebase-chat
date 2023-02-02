import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  useDatabase,
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from "reactfire";
import { docExists, users } from "../constants";
import ChatRoom from "./ChatRoom";
import CheckBox from "./CheckBox";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import Chats from "./Chats";
import { getMessaging, getToken } from "firebase/messaging";
import { ref, set } from "firebase/database";

const Users = () => {
  const { data: user } = useUser();
  const messaging = getMessaging();
  const firestore = useFirestore();
  const database = useDatabase();

  const isOnlineForDatabase = {
    online: true,
    lastSeen: new Date().getTime(),
  };
  useEffect(() => {
    async function saveMessagingDeviceToken() {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: `BCSKavgcVJ9oAOHrsfDb4WcHULk_dx6Gx7nBgUDdfOYrmpCUwwG1XJxqmq_V7f3iE76yStIZXLDSqTPv5oZeRco`,
        });
        if (currentToken) {
          console.log("Got FCM device token:", currentToken);
          // Saving the Device Token to Cloud Firestore.
          const tokenRef = doc(firestore, "fcmTokens", currentToken);
          const userRef = ref(database, "status/" + user.uid);
          await updateDoc(doc(firestore, "tavant-users", user.uid), {
            token: currentToken,
          });
          set(userRef, isOnlineForDatabase);
          await setDoc(tokenRef, { uid: user.uid });
          const connectedRef = ref(database, ".info/connected");
          const lastOnlineRef = ref(database, `status/${user.uid}/lastSeen`);
          const onlineRef = ref(database, `status/${user.uid}/online`);
          onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
              // console.log("connected");
              set(onlineRef, true);
              onDisconnect(lastOnlineRef).set(new Date().getTime());
              onDisconnect(onlineRef).set(false);
            } else {
              // console.log("not connected");
            }
          });

          // This will fire when a message is received while the app is in the foreground.
          // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
          onMessage(getMessaging(), (message) => {
            console.log(
              "New foreground notification from Firebase Messaging!",
              message.notification
            );
          });
        } else {
          // Need to request permissions to show notifications.
          requestNotificationsPermissions();
        }
      } catch (error) {
        console.error("Unable to get messaging token.", error);
      }
    }
    messaging && user && saveMessagingDeviceToken();
  }, [user, messaging]);

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
