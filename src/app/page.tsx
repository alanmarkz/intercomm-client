"use client";

import WebSocketExample from "@/components/chats";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const isLogged = true;
  const [data, setData] = useState<Chats[] | undefined>();

  useEffect(() => {
    const getUserchats = async () => {
      const response = await axios.get(
        "http://localhost:8080/getchatmessages",
        {
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );

      setData(response.data);
    };

    getUserchats();
  }, []);

  console.log(data);
  if (isLogged)
    return (
      <main className="w-full h-full flex flex-col items-center justify-center">
        <div>Your friends</div> <WebSocketExample />
        {/* <div>{data && data?.[0]?.friend}</div> */}
      </main>
    );
  else {
    return (
      <main className="flex flex-col justify-between w-full h-full items-center mt-20 text-4xl gap-10 p-4">
        <div className="font-bold">Welcome to Intercomm</div>
        <div className="text-center text-2xl font-light px-2">
          <div></div>
          Communicate with your friend on the next level
        </div>
      </main>
    );
  }
}

type Chats = {
  id: string;
  friend: string;
  friend_id: string;
  joinedAt: string;
};
