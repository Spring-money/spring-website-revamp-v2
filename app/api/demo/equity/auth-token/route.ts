import { apiFetch } from "../../http-client";

export async function GET() {
  try {
    const response = await apiFetch(
      `${process.env.APISUITE_BASE_URL}/shares/smallcase/auth/smallcase-auth-token?investor_id=guest`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      console.log("error occures while fetching ");
    }

    return new Response(JSON.stringify(response.json()), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
