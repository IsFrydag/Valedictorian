const API_BASE = "https://localhost:7161/api";

export async function apiRequest(endpoint, method, data){
    try{
        const response = await fetch(`${API_BASE}${endpoint}`,{
            method,
            headers: { "Content-Type": "application/json" },
            body: data ? JSON.stringify(data) : undefined
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Request failed");
        return result;
    }catch (err){
        console.error("API Error:", err.message);
        throw err;
    }
}