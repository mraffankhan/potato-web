import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Cash API response for 60 seconds using Next.js ISR.
// This means no matter how many users hit this endpoint, 
// the database is queried AT MOST once per minute.
export const revalidate = 60;

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_halcyon_registration_count');
    
    if (error) {
      return NextResponse.json({ count: 0, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: data || 0 });
  } catch (error: any) {
    return NextResponse.json({ count: 0, error: error.message }, { status: 500 });
  }
}
