import { Track } from "@/lib/types";

interface Props {
  tracks: Track[] | null;
  isLoading: boolean;
  error: string | null;
}

export function TracksList({ tracks, isLoading, error }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
      {isLoading ? (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">트랙 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-sm text-red-500 mb-2">트랙 정보를 가져올 수 없습니다</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      ) : tracks && tracks.length > 0 ? (
        <div className="max-h-48 overflow-y-auto">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6 text-center flex-shrink-0">
                  {track.track_number}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {track.title}
                </span>
              </div>
              {track.duration && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {track.duration}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">트랙 정보가 없습니다</p>
        </div>
      )}
    </div>
  );
}

