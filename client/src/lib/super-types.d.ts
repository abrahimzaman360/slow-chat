interface ReadOnlyUser {
  id: string;
  name: string;
  username: string;
}

interface User extends ReadOnlyUser {
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  lastSeen: Date;
  createdAt: Date;
}

type AuthContextType = {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refreshUser: () => void;
  invalidateUser: () => void;
  logout: () => void;
};

// Chat Messages:

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  lastSeen: string;
}

interface MediaFile {
  type: "image" | "video" | "audio" | "file";
  url: string;
  name: string;
  size: number;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  reactions?: Reaction[];
  status: "sent" | "delivered" | "read";
  replyTo?: string;
  mediaFiles?: MediaFile[];
}

// Stories:

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  media: StoryMedia[];
  timestamp: Date;
  isViewed: boolean;
}

interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // for videos or display time
}

interface StoryPreview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  previewMedia: string; // latest story preview
  timestamp: Date;
  isViewed: boolean;
  storiesCount: number;
}