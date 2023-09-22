import React from "react";
import { Avatar, Typography } from "antd";
import styled from "styled-components";
import { formatRelative, parseISO } from "date-fns/esm";

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

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

export default function Message({ text, displayName, createdAt, photoURL }) {
  return (
    <WrapperStyled>
      <div>
        <Avatar size="small" src={`data:image/svg+xml;base64,${photoURL}`}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">
          {formatDate(createdAt)}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text className="content">{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
