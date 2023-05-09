
const url = process.env.DID_SERVICE_API_URL;

export async function createKeyPair() {
    try {
        const response = await fetch(url + "/api/v1/did/genkey", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const data = await response.json();
        console.log("keypair", data);
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export async function addPublicKey(publicKey) {
    const response = await fetch(url + "/api/v1/did/addPublicKey", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(publicKey),
    });
    if (!response.ok) {
        throw new Error("Network response not ok");
    }
    const data = await response.json();
    return data; //contains DID
}

export async function verifyCredential(verifyCredentialRequest) {
    const response = await fetch(url + "/api/v1/did/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyCredentialRequest),
    });

    if (!response.ok) {
        throw new Error("Network response not ok");
    }

    const data = await response.json();
    return data;
}

export async function createCredential(createCredentialRequest) {
    try {
        const response = await fetch(url + "api/v1/did/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createCredentialRequest),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error creating credential:", error);
        throw error;
    }
}
