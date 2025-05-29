"use client";
import { ConversationView } from "@/components/app/messages/conversation-view";
import { ConversationList } from "@/components/app/messages/conversations";
import { useState } from "react";

const mockChats: Conversation[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1-5?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How are you doing?",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    lastSeen: "online",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Thanks for the help yesterday!",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
    lastSeen: "last seen 1 hour ago",
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Looking forward to our meeting!",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    isOnline: false,
    lastSeen: "last seen 2 hours ago",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    text: "Hey! How are you doing?",
    timestamp: new Date(Date.now() - 120000),
    isOwn: false,
    reactions: [{ emoji: "👍", count: 1, users: ["current-user"] }],
    status: "read",
  },
  {
    id: "2",
    senderId: "current-user",
    text: "I'm doing great! Just finished a big project at work.",
    timestamp: new Date(Date.now() - 60000),
    isOwn: true,
    reactions: [],
    status: "read",
  },
  {
    id: "3",
    senderId: "1",
    text: "That sounds awesome! What kind of project was it?",
    timestamp: new Date(Date.now() - 30000),
    isOwn: false,
    reactions: [],
    status: "delivered",
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = (text: string, mediaFiles?: File[]) => {
    if (!selectedChat || (!text.trim() && !mediaFiles?.length)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      text: text.trim(),
      timestamp: new Date(),
      isOwn: true,
      reactions: [],
      status: "sent",
      mediaFiles: mediaFiles?.map((file) => ({
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
          ? "audio"
          : "file",
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      })),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(
            (r) => r.emoji === emoji
          );
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count + 1,
                      users: [...r.users, "current-user"],
                    }
                  : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, count: 1, users: ["current-user"] },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <ConversationList
          conversations={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ConversationView
            conversation={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
