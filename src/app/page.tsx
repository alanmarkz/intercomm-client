export default async function Home() {
  const isLogged = true;

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
