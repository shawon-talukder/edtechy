"use client";

import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";

import useConfettiStore from "@/hooks/useConfettiStore";
import MuxPlayer from "@mux/mux-player-react";

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
  const router = useRouter();
  const confetti = useConfettiStore();

  const lockContent = (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-y-2  text-secondary">
      <Lock className="h-8 w-8" />
      <p className="text-sm">This chapter is locked</p>
    </div>
  );

  const handleEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );
      }
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      router.refresh();

      if (!nextChapterId) {
        confetti.onOpen();
      }
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

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
          onEnded={handleEnd}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
