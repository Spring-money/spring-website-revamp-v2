import { apiFetch } from "../../http-client";

interface RetirementCalculatorPayload {
  [key: string]: any;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload: RetirementCalculatorPayload = await request.json();
    const response = await apiFetch(
      `${process.env.APISUITE_BASE_URL}/nse-transaction/purchase`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorBody = response.text();
      console.error("Upstream error", response.status, errorBody);
      return new Response(JSON.stringify({ error: errorBody }), {
        status: response.status,
      });
    }

    return Response.json(response.json());
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
