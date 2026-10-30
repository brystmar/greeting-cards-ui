import { useEffect, useState } from "react"
import { useAppData } from "../context/AppDataContext"
import "../styles/DivStatusBanner.css"


const ERROR_MESSAGES = {
    unreachable: "Can't reach the server. Check your connection or try again.",
    db_error:    "The server is up but couldn't load data — the database may be unavailable.",
    http_error:  (status) => `Unexpected server response (HTTP ${status}). Try again or contact support.`
}

function errorMessage(typedError) {
    if (!typedError) return "An unknown error occurred."
    const { kind, status } = typedError
    if (kind === "http_error") return ERROR_MESSAGES.http_error(status ?? "?")
    return ERROR_MESSAGES[kind] ?? "An unknown error occurred."
}

export default function DivStatusBanner() {
    const { apiStatus, typedError, retryAttempt, retryAt, retryFetch } = useAppData()
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    // Count down to the next retry attempt
    useEffect(() => {
        if (apiStatus !== "retrying" || retryAt == null) {
            setSecondsLeft(null)
            return
        }

        const tick = () => setSecondsLeft(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [apiStatus, retryAt])

    if (!apiStatus) return null

    const isRetrying = apiStatus === "retrying"

    return (
        <div className={`status-banner status-banner--${isRetrying ? "retrying" : "error"}`}
             role="status"
             aria-live="polite">

            <div className="status-banner__main">
                <span className="status-banner__icon" aria-hidden="true">
                    {isRetrying ? "⟳" : "⚠"}
                </span>

                <span className="status-banner__message">
                    {isRetrying
                        ? <>Reconnecting… <span className="status-banner__attempt">(attempt {retryAttempt} of 5{secondsLeft != null ? `, next try in ${secondsLeft}s` : ""})</span></>
                        : errorMessage(typedError)
                    }
                </span>

                {!isRetrying && (
                    <button className="status-banner__retry"
                            onClick={retryFetch}>
                        Retry
                    </button>
                )}

                <button className="status-banner__details-toggle"
                        onClick={() => setDetailsOpen((o) => !o)}
                        aria-expanded={detailsOpen}>
                    {detailsOpen ? "Hide details" : "Details"}
                </button>
            </div>

            {detailsOpen && typedError && (
                <dl className="status-banner__details">
                    <dt>Endpoint</dt>
                    <dd>{typedError.endpoint}</dd>

                    {typedError.status != null && <>
                        <dt>Status</dt>
                        <dd>{typedError.status}</dd>
                    </>}

                    <dt>Time</dt>
                    <dd>{new Date(typedError.timestamp).toLocaleTimeString()}</dd>

                    {typedError.message && <>
                        <dt>Detail</dt>
                        <dd>{typedError.message}</dd>
                    </>}
                </dl>
            )}
        </div>
    )
}
