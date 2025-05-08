export async function GET() {
  try {
    const response = await fetch(
      "https://uatapi.springmoneyapisuite.money/shares/smallcase/auth/smallcase-auth-token?investor_id=guest",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log("error occures while fetching ");
    }
    const data = await response.json();

    // Add cache control headers to the response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
