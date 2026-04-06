'use client'
import {useState} from "react";
import {submitBooking} from "@/lib/actions/event.actions";

const BookEvent = ({ eventId }: { eventId: string }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !email.trim()) {
            setError("Email is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await submitBooking(eventId, email);
            if (response.success) {
                setSubmitted(true);
            } else {
                setError(response.error || "Something went wrong.");
            }
        } catch (err: unknown) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    <button type="submit" className="button-submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
