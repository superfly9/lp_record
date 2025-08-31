import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type CookieOption = {
	expires? : Date | undefined;
	httpOnly? : boolean | undefined;
	maxAge? : number | undefined;
	sameSite?:true | false | 'lax' | 'strict' | 'none' | undefined;
	secure?:boolean | undefined;
}

export const createSupabaseServerClient = async() => {
	const cookieStore = await cookies();
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
