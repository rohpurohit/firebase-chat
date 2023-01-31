import React, { useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  useAuth,
  useFirestoreCollectionData,
  useUser,
} from "reactfire";

const ChatRoom = ({ docId, author, uid, onlineUsers }) => {
  const [openChat, setOpenChat] = useState(false);
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();
  const firestore = useFirestore();
  const docRef = doc(firestore, "groups", docId);
  const messagesRef = collection(firestore, "groups", docId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt"));
  const { status, data: messages } = useFirestoreCollectionData(messagesQuery);
  const { data: docData } = useFirestoreDocData(docRef);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msgCount = docData?.messageCount ? docData?.messageCount + 1 : 1;
    try {
      await addDoc(collection(firestore, "groups", docId, "messages"), {
        text: formValue,
        author,
        uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(docRef, {
        messageCount: msgCount,
        // this is the last message timestamp
        latestMessage: serverTimestamp(),
      });
    } catch (error) {
      console.error("add message error", error);
    }

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map(({ text, author, uid: msgUid, NO_ID_FIELD }) => {
            const messageClass = msgUid === uid ? "sent" : "received";

            return (
              <React.Fragment key={NO_ID_FIELD}>
                <div
                  className={`message ${messageClass}`}
                  style={{
                    fontStyle: "italic",
                    color: "white",
                  }}
                >
                  {author}{" "}
                  {onlineUsers[msgUid] && onlineUsers[msgUid].online
                    ? "(online)"
                    : "(away)"}
                </div>
                <div className={`message ${messageClass}`}>
                  <p>{text}</p>
                </div>
              </React.Fragment>
            );
          })}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
};

export default ChatRoom;
