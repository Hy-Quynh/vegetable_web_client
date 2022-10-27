import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import socketIOClient from "socket.io-client";
import { createUserChatReply, getChatByUserId } from "../../../services/chat";
import { CHAT_HOST, USER_INFO_KEY } from "../../../utils/constants";
import style from "./style.module.scss";

export default function UserChat(props) {
  const { user } = props;
  const [socketId, setSocketId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userListMessage, setUserListMessage] = useState([]);
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(CHAT_HOST);
    socketRef.current.on("getId", (data) => {
      setSocketId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      setUserListMessage(dataGot?.data);
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (user?.user_id) {
        const userMessage = await getChatByUserId(user?.user_id);
        const { payload } = userMessage?.data;
        if (payload) {
          setUserListMessage(payload);
        }
      } else {
        if (userListMessage?.length) setUserListMessage([]);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (setChatMessage?.length) {
      setChatMessage("");
    }
  }, [user]);

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "45px",
          padding: "10px",
          boxSizing: "border-box",
          borderTop: "1px solid rgb(44, 206, 244)",
          borderLeft: "1px solid rgb(44, 206, 244)",
          borderRight: "1px solid rgb(44, 206, 244)",
          fontWeight: 700,
        }}
      >
        {(user?.first_name || "") + " " + (user?.last_name || "")}
      </div>
      <div
        style={{
          position: "absolute",
          height: "calc(84vh - 65px - 45px)",
          overflowY: "auto",
          width: "100%",
          paddingRight: "15px",
        }}
        className={style.AdminChatMessageFrame}
      >
        {userListMessage?.map((item, index) => {
          return (
            <div
              className={`message ${
                item?.reply_message ? "message-right" : "message-left"
              }`}
            >
              <div
                className={`bubble ${
                  item?.reply_message ? "bubble-dark" : "bubble-light"
                }`}
              >
                {item?.message || item?.reply_message || ""}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className={style.AdminChattypeArea}>
          <div className="input-wrapper">
            <input
              type="text"
              id="inputText"
              placeholder="Nhập tin nhắn vào đây..."
              value={chatMessage}
              onChange={(event) => {
                setChatMessage(event.target.value);
              }}
            />
          </div>
          <button
            disabled={!user?.user_id}
            className="button-send"
            onClick={async () => {
              if (!chatMessage?.trim()?.length) {
                return toast.error("Tin nhắn không thể bỏ trống");
              }
              const createRes = await createUserChatReply(
                user?.user_id,
                chatMessage?.trim(),
                userData?.admin_id
              );
              if (createRes?.data?.success) {
                setChatMessage("");
                socketRef.current.emit("sendDataClient", user?.user_id);
              } else {
                toast.error("Gửi tin nhắn thất bại, vui lòng thử lại sau");
              }
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
