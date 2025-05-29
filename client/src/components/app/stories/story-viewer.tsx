"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface StoryViewerProps {
  story: StoryPreview;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Mock story duration (5 seconds per story)
  const storyDuration = 5000;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story or close
          if (currentStoryIndex < story.storiesCount - 1) {
            setCurrentStoryIndex((prev) => prev + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 100 / (storyDuration / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStoryIndex, story.storiesCount, onClose]);

  const handleNext = () => {
    if (currentStoryIndex < story.storiesCount - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "now";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {Array.from({ length: story.storiesCount }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? "100%"
                    : index === currentStoryIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 ring-2 ring-white">
            <AvatarImage src={story.userAvatar} alt={story.userName} />
            <AvatarFallback>{story.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium text-sm">{story.userName}</p>
            <p className="text-white/80 text-xs">{timeAgo(story.timestamp)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Story Content */}
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${story.previewMedia})` }}
      >
        {/* Navigation Areas */}
        <div
          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-10"
          onClick={handlePrevious}
        />
        <div
          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-10"
          onClick={handleNext}
        />

        {/* Navigation Buttons (visible on hover) */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="text-white hover:bg-white/20"
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-4 z-10">
        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Reply to story..."
            className="w-full bg-transparent text-white placeholder-white/70 outline-none text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
