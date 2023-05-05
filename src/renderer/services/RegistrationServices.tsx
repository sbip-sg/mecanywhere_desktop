
const url = process.env.REGISTRATION_SERVICE_API_URL;

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
        console.log(data);
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
        const response = await fetch(url + "/register_host", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credential),
        });

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function deregisterHost() {
    try {
        const response = await fetch(url + "/deregister_host", {
            method: "GET",
            // need to verify if token is needed
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

export async function registerUser(credential) {
    try {
        const response = await fetch(url + "/register_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credential),
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

export async function deregisterUser() {
    try {
        const response = await fetch(url + "/deregister_user", {
            method: "GET",
            // to verify if need token
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
        });
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}
