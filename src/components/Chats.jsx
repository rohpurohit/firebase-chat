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
} from "firebase/firestore";
import React, { useState } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { docExists } from "../constants";
import ChatRoom from "./ChatRoom";
import NewChat from "./NewChat";

const Chats = ({ author, uid }) => {
  const firestore = useFirestore();
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
  const names = localUsers.map(({ name }) => name.split(" ")[0]);
  const ids = localUsers.map(({ id }) => id);

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
    names.forEach((name) => {
      const obj = { name: name.split(" ")[0], readCount: 0 };
      participantsArr.push(obj);
    });
    const newDoc = await addDoc(collection(firestore, "groups"), {
      name: names.join(),
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
          <ChatRoom docId={docId} uid={uid} author={author} />
        </>
      )}
    </>
  );
};

export default Chats;
