export async function getData(url, signal) {
    const response = await fetch(url, { signal })
    const data = await response.json().catch(() => null)

    if (!response.ok || !data) {
        throw new Error(data?.error || `Request failed (${response.status}). Check the Flask server and Vite proxy.`)
    }

    return data
}