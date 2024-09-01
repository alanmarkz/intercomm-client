import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  const isLogged = false;
  return (
    <div className="flex justify-between p-4">
      <div className="font-bold">InterComm</div>
      {isLogged && <div>Chats</div>}
      {isLogged ? (
        <div className="">
          <div></div>
          <form>
            <button>Sign-out</button>
          </form>
        </div>
      ) : (
        <Link href={"/login"}>
          <button>Sign-in</button>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
