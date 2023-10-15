"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  playbackId: string;
  nextChapterId?: string;
  title: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  playbackId,
  title,
  nextChapterId,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  console.log(playbackId);
  const lockContent = (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2  text-secondary">
      <Lock className="h-8 w-8" />
      <p className="text-sm">This chapter is locked</p>
    </div>
  );

  return (
    <div className="relative aspect-video">
      {isLocked && lockContent}
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="animate-spin h-8 w-8 text-secondary" />
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
