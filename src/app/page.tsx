import { auth } from "@/auth";
import axios from "axios";
import { getToken } from "next-auth/jwt";

export default async function Home() {
  const isLogged = await auth();

  const session = await auth();
  console.log(session);
  if (session) {
    try {
      let result = await axios.post("http://localhost:8080/authuser", {
        name: session.user?.name,
        avatar_url: session.user?.image,
        email: session.user?.email,
      });

      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  }

  if (isLogged)
    return (
      <main className="w-full h-full flex items-center justify-center">
        <div>Your friends</div>
      </main>
    );
  else {
    return (
      <main className="flex flex-col justify-between w-full h-full items-center mt-20 text-4xl gap-10 p-4">
        <div className="font-bold">Welcome to Intercomm</div>
        <div className="text-center text-2xl font-light px-2">
          Communicate with your friend on the next level
        </div>
      </main>
    );
  }
}
