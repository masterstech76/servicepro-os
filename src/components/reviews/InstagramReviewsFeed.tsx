"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Star,
  CheckCircle2,
  MapPin,
  Share2,
  Calendar,
  Sparkles,
  Flame,
  Snowflake,
  Wrench,
  ShieldCheck,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

interface ReviewPost {
  id: string;
  username: string;
  name: string;
  avatarBg: string;
  location: string;
  image: string;
  likes: number;
  timeAgo: string;
  service: string;
  serviceSlug: string;
  rating: number;
  workOrder: string;
  caption: string;
  tags: string[];
  techReply?: {
    name: string;
    comment: string;
  };
}

const STORIES = [
  { label: "45m Fast Dispatch", icon: Flame, color: "from-orange-500 via-rose-500 to-amber-500" },
  { label: "56° Cold Air", icon: Snowflake, color: "from-sky-400 via-blue-500 to-indigo-600" },
  { label: "21-Pt Tune-Ups", icon: Wrench, color: "from-emerald-400 via-teal-500 to-cyan-600" },
  { label: "Smart Thermostats", icon: Sparkles, color: "from-purple-500 via-fuchsia-500 to-pink-500" },
  { label: "Verified Pros", icon: ShieldCheck, color: "from-amber-400 via-orange-500 to-rose-500" },
  { label: "Saved $1,200+", icon: CheckCircle2, color: "from-green-400 via-emerald-500 to-teal-600" },
];

const INITIAL_POSTS: ReviewPost[] = [
  {
    id: "rev-1",
    username: "david_m_brickell",
    name: "David M.",
    avatarBg: "from-blue-600 to-indigo-700",
    location: "Brickell, Miami, FL",
    image: "/images/svc-ac-repair.jpg",
    likes: 148,
    timeAgo: "2h ago",
    service: "AC Repair & Diagnostic",
    serviceSlug: "/services/ac-repair",
    rating: 5,
    workOrder: "#WO-1004",
    caption:
      "AC completely stopped blowing cold on a scorching 92° Sunday afternoon. Booked online at 11 AM, Carlos pulled up in under 40 minutes. Replaced the blown dual run capacitor and had cold 56° air blasting before noon. Upfront quote, zero surprise charges! Truly a lifesaver in this heat. 🙌❄️",
    tags: ["#ACRepair", "#BrickellMiami", "#SameDayDispatch", "#5StarHVAC"],
    techReply: {
      name: "Carlos R. (Master Tech)",
      comment:
        "Glad we swapped that capacitor out before the afternoon peak heat David! Enjoy the cold air! 🔧❄️",
    },
  },
  {
    id: "rev-2",
    username: "elena_and_carlos",
    name: "Elena & Carlos S.",
    avatarBg: "from-rose-500 to-orange-500",
    location: "Downtown Miami, FL",
    image: "/images/svc-ac-tuneup.jpg",
    likes: 219,
    timeAgo: "1d ago",
    service: "Seasonal AC Tune-Up",
    serviceSlug: "/services/ac-tuneup",
    rating: 5,
    workOrder: "#WO-1002",
    caption:
      "Best contractor experience in Florida! Marcus showed up with shoe covers, flushed our drain line with biocidal wash, cleaned the coils, and showed full before/after photos with amp draw readings on his tablet. Our electricity bill is already dropping! ⚡📈",
    tags: ["#ACTuneUp", "#PreventativeMaintenance", "#MiamiLiving", "#CleanAir"],
    techReply: {
      name: "Marcus V. (Senior Tech)",
      comment:
        "Those coils were definitely due for that deep rinse! Happy to keep your energy bills low Elena!",
    },
  },
  {
    id: "rev-3",
    username: "marcus_k_gables",
    name: "Marcus K.",
    avatarBg: "from-amber-500 to-orange-600",
    location: "Coral Gables, FL",
    image: "/images/svc-thermostat-install.jpg",
    likes: 94,
    timeAgo: "3d ago",
    service: "Smart Thermostat Install",
    serviceSlug: "/services/thermostat-install",
    rating: 5,
    workOrder: "#WO-1001",
    caption:
      "Our 1950s Gables house lacked a 24V C-wire for the Google Nest. Carlos fished the new low-voltage wire cleanly, installed the Nest Learning Thermostat, and paired both our phones before leaving. Transparent deposit credited straight to invoice! 🏡📱",
    tags: ["#SmartHome", "#NestThermostat", "#CoralGables", "#CleanWiring"],
    techReply: {
      name: "Carlos R. (Master Tech)",
      comment:
        "That historic wall cavity was tight, but that 24V bridge worked like a charm! Enjoy remote climate control!",
    },
  },
  {
    id: "rev-4",
    username: "sophia_grove",
    name: "Sophia R.",
    avatarBg: "from-teal-500 to-emerald-600",
    location: "Coconut Grove, FL",
    image: "/images/svc-refrigerant-recharge.jpg",
    likes: 182,
    timeAgo: "5d ago",
    service: "Refrigerant Leak Repair",
    serviceSlug: "/services/refrigerant-recharge",
    rating: 5,
    workOrder: "#WO-0994",
    caption:
      "Unit was hissing and freezing into a block of solid ice. Another contractor quoted $8,500 for a full replacement. TechWork came out, found a leaky Schrader service valve, tightened the core, and recharged the subcooling. Honest contractors are rare gems! 🧊🙏",
    tags: ["#HonestPros", "#RefrigerantLeak", "#CoconutGrove", "#SavedThousands"],
    techReply: {
      name: "Marcus V. (Senior Tech)",
      comment:
        "Always test before you replace! So glad we saved you thousands of dollars Sophia!",
    },
  },
];

