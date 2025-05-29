import React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CreateStoryCardProps {
  onClick: () => void;
}

export const CreateStoryCard: React.FC<CreateStoryCardProps> = ({
  onClick,
}) => {
  return (
    <Card
      className="relative aspect-[3/4] overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200 bg-gradient-to-b from-blue-500 to-purple-600"
      onClick={onClick}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-center">Create Story</span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </Card>
  );
};
