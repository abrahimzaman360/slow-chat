"use client";
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StoryCardProps {
  story: StoryPreview;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours === 1) return '1h';
    return `${hours}h`;
  };

  return (
    <Card 
      className={`relative aspect-[3/4] overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200 ${
        story.isViewed ? 'ring-2 ring-gray-300' : 'ring-2 ring-blue-500'
      }`}
      onClick={onClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundImage: `url(${story.previewMedia})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      {/* User Avatar */}
      <div className="absolute top-3 left-3">
        <Avatar className={`w-8 h-8 ring-2 ${story.isViewed ? 'ring-gray-300' : 'ring-white'}`}>
          <AvatarImage src={story.userAvatar} alt={story.userName} />
          <AvatarFallback>{story.userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      
      {/* Time indicator */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {timeAgo(story.timestamp)}
      </div>
      
      {/* User name */}
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white text-sm font-medium truncate">{story.userName}</p>
        {story.storiesCount > 1 && (
          <p className="text-white/80 text-xs">{story.storiesCount} stories</p>
        )}
      </div>
      
      {/* Story indicators */}
      <div className="absolute top-1 left-1 right-1 flex space-x-1">
        {Array.from({ length: story.storiesCount }).map((_, index) => (
          <div 
            key={index}
            className={`flex-1 h-0.5 rounded-full ${
              story.isViewed ? 'bg-gray-400' : 'bg-white'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};