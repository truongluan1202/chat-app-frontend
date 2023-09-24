import React from "react";
import { Avatar, Typography } from "antd";
import styled from "styled-components";
import { formatRelative, parseISO } from "date-fns/esm";

function formatDate(timestamp) {
  let formattedDate = "";

  if (timestamp) {
    // Parse the ISO timestamp string into a Date object
    const date = parseISO(timestamp);

    // Format the Date object using date-fns formatRelative
    formattedDate = formatRelative(date, new Date());

    // Capitalize the first letter of the formatted string
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  currentName,
}) {
  return (
    <WrapperStyled
      className={`${displayName === currentName ? "sended" : "received"}`}
    >
      {displayName !== currentName && (
        <div className="avatar">
          <Avatar size="large" src={`data:image/svg+xml;base64,${photoURL}`}>
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
      )}
      <div className="message">
        <Typography.Text
          className={`author ${
            displayName === currentName ? "sended" : "received"
          }`}
        >
          {displayName}
        </Typography.Text>
        <Typography.Text className="content">{text}</Typography.Text>
        <Typography.Text
          className={`date ${
            displayName === currentName ? "sended" : "received"
          }`}
        >
          {formatDate(createdAt)}
        </Typography.Text>
      </div>
      {displayName === currentName && (
        <div className="avatar">
          <Avatar size="large" src={`data:image/svg+xml;base64,${photoURL}`}>
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
      )}
    </WrapperStyled>
  );
}

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;

  .avatar {
    padding-top: 3.5rem;
  }

  .message {
    display: flex;
    flex-direction: column;
    margin: 1rem;
    gap: 0.5rem;
    max-width: 70%;

    .author {
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      overflow-wrap: break-word;
      padding: 0.6rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
    }
    .date {
      font-size: 1rem;
      color: #a7a7a7;
    }
  }
`;
