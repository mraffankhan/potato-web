import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params;

        const { data, error } = await supabase
            .from('welcome_configs')
            .select('*')
            .eq('guild_id', guildId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error('Supabase error fetching welcome config:', error);
            return NextResponse.json({ error: 'Failed to fetch welcome config' }, { status: 500 });
        }

        return NextResponse.json(data || {
            guild_id: guildId,
            channel_id: null,
            message: 'Welcome {user} to **{server}**! You are member #{member_count}.',
            enabled: false,
            embed_enabled: false,
            embed_color: 65459,
            embed_title: 'Welcome!'
        });

    } catch (error) {
        console.error('Error fetching welcome config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params;
        const body = await req.json();

        // Validate guildId matches
        if (body.guild_id && body.guild_id !== guildId) {
            return NextResponse.json({ error: 'Guild ID mismatch' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('welcome_configs')
            .upsert({
                guild_id: guildId,
                channel_id: body.channel_id,
                message: body.message,
                enabled: body.enabled,
                embed_enabled: body.embed_enabled,
                embed_color: body.embed_color,
                embed_title: body.embed_title
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error updating welcome config:', error);
            return NextResponse.json({ error: 'Failed to update welcome config' }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error updating welcome config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
