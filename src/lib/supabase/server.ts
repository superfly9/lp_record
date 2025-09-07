import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=server
// Server Components용 - 쿠키 읽기만 가능 (쓰기 시도하지 않음)
// Next.js 15에서는 쿠키 수정 권한이 제한됨
// Server Component -> 쿠키 읽기만 가능
// Server Action/Route Handler -> 읽기 / 쓰기 다 가능

export const createSupabaseReadOnlyClient = async() => {
	const cookieStore = await cookies();
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}

	// cookieStore.set 부분에서 Cookies can only be modified in a Server Action or Route Handler 에러 발생하여 분리
	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll() {
				// Server Components에서는 쿠키 설정 불가
			},
		},
	});
};

// Route Handlers와 Server Actions용 - 쿠키 읽기/쓰기 가능
export const createSupabaseFullAccessClient = async() => {
	const cookieStore = await cookies();
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}

	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookieStore.set(name, value, options)
				);
			},
		},
	});
};