import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppProvider from "./Context/AppProvider";
import InviteMemberModal from "./Modals/InviteMemberModal";
import AddRoomModal from "./Modals/AddRoomModal";

const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SetAvatar = lazy(() => import("./pages/SetAvatar"));
const Room = lazy(() => import("./pages/Room"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<>Loading</>}>
        <AppProvider>
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/setAvatar" element={<SetAvatar />}></Route>
            <Route path="/" element={<Chat />}></Route>
            <Route path="/room" element={<Room />}></Route>
          </Routes>
          <AddRoomModal />
          <InviteMemberModal />
        </AppProvider>
      </Suspense>
    </BrowserRouter>
  );
}
