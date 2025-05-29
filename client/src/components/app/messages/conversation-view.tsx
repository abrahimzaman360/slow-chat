"use client";
import React, { useRef, useEffect } from "react";
import { ConversationHeader } from "./conversation-header";
import { MessageBubble } from "./message-bubble";
import { ConversationInput } from "./conversation-input";

interface ConversationViewProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string, mediaFiles?: File[]) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  messages,
  onSendMessage,
  onReaction,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ConversationHeader conversation={conversation} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showAvatar =
            !message.isOwn &&
            (index === 0 ||
              messages[index - 1].senderId !== message.senderId ||
              messages[index - 1].isOwn);

          return (
            <MessageBubble
              key={message.id}
              message={message}
              showAvatar={showAvatar}
              onReaction={onReaction}
              senderAvatar={conversation.avatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <ConversationInput onSendMessage={onSendMessage} />
    </div>
  );
};
