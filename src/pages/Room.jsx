import React, { useContext } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allRoomsRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import ContactsRoom from "../components/ContactsRoom";
import Welcome from "../components/Welcome";
import ChatContainerRoom from "../components/ChatContainerRoom";
import { AppContext } from "../Context/AppProvider";
import { io } from "socket.io-client";

/* 
localStorage : 
  _id : 
  avatarImage : 
  email : 
  isAvatarImageSet : true/false
  password : 
  username :
  _v : 
*/

/* 
database 
*/

function Room() {
  const socket = useRef();
  const navigate = useNavigate();
  // const [currentUser, setCurrentUser] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  // const [currentChat, setCurrentChat] = useState(undefined);
  const { currentUser, setCurrentUser, currentChat } = useContext(AppContext);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(
            `${allRoomsRoute}/${currentUser.username}`
          );
          setRooms(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser]);

  return (
    <>
      <Container>
        <div className="container">
          <ContactsRoom rooms={rooms} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainerRoom currentUser={currentUser} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Room;
