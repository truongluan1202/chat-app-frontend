import React from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useEffect } from "react";
import { useState } from "react";

import { Collapse, Typography, Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../Context/AppProvider";

const { Panel } = Collapse;

export default function ContactsRoom({ rooms }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const { setIsAddRoomVisible, setCurrentChat } = React.useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, room) => {
    setCurrentSelected(index);
    setCurrentChat(room);
  };

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chattie</h3>
          </div>
          <div className="contacts">
            <Collapse ghost defaultActiveKey={["1"]}>
              <PanelStyled header="Room List" key="1" className="contacts">
                {rooms.map((room, index) => (
                  <LinkStyled
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    key={room._id}
                    onClick={() => changeCurrentChat(index, room)}
                  >
                    <div className="avatar">
                      <img
                        src={`data:image/svg+xml;base64,${room.avatarImage}`}
                        alt=""
                      />
                    </div>
                    <div className="username">
                      <h3>{room.roomName}</h3>
                    </div>
                  </LinkStyled>
                ))}
                <Button
                  type="text"
                  icon={<PlusSquareOutlined />}
                  className="add-room"
                  onClick={handleAddRoom}
                >
                  Add Room
                </Button>
              </PanelStyled>
            </Collapse>
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          width: 100%;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
      font-size: 1rem;
      font-weight: bold;
      align-items: center;
    }

    .ant-collapse-content-box {
      width: 20rem;
      padding: 0 40px;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;
