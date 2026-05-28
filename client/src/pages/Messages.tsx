import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message, Booking, Property } from "@shared/schema";

export default function Messages() {
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ["/api/messages"] });
  const { data: bookings = [] } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  const propMap = new Map(properties.map((p) => [p.id, p]));

  // Group messages by booking
  const conversations = new Map<number, Message[]>();
  for (const m of messages) {
    const list = conversations.get(m.bookingId) ?? [];
    list.push(m);
    conversations.set(m.bookingId, list);
  }

  const conversationList = Array.from(conversations.entries())
    .map(([bookingId, msgs]) => {
      const booking = bookings.find((b) => b.id === bookingId);
      const sorted = [...msgs].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
      return { booking, messages: sorted, last: sorted[sorted.length - 1] };
    })
    .filter((c) => c.booking)
    .sort((a, b) => (b.last?.sentAt ?? "").localeCompare(a.last?.sentAt ?? ""));

  // Synthetic additional conversations from other bookings
  const extraConversations = bookings
    .filter((b) => !conversations.has(b.id))
    .map((b) => ({ booking: b, messages: [] as Message[], last: undefined as Message | undefined }));

  const allConversations = [...conversationList, ...extraConversations];

  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    if (selectedId === null && conversationList[0]?.booking?.id) {
      setSelectedId(conversationList[0].booking.id);
    }
  }, [conversationList.length, selectedId]);
  const selected = allConversations.find((c) => c.booking?.id === selectedId);
  const [draft, setDraft] = useState("");
  const { toast } = useToast();

  const send = useMutation({
    mutationFn: async () => {
      if (!selected?.booking || !draft.trim()) return;
      await apiRequest("POST", "/api/messages", {
        bookingId: selected.booking.id,
        channel: selected.booking.channel,
        direction: "out",
        body: draft,
        isAutomated: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setDraft("");
      toast({ title: "Message envoyé" });
    },
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Messagerie</h1>
          <p className="text-sm text-muted-foreground mt-1">Inbox unifiée · {allConversations.length} conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-180px)]">
        {/* Conversations list */}
        <aside className="rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-card-border">
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-1.5">
              <Search className="size-4 text-muted-foreground" />
              <input placeholder="Rechercher..." className="bg-transparent outline-none flex-1 text-sm" data-testid="input-search-conversations" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-card-border">
            {allConversations.map((c) => {
              const b = c.booking!;
              const p = propMap.get(b.propertyId);
              const isActive = selectedId === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full text-left px-3 py-3 hover-elevate ${isActive ? "bg-primary/10" : ""}`}
                  data-testid={`button-conversation-${b.id}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-9 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
                      {b.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm truncate">{b.guestName}</div>
                        <StatusBadge status={b.channel} />
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{p?.name}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {c.last ? c.last.body : "Aucun message"}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Thread */}
        <section className="rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
          {selected?.booking ? (
            <>
              <div className="border-b border-card-border px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                    {selected.booking.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium">{selected.booking.guestName}</div>
                    <div className="text-xs text-muted-foreground">{propMap.get(selected.booking.propertyId)?.name} · {selected.booking.checkIn} → {selected.booking.checkOut}</div>
                  </div>
                </div>
                <StatusBadge status={selected.booking.channel} />
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {selected.messages.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-10">Aucun message dans cette conversation</div>
                )}
                {selected.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.direction === "out" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.direction === "out" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                      {m.body}
                      <div className={`text-[10px] mt-1 ${m.direction === "out" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {m.sentAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-card-border p-3">
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setDraft("Merci pour votre message ! Nous revenons vers vous très vite.")} className="px-2.5 py-1 text-xs rounded-md bg-muted hover-elevate text-muted-foreground" data-testid="button-quickreply-1">
                    <Sparkles className="size-3 inline mr-1" />Réponse rapide
                  </button>
                  <button onClick={() => setDraft("Votre code d'accès est : " + selected.booking?.accessCode)} className="px-2.5 py-1 text-xs rounded-md bg-muted hover-elevate text-muted-foreground" data-testid="button-quickreply-2">
                    Code d'accès
                  </button>
                </div>
                <div className="flex gap-2 items-end">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Écrire un message..."
                    className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="input-message"
                  />
                  <Button onClick={() => send.mutate()} disabled={send.isPending || !draft.trim()} data-testid="button-send-message">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Sélectionner une conversation</div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
