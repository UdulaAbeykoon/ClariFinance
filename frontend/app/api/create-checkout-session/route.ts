import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email, // pre-fill email
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'ClariFi Premium Subscription',
                            description: 'Unlimited personalized courses and mock interviews.',
                        },
                        unit_amount: 500, // $5.00/month
                        recurring: {
                            interval: 'month',
                        }
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/subscribe`,
            metadata: {
                userId: user.id
            }
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error("Error creating stripe checkout session:", err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: err.statusCode || 500 });
    }
}
