"use client";

import * as React from "react";
import {
  MessageSquare,
  Send,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Paperclip,
  Smile,
  ShieldCheck,
  ChevronRight,
  Headphones,
  User,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CustomerSupportTicket } from "@/lib/server/customer-portal";

interface ChatMessage {
  id: string;
  sender: "customer" | "dispatch" | "system";
  senderName: string;
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

const DEFAULT_CONVERSATIONS = [
  {
    id: "conv-1",
    ticketNumber: "#TICK-1042",
    subject: "Work Order #WO-1004 Capacitor Warranty Check",
    preview: "Sarah (Dispatch): Your Titan HD capacitor is registered under our 365-day warranty.",
    time: "10:45 AM",
    unread: false,
    status: "in_review",
    category: "warranty",
    messages: [
      {
        id: "m-1",
        sender: "system" as const,
        senderName: "System",
        text: "Live support thread initiated for Work Order #WO-1004 (AC Diagnostic & Capacitor Replacement).",
        timestamp: "10:30 AM",
      },
      {
        id: "m-2",
        sender: "customer" as const,
        senderName: "You",
        text: "Hi! Carlos replaced our run capacitor on Sunday. Does our warranty cover potential compressor fan motor issues if the unit cycles frequently?",
        timestamp: "10:32 AM",
        status: "read" as const,
      },
      {
        id: "m-3",
        sender: "dispatch" as const,
        senderName: "Sarah • Senior Dispatcher",
        text: "Hi David! Yes, absolutely. Your Titan HD capacitor and labor are 100% protected under our 1-year workmanship warranty. If you ever notice fan short-cycling or temperature variance, just reply right here or call us — we will dispatch Carlos back out at zero dispatch fee!",
        timestamp: "10:35 AM",
      },
      {
        id: "m-4",
        sender: "customer" as const,
        senderName: "You",
        text: "That gives us great peace of mind. Thank you so much Sarah!",
        timestamp: "10:42 AM",
        status: "read" as const,
      },
      {
        id: "m-5",
        sender: "dispatch" as const,
        senderName: "Sarah • Senior Dispatcher",
        text: "You're very welcome! Stay cool in that crisp 56° air! ❄️",
        timestamp: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    ticketNumber: "#TICK-1029",
    subject: "Seasonal 21-Point Maintenance Plan Enrollment",
    preview: "Marcus (Tech Specialist): Confirmed semi-annual coil wash and drain treatments.",
    time: "Yesterday",
    unread: false,
    status: "resolved",
    category: "equipment",
    messages: [
      {
        id: "m-10",
        sender: "customer" as const,
        senderName: "You",
        text: "Can I add whole-home duct inspection to our upcoming spring maintenance schedule?",
        timestamp: "Yesterday, 2:15 PM",
        status: "read" as const,
      },
      {
        id: "m-11",
        sender: "dispatch" as const,
        senderName: "Marcus • Field Specialist",
        text: "Certainly! We have bundled the whole-home duct air-velocity check with your $89 tune-up. Your appointment is locked in with zero extra diagnostic fees.",
        timestamp: "Yesterday, 2:24 PM",
      },
    ],
  },
];

export default function SupportMessengerPage() {
  const [tickets, setTickets] = React.useState<CustomerSupportTicket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedThreadId, setSelectedThreadId] = React.useState<string>("conv-1");
  const [threadMessages, setThreadMessages] = React.useState<Record<string, ChatMessage[]>>({
    "conv-1": DEFAULT_CONVERSATIONS[0].messages,
    "conv-2": DEFAULT_CONVERSATIONS[1].messages,
  });

  const [inputMessage, setInputMessage] = React.useState("");
  const [showNewModal, setShowNewModal] = React.useState(false);

  // New ticket state
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<CustomerSupportTicket["category"]>("general");
  const [priority, setPriority] = React.useState<CustomerSupportTicket["priority"]>("normal");
  const [details, setDetails] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      // fallback to demo threads
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const activeMessages = threadMessages[selectedThreadId] || threadMessages["conv-1"];
  const activeConversation = DEFAULT_CONVERSATIONS.find((c) => c.id === selectedThreadId) || DEFAULT_CONVERSATIONS[0];

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "customer",
      senderName: "You",
      text: inputMessage.trim(),
      timestamp: format(new Date(), "h:mm a"),
      status: "delivered",
    };

    setThreadMessages((prev) => ({
      ...prev,
      [selectedThreadId]: [...(prev[selectedThreadId] || []), newMsg],
    }));

    setInputMessage("");

    // Simulate instant dispatch acknowledgment
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: "dispatch",
        senderName: "Dispatch Operations",
        text: "Thank you for reaching out. A central dispatch specialist has reviewed your update and will verify technician scheduling shortly.",
        timestamp: format(new Date(), "h:mm a"),
      };
      setThreadMessages((prev) => ({
        ...prev,
        [selectedThreadId]: [...(prev[selectedThreadId] || []), replyMsg],
      }));
    }, 1200);
  }

  async function handleCreateNewTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !details.trim()) {
      toast.error("Please provide both a subject and details.");
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
          message: details.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create inquiry");
      toast.success("Support inquiry created! Dispatch agent assigned.");

      const newId = `conv-${Date.now()}`;
      const newThreadMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        sender: "customer",
        senderName: "You",
        text: details.trim(),
        timestamp: format(new Date(), "h:mm a"),
        status: "delivered",
      };

      setThreadMessages((prev) => ({
        ...prev,
        [newId]: [
          {
            id: `sys-${Date.now()}`,
            sender: "system",
            senderName: "System",
            text: `Support ticket submitted: ${subject.trim()}`,
            timestamp: format(new Date(), "h:mm a"),
          },
          newThreadMsg,
        ],
      }));

      setSelectedThreadId(newId);
      setShowNewModal(false);
      setSubject("");
      setDetails("");
      fetchTickets();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-orange-500" />
            Support Messenger &amp; Live Help
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time two-way messaging with TechWork central dispatch and field technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-9 px-4 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Inquiry
          </Button>

          <a
            href={`tel:${businessConfig.phone.replace(/\D/g, "")}`}
            className="rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-bold h-9 px-3.5 flex items-center gap-1.5 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-orange-500" />
            <span>24/7 Hotline</span>
          </a>
        </div>
      </div>

      {/* Intercom / Messenger 2-Column Console */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Conversations List (Intercom Sidebar) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60 flex flex-col justify-between">
          <div>
            {/* Sidebar Search & Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Active Discussions
              </span>
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                <Headphones className="h-4 w-4 text-orange-500 shrink-0" />
                <span>Miami Dispatch Office</span>
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
              {DEFAULT_CONVERSATIONS.map((conv) => {
                const isSelected = selectedThreadId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedThreadId(conv.id)}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected
                        ? "bg-white border-l-4 border-l-orange-500 shadow-xs"
                        : "hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-orange-600">
                        {conv.ticketNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">{conv.time}</span>
                    </div>

                    <h4 className="text-xs font-bold text-navy-950 line-clamp-1">
                      {conv.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {conv.preview}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {conv.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          conv.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {conv.status === "resolved" ? "Resolved" : "In Progress"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Live Office Status */}
          <div className="p-4 border-t border-slate-200 bg-white text-xs space-y-1 text-slate-500">
            <div className="flex items-center gap-1.5 font-bold text-navy-950">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dispatch Center Online</span>
            </div>
            <p className="text-[11px]">
              Avg response: under 3 minutes • 24/7 emergency monitoring
            </p>
          </div>
        </div>

        {/* Right Column: Messenger Live Chat Workspace */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          {/* Messenger Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy-950 text-white font-black flex items-center justify-center text-xs ring-2 ring-orange-500/30">
                TW
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-navy-950">
                    TechWork Central Dispatch
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Now
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {activeConversation.subject}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              {activeConversation.ticketNumber}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px] bg-slate-50/30">
            {activeMessages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[11px] font-medium">
                      {msg.text} • {msg.timestamp}
                    </span>
                  </div>
                );
              }

              const isCustomer = msg.sender === "customer";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-medium">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isCustomer
                        ? "bg-navy-950 text-white rounded-br-none"
                        : "bg-white text-navy-950 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {isCustomer && msg.status && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Delivered</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick-Prompt Recommendation Chips */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Quick prompts:</span>
            <button
              type="button"
              onClick={() => setInputMessage("Can I request an ETA update on my assigned technician?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            >
              Request ETA Update
            </button>
            <button
              type="button"
              onClick={() => setInputMessage("Please send a copy of my itemized warranty receipt.")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            >
              Email Warranty Receipt
            </button>
            <button
              type="button"
              onClick={() => setInputMessage("Need to reschedule our arrival window.")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            >
              Reschedule Window
            </button>
          </div>

          {/* Messenger Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-200 bg-white flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => toast.info("Photo attachment: Drop files directly or attach work order receipt.")}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              title="Attach photo or document"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <Input
              placeholder="Type your message to dispatch (Press Enter to send)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="h-11 rounded-xl text-xs sm:text-sm bg-slate-50 border-slate-300 focus-visible:bg-white flex-1"
            />

            <Button
              type="submit"
              disabled={!inputMessage.trim()}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold text-xs h-11 px-5 shadow-sm shrink-0"
            >
              <Send className="h-4 w-4 mr-1.5" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </div>

      {/* New Inquiry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <h3 className="font-heading text-lg font-bold text-navy-950">
                  New Support Inquiry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewTicket} className="space-y-4 text-xs">
              <div>
                <Label htmlFor="new-sub" className="text-xs font-bold text-slate-700">
                  Summary / Topic *
                </Label>
                <Input
                  id="new-sub"
                  required
                  placeholder="e.g. Inquire about compressor warranty coverage or filter sizes"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-cat" className="text-xs font-bold text-slate-700">
                    Category *
                  </Label>
                  <select
                    id="new-cat"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                  >
                    <option value="general">General Support</option>
                    <option value="warranty">Warranty &amp; Guarantee</option>
                    <option value="billing">Invoicing &amp; Billing</option>
                    <option value="rescheduling">Rescheduling</option>
                    <option value="equipment">Equipment &amp; Parts</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="new-pri" className="text-xs font-bold text-slate-700">
                    Urgency *
                  </Label>
                  <select
                    id="new-pri"
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-input border border-slate-300 bg-white px-3 py-2 text-xs font-medium"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (No AC)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="new-det" className="text-xs font-bold text-slate-700">
                  Inquiry Details *
                </Label>
                <Textarea
                  id="new-det"
                  required
                  rows={4}
                  placeholder="Describe your question or how our team can assist..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  loading={submitting}
                  className="bg-orange-500 hover:bg-orange-600 text-navy-950 font-bold"
                >
                  Submit &amp; Open Chat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
