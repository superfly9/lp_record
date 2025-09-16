"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LP } from "@/lib/types";

interface FetchTracksButtonProps {
  lp: LP;
  onSuccess?: () => void;
}

export const FetchTracksButton = ({ lp, onSuccess }: FetchTracksButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFetchTracks = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/tracks?lpId=${encodeURIComponent(lp.id)}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '트랙 정보 가져오기에 실패했습니다.');
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasTrackData = lp.tracks && lp.tracks.length > 0;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleFetchTracks}
        disabled={isLoading}
        variant={hasTrackData ? "outline" : "default"}
        size="sm"
      >
        {isLoading ? "가져오는 중..." : hasTrackData ? "트랙 정보 업데이트" : "트랙 정보 가져오기"}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">
          트랙 정보를 성공적으로 가져왔습니다!
        </p>
      )}
    </div>
  );
};