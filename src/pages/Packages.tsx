import { CheckCircle, ExternalLink, Loader2, Lock, Star, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/+$/, "");

interface Package {
  id: string;
  name: string;
  description: string;
  stars: number;
  total_seats: number;
  available_seats: number;
  sort_order: number;
}

interface UserTicket {
  id: string;
  ticket_number: string;
  package_name: string;
  stars: number;
  issued_at: string;
  seat_number?: number;
}

const STAR_COLORS = [
  "hsl(152,55%,32%)",
  "hsl(210,80%,45%)",
  "hsl(270,60%,50%)",
  "hsl(30,90%,45%)",
];

const Packages = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const isLoggedIn = !!userToken;
  const isAdmin = !!localStorage.getItem("token");

  const [packages, setPackages] = useState<Package[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);
  const [pkgError, setPkgError] = useState("");

  const [selected, setSelected] = useState<Package | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [deepLink, setDeepLink] = useState<{ link: string; orderId: string } | null>(null);

  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // fetch packages
  useEffect(() => {
    fetch(`${BASE}/packages`)
      .then(r => r.json())
      .then(res => { if (res.success) setPackages(res.data || []); else setPkgError("Failed to load packages"); })
      .catch(() => setPkgError("Failed to load packages"))
      .finally(() => setPkgLoading(false));
  }, []);

  // fetch user tickets if logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    setTicketsLoading(true);
    fetch(`${BASE}/user-auth/tickets`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then(r => r.json())
      .then(res => { if (res.success) setTickets(res.data || []); })
      .catch(() => {})
      .finally(() => setTicketsLoading(false));
  }, [isLoggedIn, userToken]);

  const handleBuy = async () => {
    if (!selected) return;
    if (!isLoggedIn) { navigate("/user-login"); return; }
    setOrdering(true);
    setOrderError("");
    setDeepLink(null);
    try {
      const res = await fetch(`${BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ package_id: selected.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");
      setDeepLink({ link: data.data.deep_link, orderId: data.data.order.order_id });
    } catch (err: unknown) {
      setOrderError((err as Error).message);
    } finally {
      setOrdering(false);
    }
  };

  const openTelegram = () => {
    if (deepLink) window.open(deepLink.link, "_blank");
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "hsl(40,33%,98%)" }}>
      <div className="max-w-3xl mx-auto space-y-12">

        {/* ── Header ── */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "hsl(152,55%,32%)" }}>
            Exclusive Access
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Property Packages</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Select a plan, pay with Telegram Stars, and get instant access to exclusive property listings.
          </p>
          <div className="h-1 w-16 rounded-full mx-auto mt-4" style={{ background: "linear-gradient(90deg, hsl(152,55%,32%), hsl(145,47%,45%))" }} />
        </div>

        {/* Admin shortcut */}
        {isAdmin && (
          <Link
            to="/admin/tickets"
            className="flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ borderColor: "hsl(152,55%,32%,0.3)", background: "hsl(152,55%,32%,0.05)", color: "hsl(152,55%,32%)" }}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              View All Ticket Bookings (Admin)
            </span>
            <span className="text-xs opacity-60">→</span>
          </Link>
        )}

        {/* ── Error ── */}
        {pkgError && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 text-center">{pkgError}</div>
        )}

        {/* ── Loading ── */}
        {pkgLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(152,55%,32%)" }} />
          </div>
        )}

        {/* ── Step 1: Select Plan ── */}
        {!pkgLoading && packages.length > 0 && !deepLink && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center text-muted-foreground">
              Step 1 — Choose your plan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg, idx) => {
                const soldOut = pkg.available_seats <= 0;
                const isSelected = selected?.id === pkg.id;
                const color = STAR_COLORS[idx % STAR_COLORS.length];
                return (
                  <button
                    key={pkg.id}
                    disabled={soldOut}
                    onClick={() => { if (!soldOut) { setSelected(pkg); setOrderError(""); } }}
                    className="text-left rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: isSelected ? color : "hsl(152,55%,32%,0.15)",
                      background: isSelected ? `${color}0d` : "white",
                      boxShadow: isSelected ? `0 0 0 3px ${color}22` : undefined,
                    }}
                  >
                    {/* Stars row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(pkg.stars / 10, 4) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5" style={{ color }} />}
                      {soldOut && <span className="text-[10px] font-bold text-red-500 uppercase">Sold Out</span>}
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">{pkg.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold" style={{ color }}>⭐ {pkg.stars}</span>
                      <span className="text-[10px] text-muted-foreground">{pkg.available_seats}/{pkg.total_seats} seats left</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 2: Confirm & Go to Telegram */}
            {selected && (
              <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: "hsl(152,55%,32%,0.2)", background: "hsl(152,55%,32%,0.04)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">
                  Step 2 — Confirm & Pay
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.description}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: "hsl(152,55%,32%)" }}>⭐ {selected.stars}</p>
                </div>

                {orderError && (
                  <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2">{orderError}</div>
                )}

                {!isLoggedIn ? (
                  <button
                    onClick={() => navigate("/user-login")}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
                  >
                    <Lock className="w-4 h-4" /> Sign in to Continue
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={ordering}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #229ED9, #1a7fb5)" }}
                  >
                    {ordering ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Creating order…</>
                    ) : (
                      <>⭐ Proceed to Telegram Payment</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Open Telegram ── */}
        {deepLink && (
          <div className="rounded-2xl border-2 p-6 text-center" style={{ borderColor: "hsl(152,55%,32%,0.3)", background: "hsl(152,55%,32%,0.05)" }}>
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-bold text-foreground text-lg mb-1">Order Created!</p>
            <p className="text-xs text-muted-foreground mb-1">Order ID: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{deepLink.orderId}</code></p>
            <p className="text-sm text-muted-foreground mb-5 mt-3">
              Click below to open Telegram. The bot will send you a payment invoice — pay with Stars to get your ticket instantly.
            </p>
            <button
              onClick={openTelegram}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #229ED9, #1a7fb5)" }}
            >
              <ExternalLink className="w-4 h-4" />
              Open Telegram & Pay ⭐ {selected?.stars}
            </button>
            <p className="text-[10px] text-muted-foreground mt-4">
              After payment, your ticket will appear below automatically. Refresh this page to see it.
            </p>
            <button
              onClick={() => { setDeepLink(null); setSelected(null); }}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground underline"
            >
              ← Choose a different plan
            </button>
          </div>
        )}

        {/* ── My Tickets ── */}
        {isLoggedIn && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-4 h-4" style={{ color: "hsl(152,55%,32%)" }} />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(152,55%,32%)" }}>
                My Tickets
              </p>
            </div>

            {ticketsLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!ticketsLoading && tickets.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-10 text-center">
                <p className="text-3xl mb-2">🎫</p>
                <p className="text-sm font-semibold text-foreground">No tickets yet</p>
                <p className="text-xs text-muted-foreground mt-1">Purchase a package above to get your first ticket.</p>
              </div>
            )}

            {!ticketsLoading && tickets.length > 0 && (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl border bg-background p-4 flex items-center justify-between shadow-sm"
                    style={{ borderColor: "hsl(152,55%,32%,0.15)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
                      >
                        🎫
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{t.ticket_number}</p>
                        <p className="text-xs text-muted-foreground">{t.package_name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(t.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: "hsl(152,55%,32%)" }}>⭐ {t.stars}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-200">
                        <CheckCircle className="w-2.5 h-2.5" /> Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-10 text-center">
            <p className="text-3xl mb-2">🔒</p>
            <p className="text-sm font-semibold text-foreground">Sign in to view your tickets</p>
            <button
              onClick={() => navigate("/user-login")}
              className="mt-3 text-xs font-bold underline"
              style={{ color: "hsl(152,55%,32%)" }}
            >
              Sign in →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Packages;
