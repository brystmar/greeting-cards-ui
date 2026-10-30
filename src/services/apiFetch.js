import { api } from "../data/endpoints"

/**
 * Typed fetch wrapper used by all API calls in this app.
 *
 * Throws a plain object (not an Error instance) so callers can pattern-match on `kind`:
 *   "unreachable" – TypeError from fetch: network down or backend returning 502 with no CORS headers
 *   "db_error"    – backend returned HTTP 500 with a JSON { error: "..." } body
 *   "http_error"  – any other non-OK response
 */
export async function apiFetch(url) {
    let response

    try {
        response = await fetch(url)
    } catch (err) {
        // TypeError means the request never completed (network failure or CORS/502 from proxy)
        throw makeError("unreachable", null, url, "Could not reach the server.")
    }

    if (!response.ok) {
        let body = null
        try { body = await response.json() } catch (_) {}

        if (response.status === 500 && body?.error) {
            throw makeError("db_error", response.status, url, body.error)
        }

        throw makeError("http_error", response.status, url, `HTTP ${response.status}`)
    }

    return response
}

/**
 * After all retries are exhausted, call the health endpoint (one attempt, 3s timeout)
 * to refine a typed error. If the server responds with { api: "ok", db: "error" }, upgrade
 * the kind to "db_error" so the banner shows the right message.
 *
 * Returns the original error unchanged if the health endpoint doesn't exist yet or fails.
 */
export async function refineErrorWithHealthCheck(typedError) {
    if (typedError.kind === "db_error") return typedError

    try {
        const resp = await fetch(api.health, { signal: AbortSignal.timeout(3000) })
        if (!resp.ok) return typedError

        const body = await resp.json()
        if (body?.api === "ok" && body?.db === "error") {
            return { ...typedError, kind: "db_error", message: body.db_error || "Database unavailable." }
        }
    } catch (_) {}

    return typedError
}

function makeError(kind, status, endpoint, message) {
    return { kind, status, endpoint, timestamp: new Date().toISOString(), message }
}
