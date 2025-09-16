import { redirect } from "next/navigation";
import { createSupabaseReadOnlyClient } from "@/lib/supabase/server";
import { LP } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { FetchTracksButton } from "@/components/admin/fetch-tracks-button";
import { AdminAlbumSearch } from "@/components/admin/album-search";

export default async function AdminPage() {
  const supabase = await createSupabaseReadOnlyClient();

  // 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 관리자 권한 확인
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/login");
  }

  const { data: lps, error } = await supabase
    .from("lps")
    .select(
      `
      *,
      tracks(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("LP 목록 조회 오류:", error);
  }

  return (
    <main className="p-6 md:p-10" aria-labelledby="admin-heading">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 id="admin-heading" className="text-3xl font-bold">
            관리자 페이지
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            안녕하세요, {profile.display_name}님! LP, 좌석, 예약을 관리할 수
            있습니다.
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">LP 관리</h2>

        {/* Spotify 검색 및 LP 생성 */}
        <AdminAlbumSearch />

        {!lps || lps.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            등록된 LP가 없습니다.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lps.map((lp: LP) => (
              <Card key={lp.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{lp.title}</CardTitle>
                  <CardDescription>
                    {lp.artist} • {lp.year || "N/A"}
                  </CardDescription>
                  <CardAction>
                    <FetchTracksButton lp={lp} />
                  </CardAction>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                    {lp.genre && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                        {lp.genre}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {lp.condition}
                    </span>
                  </div>

                  <div className="text-sm">
                    <strong>트랙 수:</strong> {lp.tracks?.length || 0}개
                  </div>

                  {lp.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {lp.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
