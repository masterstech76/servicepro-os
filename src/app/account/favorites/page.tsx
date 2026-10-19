"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteItem {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  priceCents: number;
  durationMinutes: number;
  savedAt: string;
}

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadFavorites = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function handleRemove(serviceId: string) {
    // optimistic update
    setFavorites((prev) => prev.filter((f) => f.serviceId !== serviceId));
    try {
      await fetch("/api/account/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
    } catch {
      // reload if failed
      loadFavorites();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-orange-500 fill-orange-500" />
            Saved Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quickly book your favorite regular maintenance packages and home services
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          <Link href="/services">
            Browse All Services
          </Link>
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading saved services...
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <Bookmark className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="text-base font-bold text-navy-950">No Saved Services</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bookmark services you order often (like seasonal AC tune-ups or duct cleaning) for instant 1-click rebooking.
          </p>
          <Button asChild className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs mt-2">
            <Link href="/services">
              Explore Available Services
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.serviceId)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-navy-950">
                    {item.serviceName}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {item.durationMinutes} mins duration
                    </span>
                    <span className="font-bold text-navy-950">
                      ${(item.priceCents / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Saved on {new Date(item.savedAt).toLocaleDateString()}
                </span>

                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-9 px-4 shadow-sm"
                >
                  <Link href={`/book?service=${item.serviceId}`} className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
