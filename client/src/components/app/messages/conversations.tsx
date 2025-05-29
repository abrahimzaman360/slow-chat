"use client";
import React, { useState } from "react";
import {
  Search,
  Archive,
  MoreVertical,
  ArchiveIcon,
  PlusCircleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConversationListProps {
  conversations: Conversation[];
  selectedChat: Conversation | null;
  onSelectChat: (chat: Conversation) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedChat,
  onSelectChat,
  searchQuery,
  onSearchChange,
}) => {
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon">
              <PlusCircleIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowArchived(!showArchived)}
              className={showArchived ? "bg-blue-50 text-blue-600" : ""}
            >
              <ArchiveIcon />
              <span className="sr-only">Archive</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {showArchived ? (
          <div className="p-4 text-center text-gray-500">
            <Archive className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No archived conversations</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedChat?.id === conversation.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
                onClick={() => onSelectChat(conversation)}
              >
                <div className="relative mr-3">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 min-w-[20px] h-5 flex items-center justify-center"
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
