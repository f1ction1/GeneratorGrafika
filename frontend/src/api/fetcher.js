export const API_BASE = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8000";

export default async function fetcher(path, options) {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
}
