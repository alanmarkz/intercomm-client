"use client";

import axios from "axios";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WebSocketComponent = ({ receipient }: { receipient: string }) => {
  const [history, setHistory] = useState<messageData[] | null>();
  const [message, setMessage] = useState("");

  const [socketUrl] = useState("ws://localhost:8080/chat_server/34214");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection opened"),
    shouldReconnect: () => true, // Always attempt to reconnect
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const getUserchats = async () => {
    const response = await axios.post(
      "http://localhost:8080/get_messages",
      { receipient_id: receipient }, // Send as body data
      {
        withCredentials: true, // Ensures cookies are sent with the request
      }
    );

    let data: messageData[] = response.data;
    setHistory(data);
  };

  useEffect(() => {
    getUserchats();
  }, [receipient]);

  useEffect(() => {
    console.log(lastMessage?.data);
  }, [lastMessage]);

  const handleSendMessage = () => {
    const messageObject = {
      receiver_id: receipient,
      message: message,
    };

    sendMessage(JSON.stringify(messageObject));

    setHistory((pre) => [
      ...pre,
      {
        id: "",
        mymessages: message,
        theirmessage: "",
        createdAt: "34",
      },
    ]);
    setMessage("");
  };

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
      <div>Status: {connectionStatus}</div>
      <div></div>
      <div className="h-[700px] overflow-y-auto">
        <h2>Messages:</h2>
        {history?.map((msg, index) => (
          <ul key={index}>
            <li className="text-right">{msg.mymessages}</li>
            <li>{msg.theirmessage}</li>
          </ul>
        ))}
        <div ref={bottomRef} />
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          disabled={message === null || message === ""}
          onClick={() => {
            handleSendMessage();
          }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default WebSocketComponent;

type messageData = {
  id: String;
  mymessages: String;
  theirmessage: String;
  createdAt: String;
};
