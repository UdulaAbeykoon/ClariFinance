import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        const { session_id } = await req.json();

        if (!session_id) {
            return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user && session.metadata?.userId === user.id) {
                // Update user metadata in Supabase to grant the subscription
                const { error } = await supabase.auth.updateUser({
                    data: { has_subscription: true }
                });

                if (error) throw error;

                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ error: 'User mismatch or not logged in' }, { status: 403 });
        }

        return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });

    } catch (err: any) {
        console.error("Error verifying stripe session:", err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: err.statusCode || 500 });
    }
}
