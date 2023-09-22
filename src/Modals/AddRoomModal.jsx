import React, { useContext } from "react";
import { Form, Modal, Input } from "antd";
import { AppContext } from "../Context/AppProvider";
import axios from "axios";
import { createRoomRoute } from "../utils/APIRoutes";

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible, currentUser } =
    useContext(AppContext);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const { data } = await axios.post(createRoomRoute, {
        roomName: form.getFieldValue().name,
        users: [currentUser.username],
        description: form.getFieldValue().description,
      });

      form.resetFields();
      setIsAddRoomVisible(false);
    } catch (err) {
      console.log("Error creating room:", err);
    }
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title="Create Room"
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name Room" name="name">
            <Input placeholder="Enter room name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter your description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
