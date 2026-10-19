"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import { toast } from "sonner";
import type { AdminReviewItem } from "@/lib/server/admin-portal";

export default function AdminReviewsModerationPage() {
  const [reviews, setReviews] = React.useState<AdminReviewItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actingId, setActingId] = React.useState<string | null>(null);

  const tz = businessConfig.timezone;

  const loadReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (statusFilter !== "all") sp.set("status", statusFilter);
      if (searchQuery.trim()) sp.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/reviews?${sp.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  React.useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function handleModerate(reviewId: string, status: "approved" | "rejected") {
    setActingId(reviewId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      if (res.ok) {
        toast.success(`Review ${status} successfully`);
        await loadReviews();
      } else {
        toast.error("Failed to update review status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
            <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
            Review Moderation
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            Review, approve, and moderate customer testimonials before public publication.
          </p>
        </div>

        <Link
          href="/reviews"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-800 font-bold text-xs"
        >
          <span>View Public Reviews</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name, feedback content, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {["all", "approved", "pending", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                statusFilter === st
                  ? "bg-navy-900 text-white shadow-sm"
                  : "bg-slate-100 text-navy-700 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200 bg-white">
            Loading reviews for moderation...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200 bg-white">
            No customer reviews match the specified criteria.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="font-bold text-sm text-navy-900">{r.customerName}</div>
                  <span className="text-xs text-slate-400">• {r.customerLocation}</span>
                  <Link
                    href={`/admin/jobs/${r.jobId}`}
                    className="font-mono text-xs font-bold text-orange-600 hover:underline"
                  >
                    Job #{r.jobNumber}
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatInTimeZone(new Date(r.createdAt), tz, "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Star Rating & Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-navy-800 ml-1.5">{r.serviceName}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{r.content}</p>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {r.status !== "approved" && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={actingId === r.id}
                    onClick={() => handleModerate(r.id, "approved")}
                    className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Approve &amp; Publish
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={actingId === r.id}
                    onClick={() => handleModerate(r.id, "rejected")}
                    className="h-8 px-3 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
