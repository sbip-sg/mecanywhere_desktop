
const url = process.env.REGISTRATION_SERVICE_API_URL;


export async function createAccount(data) {
    try {
        console.log(JSON.stringify(data))
        const response = await fetch(url + "/create_account", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a probleam withas the fetch operation:", error);
    }
}

export async function createChallenge(data) {
    try {
        console.log(JSON.stringify(data))
        const response = await fetch(url + "/create_challenge", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a probleam withas the fetch operation:", error);
    }
}

export async function verifyResponse(data) {
    try {
        console.log(JSON.stringify(data))
        const response = await fetch(url + "/verify_response", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}



export async function getHeartBeat() {
    try {
        const response = await fetch(url + "/heartbeat", {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function assignHost() {
    try {
        const response = await fetch(url + "/assign_host");
        if (!response.ok) {
            throw new Error(`Failed to assign host: ${response.statusText}`);
        }
        const data = await response.json();
        return data.ip_address;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function registerHost(credential) {
    try {
        const response = await fetch(url + "/registration/register_host", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credential),
        });

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function deregisterHost(token) {
    try {
        const response = await fetch(url + "/registration/deregister_host", {
            method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        console.log("datatoken", data);
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function registerUser(credential) {
    try {
        const response = await fetch(url + "/registration/register_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credential),
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function deregisterUser(token) {
    try {
        const response = await fetch(url + "/registration/deregister_user", {
            method: "GET",
            // to verify if need token
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const res = await response.json();
        return res;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}
