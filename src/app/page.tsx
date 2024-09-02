"use client";

import WebSocketExample from "@/components/chats";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const isLogged = true;
  const [data, setData] = useState<Chats[] | undefined>();
  const [receipient, setReceipient] = useState<string | null>(null);

  useEffect(() => {
    const getUserchats = async () => {
      const response = await axios.get("http://192.168.0.109:8080/get_users", {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      setData(response.data);
    };

    getUserchats();
  }, []);

  console.log(data);
  if (isLogged)
    return (
      <main className="flex items-center justify-center">
        <div className="w-full h-full max-w-[1000px] flex items-center justify-between">
          <div>
            <div>Your friends</div>
            <div className="flex flex-col gap-4">
              {data?.map((item) => {
                return (
                  <div key={item.name} className="flex gap-2">
                    <Image
                      className="rounded-full"
                      src={item.avatar_url}
                      alt={item.name}
                      width={30}
                      height={30}
                    />
                    <div>
                      <button
                        className={`${
                          receipient === item.id && "text-green-500"
                        }`}
                        onClick={() => setReceipient(item.id)}>
                        {item.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {receipient && <WebSocketExample receipient={receipient} />}
          </div>
        </div>
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
  email: string;
  avatar_url: string;
  user_name: string;
  name: string;
  createdAt: string;
};
