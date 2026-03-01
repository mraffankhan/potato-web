import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthorizedDev } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        // 1. Verify Developer Access
        if (!isAuthorizedDev(userId)) {
            return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
        }

        // 2. Fetch all public tables from information_schema
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `;

        // 3. Return array of table names
        const tableNames = tables.map(t => t.table_name);
        return NextResponse.json({ tables: tableNames });

    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: 'Failed to fetch database tables.' }, { status: 500 });
    }
}
