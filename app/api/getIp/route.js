import { NextResponse } from "next/server";

export const GET = async (req) => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  return NextResponse.json({ip});
};