export function InstagramReviewsFeed() {
  const [posts, setPosts] = React.useState<ReviewPost[]>(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = React.useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = React.useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = React.useState<string>("All");

  const categories = ["All", "AC Repair", "AC Tune-Up", "Smart Thermostats", "Refrigerant"];

  const filteredPosts = React.useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((p) => p.service.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [posts, activeFilter]);

  function handleLike(id: string) {
    setLikedPosts((prev) => {
      const next = !prev[id];
      setPosts((pList) =>
        pList.map((post) =>
          post.id === id ? { ...post, likes: post.likes + (next ? 1 : -1) } : post
        )
      );
      return { ...prev, [id]: next };
    });
  }

  function handleSave(id: string) {
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-16">
      {/* 1. Instagram Stories Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 min-w-max">
          {STORIES.map((story, i) => {
            const Icon = story.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div
                  className={`p-[2.5px] rounded-full bg-gradient-to-tr ${story.color} transition-transform group-hover:scale-105 active:scale-95 shadow-sm`}
                >
                  <div className="bg-white p-1 rounded-full">
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-navy-900 border border-slate-100">
                      <Icon className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-700 tracking-tight text-center max-w-[70px] truncate">
                  {story.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeFilter === cat
                ? "bg-navy-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Instagram Feed Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const isSaved = !!savedPosts[post.id];

          return (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-orange-500/20`}
                  >
                    {post.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-navy-950">
                        {post.username}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 fill-sky-500 text-white" />
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-400 text-xs font-medium">{post.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <MapPin className="h-3 w-3 text-orange-500" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    5.0
                  </span>
                  <Link
                    href={`/reviews/${post.id}`}
                    className="text-slate-400 hover:text-slate-700 p-1"
                    aria-label="View spotlight details"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Post Media Preview */}
              <div className="relative aspect-[16/10] bg-slate-900 group overflow-hidden">
                <Image
                  src={post.image}
                  alt={`${post.service} completed in ${post.location}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Verified Job {post.workOrder}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                      Service Rendered
                    </p>
                    <p className="text-sm font-bold text-white drop-shadow-sm">{post.service}</p>
                  </div>

                  <Link href={`/reviews/${post.id}`}>
                    <Button
                      size="sm"
                      className="bg-white/95 hover:bg-white text-navy-950 text-xs font-bold rounded-lg shadow-md h-8 px-3"
                    >
                      View Report
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Action Bar (Like, Comment, Share, Save) */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 transition-transform active:scale-125 focus:outline-none"
                      aria-label="Like review"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          isLiked
                            ? "fill-rose-500 text-rose-500"
                            : "text-slate-700 hover:text-slate-900"
                        }`}
                      />
                    </button>

                    <Link
                      href={`/reviews/${post.id}`}
                      className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 focus:outline-none"
                      aria-label="Comment"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Link>

                    <Link
                      href={post.serviceSlug}
                      className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 focus:outline-none"
                      aria-label="Share"
                    >
                      <Send className="h-5 w-5" />
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSave(post.id)}
                    className="text-slate-700 hover:text-slate-900 focus:outline-none transition-transform active:scale-125"
                    aria-label="Bookmark"
                  >
                    <Bookmark
                      className={`h-5 w-5 ${
                        isSaved ? "fill-navy-900 text-navy-900" : "text-slate-700"
                      }`}
                    />
                  </button>
                </div>

                {/* Likes Counter */}
                <div className="pt-2 font-bold text-xs text-navy-950">
                  {post.likes.toLocaleString()} likes
                </div>
              </div>

              {/* Caption & Review Body */}
              <div className="px-4 pb-3 space-y-2 text-xs leading-relaxed text-slate-800">
                <p>
                  <span className="font-bold text-navy-950 mr-1.5">{post.username}</span>
                  {post.caption}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-sky-600">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Technician Reply (Threaded Comment Style) */}
                {post.techReply && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 bg-slate-50/80 -mx-4 px-4 py-2 flex items-start gap-2 rounded-b-lg">
                    <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      T
                    </div>
                    <div className="text-[11px] leading-snug">
                      <span className="font-bold text-navy-950 mr-1.5">
                        {post.techReply.name}
                      </span>
                      <span className="text-slate-600">{post.techReply.comment}</span>
                    </div>
                  </div>
                )}

                {/* Spotlight Link */}
                <div className="pt-1">
                  <Link
                    href={`/reviews/${post.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    <span>View full work order #{post.workOrder} case breakdown</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
