"use client";

import axios from "axios";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WebSocketComponent = ({ receipient }: { receipient: string }) => {
  const [history, setHistory] = useState<messageData[]>([]);
  const [message, setMessage] = useState("");

  const [socketUrl] = useState("ws://192.168.0.109:8080/chat_server/34214");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection opened"),
    shouldReconnect: () => true, // Always attempt to reconnect
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const getUserchats = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.109:8080/get_messages",
        { receipient_id: receipient }, // Send as body data
        {
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );

      let data: messageData[] = response.data;
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    getUserchats();
  }, [receipient]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        // Parse the incoming message data
        const incomingMessage = JSON.parse(lastMessage.data);

        console.log(incomingMessage);
        // Check if the message is from the current recipient or other user
        const isReceived = incomingMessage.receiver_id === receipient;

        console.log(isReceived);
        setHistory((prev) => [
          ...prev,
          {
            id: incomingMessage.id || "", // Assuming the message object has an id
            mymessages: isReceived ? incomingMessage.message : "",
            theirmessage: isReceived ? "" : incomingMessage.message,
            createdAt: new Date().toISOString(), // Assuming you want to set the current time
          },
        ]);
      } catch (error) {
        console.error("Error parsing incoming message:", error);
      }
    }
  }, [lastMessage, receipient]);

  useEffect(() => {});

  const handleSendMessage = () => {
    const messageObject = {
      receiver_id: receipient,
      message: message,
    };

    sendMessage(JSON.stringify(messageObject));

    // Update history with the sent message
    setHistory((prev) => [
      ...prev,
      {
        id: "",
        mymessages: message,
        theirmessage: "",
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line
      handleSendMessage(); // Invoke the function when Enter is pressed
    }
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
      <div className="h-[700px] overflow-y-auto">
        <h2>Messages:</h2>
        <div className="flex flex-col gap-2 w-[400px]">
          {history.map((msg, index) => (
            <ul key={index} className=" w-[400px]">
              <li className="text-right bg-green-400">{msg.mymessages}</li>
              <li className="bg-slate-500 text-left">{msg.theirmessage}</li>
            </ul>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      <div>
        <textarea
          value={message}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button disabled={message === ""} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default WebSocketComponent;

type messageData = {
  id: string;
  mymessages: string;
  theirmessage: string;
  createdAt: string;
};
