import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";
import {cacheLife} from "next/cache";

const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    'use cache'
    cacheLife('hours')
    const response = await fetch(`https://dev-events-pi-fawn.vercel.app/api/events`);
    if (!response.ok) {
        throw new Error(`Failed to fetch events (${response.status})`);
    }
    const {events} = await response.json();
    return (
        <section>
            <h1 className="text-center">The hub for Every Dev <br/> Event You Can&apos;t Miss</h1>
            <p className="text-center mt-5">Hackatons, Meetups, and Conferences, All in One Place</p>
            <ExploreBtn />

            <div className="mt-20 space-y-7">
                 <h3>Featured Events</h3>
                <ul className="events list-none p-0 m-0">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
