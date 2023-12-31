import React, { useRef, useState } from "react";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [members, setMembers] = useState([]);
  const socket = useRef();

  return (
    <AppContext.Provider
      value={{
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        isAddRoomVisible,
        setIsAddRoomVisible,
        currentUser,
        setCurrentUser,
        currentChat,
        setCurrentChat,
        members,
        setMembers,
        socket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
