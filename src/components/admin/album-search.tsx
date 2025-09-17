"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchResultItem {
  id: string;
  name: string;
  images: Array<{ url: string; height: number | null; width: number | null }>;
  artists: Array<{ id: string; name: string }>;
  release_date?: string;
  external_urls?: { spotify?: string };
}

export function AdminAlbumSearch() {
  const router = useRouter();
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [market, setMarket] = useState("KR");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [fetchTracksAfterCreate, setFetchTracksAfterCreate] = useState(true);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const MAX_LIMIT = 20;
      const params = new URLSearchParams();
      if (artist) params.set("artist", artist);
      if (album) params.set("album", album);
      if (market) params.set("market", market);
      params.set("limit", String(MAX_LIMIT));
      const response = await fetch(`/api/spotify/search-album?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "검색 실패");
      setResults(data.results || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLP = async (item: SearchResultItem) => {
    try {
      setCreatingId(item.id);
      const primaryArtist = item.artists?.[0]?.name || "";
      const cover = item.images?.[0]?.url || undefined;
      const year = item.release_date ? Number(item.release_date.slice(0, 4)) : undefined;

      // supbabase DB에 저장
      const response = await fetch('/api/lps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.name,
          artist: primaryArtist,
          cover_url: cover,
          year,
          spotify_album_id: item.id, // 앨범 ID 저장
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'LP 생성 실패');

      const created = data.lp as { id: string } | undefined;
      if (fetchTracksAfterCreate && created?.id) {
        try { await fetch(`/api/tracks?lpId=${encodeURIComponent(created.id)}`); } catch {}
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '생성 중 오류');
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <div className="mb-10 rounded-lg border p-4">
      <h3 className="font-semibold mb-3">Spotify 앨범 검색</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <input
          className="border rounded px-3 py-2 bg-background"
          placeholder="아티스트"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 bg-background"
          placeholder="앨범"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 bg-background"
          placeholder="마켓(KR 등)"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input
            id="fetchTracksAfterCreate"
            type="checkbox"
            checked={fetchTracksAfterCreate}
            onChange={(e) => setFetchTracksAfterCreate(e.target.checked)}
          />
          <label htmlFor="fetchTracksAfterCreate" className="text-sm">생성 후 트랙도 가져오기</label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? '검색 중...' : '검색'}
        </Button>
        {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
      </div>

      {results.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <div key={item.id} className="border rounded p-3 flex gap-3">
              <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                {item.images?.[0]?.url ? (
                  <Image width={100} height={100} src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" title={item.name}>{item.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate" title={item.artists?.map(a=>a.name).join(', ')}>
                  {item.artists?.map(i => i.name).join(', ')}
                </div>
                <div className="text-xs text-gray-500">{item.release_date || '—'}</div>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleCreateLP(item)} disabled={creatingId === item.id}>
                    {creatingId === item.id ? '생성 중...' : 'LP 생성'}
                  </Button>
                  {item.external_urls?.spotify && (
                    <a className="ml-3 text-xs text-blue-600 underline" href={item.external_urls.spotify} target="_blank" rel="noreferrer">Spotify</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
