import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Prevent crash if keys are missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/signup') &&
            !request.nextUrl.pathname.startsWith('/auth') &&
            !request.nextUrl.pathname.startsWith('/onboarding') &&
            request.nextUrl.pathname !== '/' // Allow home page
        ) {
            const isProtectedArea = request.nextUrl.pathname.startsWith('/courses') || request.nextUrl.pathname.startsWith('/chat');
            const isSubscribePage = request.nextUrl.pathname.startsWith('/subscribe');

            if (!user) {
                // No user, redirect from protected routes to login
                if (isProtectedArea || isSubscribePage) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/login';
                    return NextResponse.redirect(url);
                }
            } else {
                // User is authenticated
                if (isSubscribePage) {
                    // Redirect from subscribe page to courses
                    const url = request.nextUrl.clone();
                    url.pathname = '/courses';
                    return NextResponse.redirect(url);
                }
            }
        }
    } catch {
        // Supabase unreachable – allow the request through without auth check
    }

    return supabaseResponse
}
