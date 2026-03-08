import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const [commandsResult] = await db.query<any>('SELECT COUNT(*) as count FROM commands');
        const [usersResult] = await db.query<any>('SELECT COUNT(DISTINCT user_id) as count FROM commands');
        const [serversResult] = await db.query<any>('SELECT COUNT(*) as count FROM guild_data');

        return NextResponse.json({
            commands: commandsResult[0].count,
            users: usersResult[0].count,
            servers: serversResult[0].count,
            uptime: "99.9%"
        });
    } catch (error) {
        console.error('Error fetching global stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
