import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthorizedDev } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { userId, action, table, payload } = await req.json();

        // 1. Verify Developer Access
        if (!isAuthorizedDev(userId)) {
            return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
        }

        if (!table || !/^[a-zA-Z0-9_]+$/.test(table)) {
            return NextResponse.json({ error: 'Invalid table name.' }, { status: 400 });
        }

        let result;

        // 2. Handle CRUD Operations securely via `postgres` module
        switch (action) {
            case 'read':
                // Safe table interpolation via sql() function
                result = await sql`SELECT * FROM ${sql(table)} ORDER BY row_number() OVER () LIMIT 100 OFFSET ${payload?.offset || 0}`;
                break;

            case 'read_columns':
                result = await sql`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = ${table};
                 `;
                break;

            case 'create':
                const insertKeys = Object.keys(payload);
                if (insertKeys.length === 0) throw new Error("No data provided");

                // Using helper function for secure inserts
                result = await sql`
                    INSERT INTO ${sql(table)} ${sql(payload)} RETURNING *;
                `;
                break;

            case 'update':
                const updateKeys = Object.keys(payload.data);
                if (updateKeys.length === 0 || !payload.idField || payload.idValue === undefined) {
                    throw new Error("Invalid update payload");
                }

                result = await sql`
                    UPDATE ${sql(table)} 
                    SET ${sql(payload.data)} 
                    WHERE ${sql(payload.idField)} = ${payload.idValue} 
                    RETURNING *;
                `;
                break;

            case 'delete':
                if (!payload.idField || payload.idValue === undefined) {
                    throw new Error("Invalid delete payload");
                }

                result = await sql`
                    DELETE FROM ${sql(table)} 
                    WHERE ${sql(payload.idField)} = ${payload.idValue};
                 `;
                break;

            default:
                return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error(`Error during DB query [${req.method}] :`, error);
        return NextResponse.json({ error: error.message || 'Failed database operation.' }, { status: 500 });
    }
}
