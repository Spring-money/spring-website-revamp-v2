// Define interfaces for the request payload and response
interface RetirementCalculatorPayload {
  // Add specific payload fields here based on your actual payload structure
  [key: string]: any; // This is a temporary type, replace with actual payload structure
}

interface RetirementCalculatorResponse {
  // Add specific response fields here based on your actual response structure
  [key: string]: any; // This is a temporary type, replace with actual response structure
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload: RetirementCalculatorPayload = await request.json();
    const response = await fetch(
      "https://uatapi.springmoneyapisuite.money/shares/smallcase/transactions/init",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to get` }), {
        status: response.status,
      });
    }

    const data: RetirementCalculatorResponse = await response.json();
    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
