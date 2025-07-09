import { NextResponse } from "next/server";

// NOTE: For demo purposes the auth token is hard-coded. In production move this to an environment variable.
const AUTH_TOKEN = "token 7234f1b05839725:1e3731f9c91f146";
const FRAPPE_BASE = "https://moneylancer-uat.frappe.cloud/api/resource/Digilocker%20Data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get("mobile") || "";

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    // Build encoded filters param
    const filters = encodeURIComponent(
      JSON.stringify([["mobile_number", "=", mobile]])
    );
    const fields = encodeURIComponent(JSON.stringify(["*"]));
    const url = `${FRAPPE_BASE}?filters=${filters}&fields=${fields}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
        accept: "application/json",
      },
      // Frappe may rely on cookies; for simple GET it usually isn't required.
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { success: false, message: "Upstream error", details: text },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal error" },
      { status: 500 }
    );
  }
} 