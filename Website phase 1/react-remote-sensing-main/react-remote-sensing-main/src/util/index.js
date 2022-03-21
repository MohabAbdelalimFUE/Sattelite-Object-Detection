export async function makeRequest(apiUrl, requestOptions) {
    try {
        const response = await fetch(apiUrl, requestOptions);
        const json = await response.json();
        return json;
    } catch (error) {
        return error;
    }
}