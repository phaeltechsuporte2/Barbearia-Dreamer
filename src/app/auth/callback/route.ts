import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get("cookie");
            if (!cookieHeader) return [];
            return cookieHeader.split(";").map((cookie) => {
              const index = cookie.indexOf("=");
              const name =
                index === -1 ? cookie.trim() : cookie.slice(0, index).trim();
              const value = index === -1 ? "" : cookie.slice(index + 1).trim();
              return { name, value };
            });
          },
          setAll() {},
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(origin + "/");
}
