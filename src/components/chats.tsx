"use client";

import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WebSocketComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketUrl] = useState("ws://localhost:8080/chat/ads");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection opened"),
    shouldReconnect: () => true, // Always attempt to reconnect
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages((prevMessages) => [...prevMessages, lastMessage.data]);
    }
  }, [lastMessage]);

  const handleSendMessage = useCallback(() => {
    sendMessage(message);
    setMessage(""); // Clear the message input after sending
  }, [sendMessage, message]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>Status: {connectionStatus}</div>
    </div>
  );
};

export default WebSocketComponent;
