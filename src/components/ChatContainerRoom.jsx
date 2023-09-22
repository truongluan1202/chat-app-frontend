import React, { useContext } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  getAllMessagesRoomRoute,
  getMembersRoute,
  sendMessageRoute,
} from "../utils/APIRoutes";
import { useState } from "react";
import { useEffect } from "react";
// import { useRef } from "react";
// import { v4 as uuidv4 } from "uuid";

import { Button, Tooltip, Avatar, Form, Input, Alert } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import Message from "./MessagesRoom";
import { AppContext } from "../Context/AppProvider";

export default function ChatContainerRoom({ currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  // const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [members, setMembers] = useState([]);

  //   const scrollRef = useRef();
  const { setIsInviteMemberVisible, currentChat, setMembers, members } =
    useContext(AppContext);

  useEffect(
    function () {
      async function fetchData() {
        const response = await axios.post(getAllMessagesRoomRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
      if (currentChat) fetchData();
    },
    [currentChat, currentUser]
  );

  useEffect(
    function () {
      async function fetchData() {
        const response = await axios.get(
          `${getMembersRoute}/${currentChat._id}`
        );
        setMembers(response.data);
      }
      if (currentChat) fetchData();
    },
    [currentChat, currentUser]
  );

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
      senderName: currentUser.username,
      senderPhotoURL: currentUser.avatarImage,
    });

    // socket.current.emit("send-msg", {
    //   to: currentChat._id,
    //   from: currentUser._id,
    //   message: msg,
    // });
    // const msgs = [...messages];
    // msgs.push(data);
    // setMessages(msgs);
  };

  //   useEffect(() => {
  //     if (socket.current) {
  //       socket.current.on("msg-receive", (msg) => {
  //         setArrivalMessage({ fromSelf: false, message: msg });
  //       });
  //     }
  //   }, []);

  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage]);

  //   useEffect(() => {
  //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, [messages]);

  return (
    <Container>
      <HeaderStyled>
        <div className="header__info">
          <p className="header__title">{currentChat.roomName}</p>
          <span className="header__description">{currentChat.description}</span>
        </div>
        <ButtonGroupStyled>
          <Button
            icon={<UserAddOutlined />}
            type="text"
            onClick={() => setIsInviteMemberVisible(true)}
          >
            Invite
          </Button>
          <Avatar.Group size="small" maxCount={2}>
            {members.map((member, index) => (
              <Tooltip title={member.username} key={member.index}>
                <Avatar src={`data:image/svg+xml;base64,${member.avatarImage}`}>
                  {member.avatarImage
                    ? ""
                    : member.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </ButtonGroupStyled>
      </HeaderStyled>
      <ContentStyled>
        <MessageListStyled>
          {messages.map((mes) => (
            <Message
              key={mes.id}
              text={mes.message}
              photoURL={mes.photoURL}
              displayName={mes.displayName}
              createdAt={mes.createdAt}
            />
          ))}
        </MessageListStyled>
        <ChatInput handleSendMsg={handleSendMsg} />
      </ContentStyled>
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
