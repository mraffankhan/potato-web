import postgres from 'postgres';

export const sql = postgres({
    host: 'db.pzsvbqfzacidkeqavgfh.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'affan@805032',
    ssl: { rejectUnauthorized: false }, // Necessary if SSL is required but self-signed
    max: 10, // Max number of connections
    idle_timeout: 20 // Idle connection timeout in seconds
});
