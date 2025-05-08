export default async function handler(req, res) {
    try {
        const response = await fetch('https://geolocation-db.com/json/');

        if (!response.ok) {
            throw new Error(`Failed to get IP: ${response.status} ${response.statusText}`);
        }

        const ipv4 = await response.json();
        // console.log('ip in server is...', ipv4)
    
        res.status(200).json(ipv4);
    } catch (error) {
        console.error('Error fetching IP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};