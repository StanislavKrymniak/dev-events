'use server';
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({slug})
        if (event) {
            return await Event.find({_id: { $ne: event._id}, tags: {$in: event.tags}}).lean()
        }
    } catch {
        return []
    }
}

export const submitBooking = async (eventId: string, email: string) => {
    try {
        await connectDB();
        
        const newBooking = new Booking({ eventId, email });
        await newBooking.save();
        
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to submit booking' };
    }
}