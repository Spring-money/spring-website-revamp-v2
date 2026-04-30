import { apiFetch } from "../../http-client";

interface RetirementCalculatorPayload {
  [key: string]: any;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload: RetirementCalculatorPayload = await request.json();
    const response = await apiFetch(
      `${process.env.APISUITE_BASE_URL}/shares/smallcase/transactions/init`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to get" }), {
        status: response.status,
      });
    }

    return Response.json(response.json());
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
