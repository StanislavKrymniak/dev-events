import mongoose, { Schema, Model, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Index for faster slug lookups
eventSchema.index({ slug: 1 });

/**
 * Pre-save hook to generate slug, normalize date, and validate time
 * Only regenerates slug if title has changed
 */
eventSchema.pre('save', function (next) {
  // Generate slug from title if title is modified or document is new
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Add timestamp suffix to ensure uniqueness
    this.slug = baseSlug ? `${baseSlug}-${Date.now()}` : `event-${Date.now()}`;
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date')) {
    try {
      // Check if already in YYYY-MM-DD format
      const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      const match = this.date.trim().match(isoDateRegex);
      if (match) {
        const [, year, month, day] = match;
        // Validate date components
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        if (m < 1 || m > 12 || d < 1 || d > 31) {
          return next(new Error('Invalid date format. Use YYYY-MM-DD.'));
        }
        this.date = `${year}-${month}-${day}`;
      } else {
        return next(new Error('Invalid date format. Use YYYY-MM-DD or a valid date string.'));
      }
    } catch (error) {
      return next(new Error('Date parsing failed'));
    }
  }

  // Normalize time format to HH:MM (24-hour format)
  if (this.isModified('time')) {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    const match = this.time.trim().match(timeRegex);
    if (!match) {
      return next(new Error('Invalid time format. Use HH:MM (24-hour format).'));
    }
    // Zero-pad hours for consistent HH:MM format
    this.time = `${match[1].padStart(2, '0')}:${match[2]}`;
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
