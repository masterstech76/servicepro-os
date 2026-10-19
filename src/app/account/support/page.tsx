"use client";

import * as React from "react";
import {
  HelpCircle,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CustomerSupportTicket } from "@/lib/server/customer-portal";

export default function SupportPage() {
  const [tickets, setTickets] = React.useState<CustomerSupportTicket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showNewTicket, setShowNewTicket] = React.useState(false);

  // Form
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<CustomerSupportTicket["category"]>("general");
  const [priority, setPriority] = React.useState<CustomerSupportTicket["priority"]>("normal");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/support");
      if (!res.ok) throw new Error("Failed to load tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      toast.error("Unable to load support inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please enter both a subject and details for your request.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit support request");
      toast.success("Support ticket created. Our team will contact you shortly.");
      setSubject("");
      setMessage("");
      setShowNewTicket(false);
      fetchTickets();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
            Customer Support & Service Help
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Submit service inquiries, warranty questions, or request assistance from our Miami office.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs sm:text-sm shadow-md"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>{showNewTicket ? "Close Form" : "New Support Request"}</span>
        </Button>
      </div>

      {/* New Ticket Form (Collapsible) */}
      {showNewTicket && (
        <div className="rounded-2xl border-2 border-orange-400 bg-white p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-bold text-navy-900">Submit Service Request</h2>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <Label htmlFor="tick-subject" className="text-xs font-bold text-slate-700">
                Subject / Summary *
              </Label>
              <Input
                id="tick-subject"
                required
                placeholder="e.g. Question regarding condenser fan warranty or maintenance plan"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tick-cat" className="text-xs font-bold text-slate-700">
                  Category *
                </Label>
                <select
                  id="tick-cat"
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="rescheduling">Rescheduling Assistance</option>
                  <option value="billing">Billing & Invoice Question</option>
                  <option value="warranty">Warranty & 100% Guarantee Claim</option>
                  <option value="equipment">HVAC Equipment & Parts</option>
                </select>
              </div>

              <div>
                <Label htmlFor="tick-pri" className="text-xs font-bold text-slate-700">
                  Urgency / Priority *
                </Label>
                <select
                  id="tick-pri"
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <option value="normal">Normal (Response within 2 hours)</option>
                  <option value="urgent">Urgent (No AC / Emergency)</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="tick-msg" className="text-xs font-bold text-slate-700">
                Detailed Message *
              </Label>
              <Textarea
                id="tick-msg"
                required
                rows={4}
                placeholder="Please describe how we can assist you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewTicket(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold text-xs"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>Submit Ticket</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 24/7 Hotline Strip */}
      <div className="rounded-2xl bg-navy-900 text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-orange-500 text-navy-900 flex items-center justify-center font-bold">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Need Urgent Telephone Support?</h3>
            <p className="text-xs text-slate-300">
              Our dispatch agents are available 24/7 for emergency diagnostic calls and live updates.
            </p>
          </div>
        </div>
        <a
          href={`tel:${businessConfig.phone.replace(/[^\d+]/g, "")}`}
          className="rounded-xl bg-white hover:bg-slate-100 text-navy-900 font-bold text-xs px-4 py-2.5 shadow transition-colors shrink-0"
        >
          Call {businessConfig.phone}
        </a>
      </div>

      {/* Ticket History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100">
          Your Inquiries & Requests
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <HelpCircle className="h-8 w-8 mx-auto text-slate-400" />
            <p className="font-bold text-navy-900">No Support Requests Filed</p>
            <p>If you have any questions or require help, click above to create a request.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-orange-600">
                      {t.ticketNumber}
                    </span>
                    <h3 className="text-sm font-bold text-navy-900">{t.subject}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                      t.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "in_review"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {t.status === "resolved" ? "Resolved" : t.status === "in_review" ? "In Review" : "Open"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {t.message}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Category: <strong className="text-slate-600 capitalize">{t.category}</strong></span>
                  <span>•</span>
                  <span>Submitted: {format(new Date(t.createdAt), "MMM d, yyyy • h:mm a")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
