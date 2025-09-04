"use client";

import { useState } from "react";
import { LP } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useTracks } from "@/hooks/useTracks";

interface LPCardProps {
  lp: LP;
}

export function LPCard({ lp }: LPCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, title, artist, cover_url, genre, year, condition, notes } = lp;
  const {
    tracks,
    isLoading: tracksLoading,
    error: tracksError,
  } = useTracks(isModalOpen ? id : null);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "최상급";
      case "good":
        return "양호";
      case "fair":
        return "보통";
      case "poor":
        return "불량";
      default:
        return condition;
    }
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${title} by ${artist} 상세보기`}
      >
        <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
          {cover_url ? (
            <Image
              src={cover_url}
              alt={`${title} by ${artist}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No Cover
                </p>
              </div>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {artist}
            </Badge>
            <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-300">
              {genre && <span>{genre}</span>}
              {genre && year && <span>•</span>}
              {year && <span>{year}</span>}
            </div>
            {condition && (
              <div className="text-xs">
                <Badge
                  variant={condition === "excellent" ? "default" : "outline"}
                  className="text-xs"
                >
                  {getConditionText(condition)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No Cover Available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 앨범 정보 */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  기본 정보
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                      아티스트
                    </span>
                    <Badge variant="secondary">{artist}</Badge>
                  </div>
                  {genre && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                        장르
                      </span>
                      <span className="text-sm">{genre}</span>
                    </div>
                  )}
                  {year && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                        발매년도
                      </span>
                      <span className="text-sm">{year}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                      상태
                    </span>
                    <Badge
                      variant={
                        condition === "excellent" ? "default" : "outline"
                      }
                    >
                      {getConditionText(condition)}
                    </Badge>
                  </div>
                </div>
              </div>

              {notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    메모
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {notes}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  트랙 목록
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md overflow-hidden">
                  {tracksLoading ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        트랙 정보를 불러오는 중...
                      </p>
                    </div>
                  ) : tracksError ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-red-500 mb-2">
                        트랙 정보를 가져올 수 없습니다
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tracksError}
                      </p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        트랙 정보가 없습니다
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
