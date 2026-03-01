import postgres from 'postgres';
import { supabase } from '@/lib/supabase';

// Use the Supabase connection string for Ender Cloud
// The format is usually postgres://user:password@host:port/dbname
// If the connection string is not provided directly, we can build it.
// Default to the one provided earlier for the DB host
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:affan@805032@db.pzsvbqfzacidkeqavgfh.supabase.co:5432/postgres';

export const sql = postgres(connectionString, {
    ssl: { rejectUnauthorized: false }, // Necessary if SSL is required but self-signed
    max: 10, // Max number of connections
    idle_timeout: 20 // Idle connection timeout in seconds
});
