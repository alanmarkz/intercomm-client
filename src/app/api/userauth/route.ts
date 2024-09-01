import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "nookies";

export async function GET(request: NextRequest) {
  const cookies = parseCookies({ req: request });

  const authToken = cookies.authToken;

  return NextResponse.json({ authToken });
}
