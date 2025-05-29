"use client";
import React, { useState } from "react";
import { MoreVertical, Reply, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
  onReaction: (messageId: string, emoji: string) => void;
  senderAvatar: string;
}

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar,
  onReaction,
  senderAvatar,
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = () => {
    if (!message.isOwn) return null;

    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${
        message.isOwn ? "justify-end" : "justify-start"
      } group`}
    >
      <div
        className={`flex max-w-xs lg:max-w-md ${
          message.isOwn ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        {!message.isOwn && (
          <div className="mr-2">
            {showAvatar ? (
              <img
                src={senderAvatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8" />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="relative">
          <div
            className={`px-4 py-2 rounded-2xl ${
              message.isOwn
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
            }`}
            onDoubleClick={() => setShowReactions(!showReactions)}
          >
            {/* Media Files */}
            {message.mediaFiles && message.mediaFiles.length > 0 && (
              <div className="mb-2 space-y-2">
                {message.mediaFiles.map((file, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {file.type === "image" && (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                    {file.type === "video" && (
                      <video controls className="max-w-full h-auto rounded-lg">
                        <source src={file.url} type="video/mp4" />
                      </video>
                    )}
                    {file.type === "audio" && (
                      <audio controls className="w-full">
                        <source src={file.url} type="audio/mpeg" />
                      </audio>
                    )}
                    {file.type === "file" && (
                      <div className="p-2 bg-gray-100 rounded flex items-center">
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Text Content */}
            {message.text && <p className="text-sm">{message.text}</p>}

            {/* Timestamp and Status */}
            <div
              className={`flex items-center mt-1 ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`text-xs ${
                  message.isOwn ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </span>
              {message.isOwn && <div className="ml-1">{getStatusIcon()}</div>}
            </div>
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-full px-2 py-1 text-xs flex items-center gap-1 shadow-sm"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Reactions (appears on hover/double-click) */}
          {showReactions && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-10">
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReaction(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className="hover:bg-gray-100 rounded p-1 text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message Actions */}
          <div
            className={`absolute top-0 ${
              message.isOwn ? "left-0" : "right-0"
            } transform ${
              message.isOwn ? "-translate-x-full" : "translate-x-full"
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <div className="flex gap-1 ml-2 mr-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Reply className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Reply</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Star</DropdownMenuItem>
                  {message.isOwn && <DropdownMenuItem>Edit</DropdownMenuItem>}
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
