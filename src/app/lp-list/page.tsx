import { createSupabaseReadOnlyClient } from "@/lib/supabase/server";
import { LP } from "@/lib/types";
import { LPCard } from "@/components/lp-card";

async function getLPs(): Promise<LP[]> {
  const supabase = await createSupabaseReadOnlyClient();

  const { data, error } = await supabase
    .from("lps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("LP 조회 오류:", error);
    return [];
  }

  return data || [];
}

export default async function LpsPage() {
  const lps = await getLPs();

  return (
    <main className="p-6 md:p-10" aria-labelledby="lps-heading">
      <div className="max-w-7xl mx-auto">
        <h1 id="lps-heading" className="text-2xl font-semibold mb-2">
          LP 목록
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          보유 중인 LP를 탐색하고 검색할 수 있습니다.
        </p>

        {lps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">아직 등록된 LP가 없습니다.</p>
            <p className="text-sm text-gray-400">
              관리자가 LP를 추가하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {lps.map((lp) => (
              <LPCard key={lp.id} lp={lp} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
