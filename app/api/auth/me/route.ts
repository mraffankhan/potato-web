import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ authenticated: false }, { 
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        return NextResponse.json({
            authenticated: true,
            user: session.user,
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Auth/me Error:', error);
        return NextResponse.json({ authenticated: false, error: 'Failed to authenticate session' }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    }
}
