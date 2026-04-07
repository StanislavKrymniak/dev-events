'use client'
import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {
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
            const {success} = await createBooking({eventId, slug, email});
            if (success) {
                setSubmitted(true);
                posthog.capture('event booked', {eventId, slug, email})
            } else {
                console.error("Error creating booking event", error);
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
