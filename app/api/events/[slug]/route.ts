import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

// Type for route params in Next.js 13+ App Router
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param request - Next.js request object (unused but required for route signature)
 * @param context - Route context containing dynamic params
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    // Await params to get slug (Next.js 15+ requirement)
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { 
          message: 'Invalid slug parameter',
          error: 'Slug must be a non-empty string' 
        },
        { status: 400 }
      );
    }

    // Sanitize slug - remove potentially harmful characters
    const sanitizedSlug = slug.trim();
    
    if (sanitizedSlug.length === 0) {
      return NextResponse.json(
        { 
          message: 'Invalid slug parameter',
          error: 'Slug cannot be empty' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug with proper type inference
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          message: 'Event not found',
          error: `No event exists with slug: ${sanitizedSlug}` 
        },
        { status: 404 }
      );
    }

    // Return success response with event data
    return NextResponse.json(
      { 
        message: 'Event fetched successfully',
        event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error fetching event by slug:', error);

    // Handle specific Mongoose/MongoDB errors
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { 
            message: 'Database configuration error',
            error: 'Unable to connect to database' 
          },
          { status: 503 }
        );
      }

      // Generic error with message
      return NextResponse.json(
        { 
          message: 'Failed to fetch event',
          error: error.message 
        },
        { status: 500 }
      );
    }

    // Fallback for unknown errors
    return NextResponse.json(
      { 
        message: 'An unexpected error occurred',
        error: 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
