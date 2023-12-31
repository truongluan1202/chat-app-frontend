import React, { useContext, useEffect, useState } from "react";
import { Form, Modal, Select, Avatar } from "antd";
import { AppContext } from "../Context/AppProvider";
import {
  addMembersRoute,
  allUsersRoomRoute,
  allUsersRoute,
} from "../utils/APIRoutes";
import axios from "axios";
import { io } from "socket.io-client";

function DebounceSelect({ currentUser, addedUsers, ...props }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post(allUsersRoomRoute, {
        addedUsers,
      });
      setOptions(data.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Select labelInValue style={{ width: "100%" }} {...props}>
        {options.map((opt) => (
          <Select.Option
            key={opt._id}
            value={opt.username}
            title={opt.username}
          >
            <Avatar
              size="small"
              src={`data:image/svg+xml;base64,${opt.avatarImage}`}
            >
              {opt.avatarImage ? "" : opt.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.username}`}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    currentUser,
    currentChat,
    members,
    socket,
  } = useContext(AppContext);
  const [form] = Form.useForm();
  const [value, setValue] = useState([]);

  const addedUsers = members.map((member) => member.username);

  const handleOk = async () => {
    const newUsers = value.map((item) => item.title);
    const data = await axios.put(`${addMembersRoute}/${currentChat._id}`, {
      newUsers: newUsers,
    });

    // socket.current.emit("add-member", currentChat._id);
    form.resetFields();
    setValue([]);

    setIsInviteMemberVisible(false);
    window.location.reload();
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();
    setValue([]);

    setIsInviteMemberVisible(false);
  };

  return (
    <div>
      <Modal
        title="Add Invite"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Member List"
            value={value}
            placeholder="Type name of member"
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            currentUser={currentUser}
            addedUsers={addedUsers}
          />
        </Form>
      </Modal>
    </div>
  );
}
