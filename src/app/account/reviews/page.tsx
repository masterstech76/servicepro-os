"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerReview {
  id: string;
  customerId: string;
  jobId: string;
  jobNumber: number;
  serviceName: string;
  rating: number;
  content: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = React.useState<CustomerReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Form state
  const [selectedJobId, setSelectedJobId] = React.useState("job-1001");
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [content, setContent] = React.useState("");

  const loadReviews = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/account/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobId,
          rating,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error?.message || "Failed to submit review");
      } else {
        setSubmitSuccess(true);
        setContent("");
        setTimeout(() => {
          setModalOpen(false);
          setSubmitSuccess(false);
          loadReviews();
        }, 1200);
      }
    } catch {
      setSubmitError("Network connection error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
            My Service Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share feedback on your completed HVAC repairs and technician visits
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs h-10 px-4 self-start sm:self-auto shadow-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Write a Review
        </Button>
      </div>

      {/* Reviews Content */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading your verified service reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="text-base font-bold text-navy-950">No Reviews Written Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once a technician completes service at your property, you can share feedback and rate your experience.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            variant="outline"
            className="rounded-xl text-xs font-bold mt-2"
          >
            Leave Your First Review
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Verified &amp; {rev.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-navy-950">{rev.serviceName}</p>
                  <p className="text-[11px] text-slate-400">
                    Job #{rev.jobNumber} • {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/account/appointments/${rev.jobId}`}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  View Job <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Leave a Service Review
                </h2>
                <p className="text-xs text-slate-500">
                  Help fellow homeowners by sharing your technician experience
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-900">Review Submitted!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for your valuable feedback. Your review is now live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {submitError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Select Completed Service
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="job-1001">Job #1001 — AC Repair &amp; Diagnostic (Oct 14)</option>
                    <option value="job-1002">Job #1002 — Seasonal AC Tune-Up (Oct 08)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Overall Satisfaction Rating
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {hoverRating || rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Your Review Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe the technician's punctuality, the solution provided, and overall quality of service..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs"
                  >
                    {submitting ? "Submitting..." : "Publish Review"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
