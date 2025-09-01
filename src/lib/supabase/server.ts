import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type CookieOption = {
	expires? : Date | undefined;
	httpOnly? : boolean | undefined;
	maxAge? : number | undefined;
	sameSite?:true | false | 'lax' | 'strict' | 'none' | undefined;
	secure?:boolean | undefined;
}

// https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=server
export const createSupabaseServerClient = async() => {
	const cookieStore = await cookies(); // 유저 세션 데이터 읽기 위한 용도
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}

	return createServerClient(url, anonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOption) {
				cookieStore.set(name, value, options);
			},
			remove(name: string, options: CookieOption) {
				cookieStore.set(name, "", { ...options, maxAge: 0 });
			},
		},
	});
};