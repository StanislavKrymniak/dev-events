export type EventItem = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}


export const events: EventItem[] = [
    {
        image: '/images/event1.png',
        title: 'React Conf 2026',
        slug: 'react-conf-2026',
        location: 'Henderson, Nevada',
        date: 'May 15-16, 2026',
        time: '9:00 AM - 6:00 PM',
    },
    {
        image: '/images/event2.png',
        title: 'Vercel Ship 2026',
        slug: 'vercel-ship-2026',
        location: 'San Francisco, CA',
        date: 'June 10, 2026',
        time: '10:00 AM - 4:00 PM',
    },
    {
        image: '/images/event3.png',
        title: 'Google I/O 2026',
        slug: 'google-io-2026',
        location: 'Mountain View, CA',
        date: 'May 20, 2026',
        time: '10:00 AM - 5:00 PM',
    },
    {
        image: '/images/event4.png',
        title: 'AWS re:Invent 2026',
        slug: 'aws-reinvent-2026',
        location: 'Las Vegas, NV',
        date: 'December 1-5, 2026',
        time: '8:00 AM - 8:00 PM',
    },
    {
        image: '/images/event5.png',
        title: 'EthDenver 2026',
        slug: 'ethdenver-2026',
        location: 'Denver, CO',
        date: 'February 27 - March 5, 2026',
        time: 'All Day',
    },
    {
        image: '/images/event6.png',
        title: 'KubeCon NA 2026',
        slug: 'kubecon-na-2026',
        location: 'Chicago, IL',
        date: 'November 10-13, 2026',
        time: '9:00 AM - 5:00 PM',
    }
];
