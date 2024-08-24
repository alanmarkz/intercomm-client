import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  const isLogged = await auth();

  return (
    <div className="flex justify-between p-4">
      <div className="font-bold">InterComm</div>
      {isLogged && <div>Chats</div>}
      {isLogged ? (
        <div className="">
          <div>
            <Image
              src={isLogged.user?.image!}
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full"
            />
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}>
            <button>Sign-out</button>
          </form>
        </div>
      ) : (
        <Link href={"/auth"}>
          <button>Sign-in</button>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
