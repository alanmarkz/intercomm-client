import { signIn, auth } from "@/auth";
import axios from "axios";

export default async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}>
      <button type="submit">Signin with GitHub</button>
    </form>
  );
}
