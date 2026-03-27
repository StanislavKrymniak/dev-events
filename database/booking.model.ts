import mongoose, { Schema, Model, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => {
          // Basic email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Index for faster event-based queries
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ eventId: 1, createdAt: -1});
bookingSchema.index({ email: 1 });
bookingSchema.index({ eventId: 1, email: 1 },{unique: true, name: 'uniq-event-email'});

/**
 * Pre-save hook to verify that the referenced event exists
 * Prevents orphaned bookings by validating event reference
 */
bookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependencies
      const Event = mongoose.models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        return next(new Error('Event not found. Cannot create booking for non-existent event.'));
      }
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
