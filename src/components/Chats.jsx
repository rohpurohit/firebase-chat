import {
  collection,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  useDatabase,
  useDatabaseObjectData,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { docExists, users } from "../constants";
import ChatRoom from "./ChatRoom";
import NewChat from "./NewChat";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
} from "firebase/database";
import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";

const Chats = ({ author, uid }) => {
  const [isOnline, setIsOnline] = useState();
  const firestore = useFirestore();
  const database = useDatabase();
  const messagesRef = collection(firestore, "groups");
  const messagesQuery = query(
    messagesRef,
    where("showChats", "array-contains", author)
  );
  const { status, data: chats } = useFirestoreCollectionData(messagesQuery);
  const [openChat, setOpenChat] = useState(false);
  const [docId, setDocId] = useState("");
  const [localUsers, setUsers] = useState([]);
  const [startChat, setStartChat] = useState(false);
  const names = localUsers.map(({ uid }) => uid);
  const chatNames = localUsers.map(({ name }) => name);
  const ids = localUsers.map(({ id }) => id);
  const statusRef = ref(database, "status");
  const userRef = ref(database, "status/" + uid);
  const databaseOn = ref(database, "status/" + uid + "online");
  const { dataStatus, data: onlineUsers } = useDatabaseObjectData(statusRef);

  const isOfflineForDatabase = {
    online: false,
    lastSeen: serverTimestamp(),
  };

  const isOnlineForDatabase = {
    online: true,
    lastSeen: new Date().getTime(),
  };
  useEffect(() => {
    const createUser = async () => {
      set(userRef, isOnlineForDatabase);
    };

    const connectedRef = ref(database, ".info/connected");
    const lastOnlineRef = ref(database, `status/${uid}/lastSeen`);
    const onlineRef = ref(database, `status/${uid}/online`);
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // console.log("connected");
        onDisconnect(lastOnlineRef).set(new Date().getTime());
        onDisconnect(onlineRef).set(false);
      } else {
        // console.log("not connected");
      }
    });

    onMessage((payload) => {
      console.log("Message received. ", payload.notification.body);
      this.context.setToastMessage("info", payload.notification.body);
    });

    createUser();
  }, []);

  const createGroupAndStartChat = async () => {
    setUsers([]);
    const sumOfIds = docExists(ids);
    const doc = chats.find(({ uid }) => uid === sumOfIds);
    // console.log("findData", doc);
    if (doc) {
      setDocId(doc.NO_ID_FIELD);
      setOpenChat(true);
      setStartChat(false);
      return;
    }
    const participantsArr = [];
    localUsers.forEach(({ name }) => {
      const obj = { name: name.split(" ")[0], readCount: 0 };
      participantsArr.push(obj);
    });
    const newDoc = await addDoc(collection(firestore, "groups"), {
      name: chatNames.join(),
      uid: sumOfIds,
      createdAt: serverTimestamp(),
      participants: participantsArr,
      showChats: names,
      length: names.length,
    });
    // console.log("newDoc", newDoc);
    setDocId(newDoc.id);
    setStartChat(false);
    setOpenChat(true);
  };

  const openChatOnClick = (id) => {
    setDocId(id);
    setOpenChat(true);
  };

  const goBackToChats = async () => {
    const docRef = doc(firestore, "groups", docId);
    const docData = await (await getDoc(docRef)).data();
    const tempParticipants = [...docData.participants];
    const index = tempParticipants.findIndex(({ name }) => name === author);
    if (index !== -1) {
      tempParticipants[index].readCount = docData.messageCount;
      // tempParticipants[index].lastSeen = serverTimestamp();
    }
    await updateDoc(docRef, {
      participants: tempParticipants,
    });
    setOpenChat(false);
  };

  return (
    <>
      {!openChat ? (
        <>
          {!startChat ? (
            <>
              {chats &&
                chats.map(
                  ({
                    name,
                    NO_ID_FIELD,
                    participants,
                    messageCount = 0,
                    latestMessage,
                  }) => {
                    let unread = false;
                    const currentUser = participants.find(
                      ({ name }) => name.split(" ")[0] === author
                    );
                    let unreadCount = 0;
                    if (currentUser) {
                      if (currentUser.lastSeen > latestMessage) unread = true;
                      if (messageCount > currentUser.readCount)
                        unreadCount = messageCount - currentUser.readCount;
                    }
                    return (
                      <>
                        <div
                          style={{
                            backgroundColor: unread ? "orange" : "white",
                            color: "black",
                            cursor: "pointer",
                            margin: "1em",
                            position: "relative",
                          }}
                          key={name}
                          onClick={() => openChatOnClick(NO_ID_FIELD)}
                        >
                          {name}
                          <div
                            style={{
                              backgroundColor: "#fa3e3e",
                              borderRadius: "50%",
                              color: "yellow",
                              padding: "0px 5px",
                              fontSize: "10px",
                              position: "absolute",
                              top: "0",
                              right: "0",
                            }}
                          >
                            {unreadCount > 0 && unreadCount}
                          </div>
                        </div>
                      </>
                    );
                  }
                )}
              <button onClick={() => setStartChat(true)} className="sign-out">
                Start a new chat
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStartChat(false)} className="sign-out">
                Go back
              </button>
              <NewChat
                localUsers={localUsers}
                setUsers={setUsers}
                createGroupAndStartChat={createGroupAndStartChat}
              />
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={goBackToChats} className="sign-out">
            Go back
          </button>
          <ChatRoom
            onlineUsers={onlineUsers}
            docId={docId}
            uid={uid}
            author={author}
          />
        </>
      )}
    </>
  );
};

export default Chats;
