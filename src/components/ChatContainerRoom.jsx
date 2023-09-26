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
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button, Tooltip, Avatar, message, Spin } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import Message from "./MessagesRoom";
import { AppContext } from "../Context/AppProvider";

/*
  messages : 
  {
    _id, 
    message, 
    createdAt,
    photoURL,
    displayName
  }
*/

export default function ChatContainerRoom({ currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [members, setMembers] = useState([]);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const scrollRef = useRef();
  const { setIsInviteMemberVisible, currentChat, setMembers, members } =
    useContext(AppContext);

  useEffect(
    function () {
      async function fetchData() {
        setIsLoadingMessage(true);
        const response = await axios.post(getAllMessagesRoomRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
        setIsLoadingMessage(false);
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
    [currentChat]
  );

  const handleSendMsg = async (msg) => {
    const data = await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
      senderName: currentUser.username,
      senderPhotoURL: currentUser.avatarImage,
    });

    const newMsg = data.data;

    // socket.current.emit("send-msg-to-group", {
    //   roomId: currentChat._id,
    //   newMsg: newMsg,
    // });

    socket.current.emit("send-message", {
      roomId: currentChat._id,
      newMsg: newMsg,
    });

    // const msgs = [...messages];
    // msgs.push(newMsg);
    // setMessages(msgs);
  };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("msg-receive", (newMsg) => {
  //       setArrivalMessage(newMsg);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (!socket.current) return;

    // Set up event listeners when the component mounts
    socket.current.on("message", (newMsg) => {
      setArrivalMessage(newMsg);
    });

    // socket.current.on('user-left', (leftUsername) => {
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     sender: 'System',
    //     message: `${leftUsername} has left the room.`,
    //   },
    // ]);
    // setMembers((prevParticipants) =>
    //   prevParticipants.filter((participant) => participant !== leftUsername)
    // );

    // Clean up event listeners when the component unmounts
    return () => {
      socket.current.off("message");
    };
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            type="link"
            onClick={() => setIsInviteMemberVisible(true)}
          >
            Invite
          </Button>
          <Avatar.Group size="large" maxCount={2}>
            {members.map((member, index) => (
              <Tooltip title={member.username} key={index}>
                <Avatar src={`data:image/svg+xml;base64,${member.avatarImage}`}>
                  {member.avatarImage
                    ? ""
                    : member.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
          <Logout />
        </ButtonGroupStyled>
      </HeaderStyled>
      <MessageListStyled>
        {isLoadingMessage ? (
          <Spin
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          messages.map((mes, index) => (
            <div ref={scrollRef} key={index}>
              <Message
                text={mes.message}
                photoURL={mes.photoURL}
                displayName={mes.displayName}
                createdAt={mes.createdAt}
                currentName={currentUser.username}
              />
            </div>
          ))
        )}
      </MessageListStyled>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  color: white;
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding: 2.3rem 1rem;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  font-size: 1.3rem;

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
      font-size: 1rem;
      color: #a7a7a7;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  Button {
    color: white;
    font-size: 1rem;
  }
`;

const MessageListStyled = styled.div`
  margin-top: 1.5rem;
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
  .sended {
    display: flex;
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .received {
    display: flex;
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
`;
