"use client";

import { useState } from "react";
import { LP } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LPCardCover } from "./lp-card/LPCardCover";
import { LPDetailsModal } from "./lp-card/LPDetailsModal";
import { getConditionText } from "./lp-card/utils";

interface LPCardProps {
  lp: LP;
}

export function LPCard({ lp }: LPCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, artist, cover_url, genre, year, condition } = lp;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full w-full py-0 gap-0"
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
        <LPCardCover coverUrl={cover_url} title={title} artist={artist} />
        <CardHeader className="py-4">
          <h3 className="font-semibold text-sm leading-tight">{title}</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {artist}
            </Badge>
            <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-300 py-1">
              {genre && <span>{genre}</span>}
              {genre && year && <span>•</span>}
              {year && <span>{year}</span>}
            </div>
            {condition && (
              <div className="text-xs">
                <Badge
                  variant={condition === "excellent" ? "default" : "outline"}
                  className="text-xs mb-2"
                >
                  {getConditionText(condition)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <LPDetailsModal
        lp={lp}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
