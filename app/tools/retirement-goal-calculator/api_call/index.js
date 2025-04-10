
export async function RetirementApiCall(payload) {
    try {
        const response = await fetch(`/api/retirement-goal-calculator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`Failed to get retirement calculations : ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        return data;

    } catch (error) {
        return error;
    }
}