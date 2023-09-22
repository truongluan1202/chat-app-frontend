export const host = "https://chattie-meow-meow-d30f322c541b.herokuapp.com";
// export const host = "http://localhost:5000";

export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages/getmsg`;
export const getAllMessagesRoomRoute = `${host}/api/messages/getmsgroom`;
export const allRoomsRoute = `${host}/api/auth/room/allrooms`;
export const createRoomRoute = `${host}/api/auth/room/createRoom`;
export const getMembersRoute = `${host}/api/auth/room/getmembers`;
export const addMembersRoute = `${host}/api/auth/room/addmembers`;
export const allUsersRoomRoute = `${host}/api/auth/allusersroom`;
