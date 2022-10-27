import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ForumIcon from "@mui/icons-material/Forum";
import CloseIcon from "@mui/icons-material/Close";
import socketIOClient from "socket.io-client";
import { CHAT_HOST, USER_INFO_KEY } from "../../utils/constants";
import { toast } from "react-toastify";
import { createUserChat, getChatByUserId } from "../../services/chat";

export default function UserLayout({ children }) {
  const [visibleChatBox, setVisibleChatBox] = useState(false);
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
      if (userData?.user_id) {
        const userMessage = await getChatByUserId(userData?.user_id);
        const { payload } = userMessage?.data;
        if (payload?.length) {
          setUserListMessage(payload);
        }
      }
    })();
  }, []);

  return (
    <div>
      <Header />
      {children}
      <Footer />
      {userData?.user_id ? (
        <div
          style={{
            position: "fixed",
            right: "30px",
            bottom: "100px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "1px solid rgb(44,206,244)",
              borderRadius: "50px",
              background: "rgb(44,206,244)",
              position: "relative",
              cursor: "pointer",
            }}
            className="chat-contact-icon"
            onClick={() => setVisibleChatBox(true)}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <ForumIcon style={{ color: "white" }} />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {visibleChatBox ? (
        <div className="chat-box-frame">
          <div className="chat-box">
            <div className="header">
              <div className="avatar-wrapper avatar-big">
                <img src="/img/telesale-icon.png" alt="avatar" />
              </div>
              <span className="name" style={{ color: "white" }}>
                Quản trị viên
              </span>
              <span
                className="options"
                onClick={() => setVisibleChatBox(false)}
              >
                <CloseIcon sx={{ color: "white" }} />
              </span>
            </div>
            <div className="chat-room">
              {userListMessage?.map((item, index) => {
                return (
                  <div
                    className={`message ${
                      !item?.reply_message ? "message-right" : "message-left"
                    }`}
                  >
                    <div
                      className={`bubble ${
                        !item?.reply_message ? "bubble-dark" : "bubble-light"
                      }`}
                    >
                      {item?.message || item?.reply_message || ""}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="type-area">
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
                className="button-send"
                onClick={async () => {
                  if (!chatMessage?.trim()?.length) {
                    return toast.error("Tin nhắn không thể bỏ trống");
                  }
                  const createRes = await createUserChat(
                    userData?.user_id,
                    chatMessage?.trim()
                  );
                  if (createRes?.data?.success) {
                    setChatMessage("");
                    socketRef.current.emit("sendDataClient", userData?.user_id);
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
      ) : (
        <></>
      )}
      {/* Back to Top */}
      <a
        href="#"
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
      >
        <i className="bi bi-arrow-up" />
      </a>
    </div>
  );
}
