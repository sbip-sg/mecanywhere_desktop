
const url = process.env.TEST_SERVICE_API_URL;

export async function createUser(userData) {
    try {
        console.log(JSON.stringify(userData))
        const response = await fetch(url + "/users", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error("Network raesponse not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a probleam withas the fetch operation:", error);
    }
}

export async function createChallenge(didData) {
    try {
        const response = await fetch(url + "/create_challenge", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(didData),
        });
        
        if (!response.ok) {
            throw new Error("Network raesponse not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a probleam withas the fetch operation:", error);
    }
}

export async function verifyResponse(signatureData) {
    try {
        const response = await fetch(url + "/verify_response", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signatureData),
        });
        
        if (!response.ok) {
            throw new Error("Network raesponse not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a probleam withas the fetch operation:", error);
    }
}
