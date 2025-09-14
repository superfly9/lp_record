import { useState, useEffect, useCallback } from 'react';
import { Track } from '@/lib/types';

interface UseTracksResult {
  tracks: Track[] | null;
  isLoading: boolean;
  error: string | null;
  fetchTracks: () => Promise<void>;
}

export function useTracks(lpId: string | null): UseTracksResult {
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    if (!lpId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tracks?lpId=${encodeURIComponent(lpId)}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '트랙 정보를 가져오는데 실패했습니다.');
      }

      setTracks(data.tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  },[lpId]);

  useEffect(() => {
    if (lpId) {
      fetchTracks();
    }
  }, [lpId, fetchTracks]);

  return {
    tracks,
    isLoading,
    error,
    fetchTracks,
  };
}
