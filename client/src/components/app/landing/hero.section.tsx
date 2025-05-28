import {
  MessageCircle,
  Users,
  Shield,
  Zap,
  Video,
  Mic,
  Sticker,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

const HeroSection = () => {
  const features = [
    {
      icon: Users,
      title: "Group Chats",
      description:
        "Connect with multiple friends in organized group conversations",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: "Secure",
      description:
        "End-to-end encryption keeps your messages private and secure",
      color: "text-purple-500",
    },
    {
      icon: Video,
      title: "Clear Video Calls",
      description: "Crystal clear video calls with HD quality and low latency",
      color: "text-green-500",
    },
    {
      icon: Mic,
      title: "Voice Calls",
      description: "High-quality voice calls that work seamlessly anywhere",
      color: "text-orange-500",
    },
    {
      icon: Sticker,
      title: "Stickers",
      description: "Express yourself with thousands of fun stickers and emojis",
      color: "text-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track your communication patterns and activity insights",
      color: "text-indigo-500",
    },
    {
      icon: MessageSquare,
      title: "Stories (Statuses)",
      description: "Share moments with disappearing stories and status updates",
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Slow
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Chat
              </span>
            </h1>
          </div>

          {/* Main headline */}
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 leading-tight">
            Connect instantly with friends and family
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience seamless messaging with end-to-end encryption, group
            chats, and lightning-fast delivery. Your conversations, simplified.
          </p>

          {/* Features Carousel */}
          <div className="mb-8">
            <Carousel
              className="w-full max-w-4xl mx-auto"
              opts={{ align: "center", loop: true }}
            >
              <CarouselContent className="-ml-2 md:-ml-4 py-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <CarouselItem
                      key={index}
                      className="hover:cursor-grab pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 h-full">
                        <IconComponent
                          className={`w-8 h-8 ${feature.color} mx-auto mb-3`}
                        />
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex hover:cursor-pointer" />
              <CarouselNext className="hidden md:flex hover:cursor-pointer" />
            </Carousel>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href={"/auth/register"}>Sign Up - It's Free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
              asChild
            >
              <Link href={"/auth/login"}>Sign In</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 text-gray-500">
            <p className="text-sm mb-4">Trusted by millions worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
