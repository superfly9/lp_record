"use client";

import { LP } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { InfoRow } from "./InfoRow";
import { TracksList } from "./TracksList";
import { useTracks } from "@/hooks/useTracks";
import { getConditionText } from "./utils";

interface Props {
  lp: LP;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LPDetailsModal({ lp, open, onOpenChange }: Props) {
  const { title, artist, cover_url, genre, year, condition } = lp;
  const { tracks, isLoading, error } = useTracks(open ? lp.id : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 앨범 커버 */}
          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {cover_url ? (
              <Image
                src={cover_url}
                alt={`${title} by ${artist}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No Cover Available</p>
                </div>
              </div>
            )}
          </div>

          {/* 앨범 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <InfoRow label="아티스트">
                <Badge variant="secondary">{artist}</Badge>
              </InfoRow>
              {genre && (
                <InfoRow label="장르">
                  <span className="text-sm">{genre}</span>
                </InfoRow>
              )}
              {year && (
                <InfoRow label="발매년도">
                  <span className="text-sm">{year}</span>
                </InfoRow>
              )}
              <InfoRow label="상태">
                <Badge variant={condition === "excellent" ? "default" : "outline"}>
                  {getConditionText(condition)}
                </Badge>
              </InfoRow>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">트랙 목록</h4>
          <TracksList tracks={tracks} isLoading={isLoading} error={error} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

