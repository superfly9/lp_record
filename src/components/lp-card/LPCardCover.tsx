import Image from "next/image";

interface Props {
  coverUrl?: string;
  title: string;
  artist: string;
}

export function LPCardCover({ coverUrl, title, artist }: Props) {
  return (
    <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={`${title} by ${artist}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">No Cover</p>
          </div>
        </div>
      )}
    </div>
  );
}
