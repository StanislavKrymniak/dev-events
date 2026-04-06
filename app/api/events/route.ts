import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
        }

        // Check if event with same title already exists
        const normalizedTitle = String(event.title).trim();
        const existingEvent = await Event.findOne({ title: normalizedTitle })
            .collation({ locale: 'en', strength: 1 });
        
        if (existingEvent) {
            return NextResponse.json(
                { message: 'An event with this title already exists. Please use a different title.' }, 
                { status: 409 }
            );
        }

        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({message: 'Image file is required'}, {status: 400})

        }
        let tags = JSON.parse(formData.get('tags') as string)
        let agenda = JSON.parse(formData.get('agenda') as string)

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, results) => {
                if (error) return reject(error)

                resolve(results)
            }).end(buffer)
        })

        event.image = (uploadResult as { secure_url: string}).secure_url;
        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda
        });

        return NextResponse.json({message: 'Event created', event: createdEvent}, {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: "Something went wrong", error: e instanceof Error ? e.message: 'Unknown'}, {status: 500});
    }
}

export async function GET() {
    try {
        await connectDB()

        const events = await Event.find().sort({ createdAt: -1 })

        return NextResponse.json({message: 'Events fetched successfully', events}, {status: 200});
    } catch (e) {
        return NextResponse.json({message: 'Event fetching failed', error: e}, {status: 500});
    }
}