export async function POST(request) {
    try {
        const payload = await request.json();
        const response = await fetch(`https://us-central1-springmoneybackenduat.cloudfunctions.net/app/api/retirementCalculator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `Failed to get retirement calculations` }), 
                { status: response.status }
            );
        }

        const data = await response.json();
        return Response.json(data);

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }), 
            { status: 500 }
        );
    }
}