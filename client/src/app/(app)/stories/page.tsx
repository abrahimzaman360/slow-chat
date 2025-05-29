"use client";
import { CreateStoryCard } from "@/components/app/stories/create-story";
import { StoryCard } from "@/components/app/stories/story-card";
import { StoryViewer } from "@/components/app/stories/story-viewer";
import React, { useState } from "react";

// Mock data for stories
const mockStories: StoryPreview[] = [
  {
    id: "1",
    userId: "1",
    userName: "Alice Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b15?w=150&h=150&fit=crop&crop=face",
    previewMedia:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=400&fit=crop",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isViewed: false,
    storiesCount: 3,
  },
  {
    id: "2",
    userId: "2",
    userName: "Bob Smith",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    previewMedia:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isViewed: true,
    storiesCount: 1,
  },
  {
    id: "3",
    userId: "3",
    userName: "Emma Wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    previewMedia:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    isViewed: false,
    storiesCount: 2,
  },
  {
    id: "4",
    userId: "4",
    userName: "John Doe",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    previewMedia:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=400&fit=crop",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    isViewed: true,
    storiesCount: 4,
  },
  {
    id: "5",
    userId: "5",
    userName: "Sarah Connor",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    previewMedia:
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=400&fit=crop",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    isViewed: false,
    storiesCount: 1,
  },
];

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<StoryPreview | null>(null);
  const [stories, setStories] = useState<StoryPreview[]>(mockStories);

  const handleStoryClick = (story: StoryPreview) => {
    setSelectedStory(story);
    // Mark as viewed
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, isViewed: true } : s))
    );
  };

  const handleCreateStory = () => {
    console.log("Create story clicked");
    // TODO: Implement story creation
  };

  const handleCloseViewer = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Stories</h1>
          <p className="text-gray-600">See what your friends are up to</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Create Story Card - Always first */}
          <CreateStoryCard onClick={handleCreateStory} />

          {/* Story Cards */}
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(story)}
            />
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer story={selectedStory} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
