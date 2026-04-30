import { NextResponse } from "next/server";
import { apiFetch } from "../../http-client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mobile = url.searchParams.get("mobile");

    console.log(`API route called with mobile: ${mobile}`);

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      console.log("Invalid mobile number");
      return NextResponse.json(
        { success: false, message: "Invalid mobile number" },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const upstreamUrl = `${process.env.APISUITE_BASE_URL}/digilocker/authorize-link?mobile=${mobile}&_t=${timestamp}`;

    console.log(`Calling upstream URL: ${upstreamUrl}`);

    const res = await apiFetch(upstreamUrl, {
      method: "GET",
      headers: {
        accept: "*/*",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!res.ok) {
      const text = res.text();
      console.log(`Upstream error: ${res.status} - ${text}`);
      return NextResponse.json(
        { success: false, message: "Upstream error", details: text },
        { status: res.status },
      );
    }

    const data = res.json();
    console.log("Upstream response:", data);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("Error in authorize-link route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal error" },
      { status: 500 },
    );
  }
}
