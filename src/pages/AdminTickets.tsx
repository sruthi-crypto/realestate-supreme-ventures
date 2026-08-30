import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Lock, RefreshCw, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/+$/, "");

interface TicketRow {
  id: string;
  ticket_number: string;
  stars: number;
  issued_at: string;
  seat_number?: number;
  order_id: string;
  user_id: string;
  package_id: string;
  package_name?: string;
  user_phone?: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const AdminTickets = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("token");
  const isAdminLoggedIn = !!adminToken;

  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(isAdminLoggedIn);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    if (!adminToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/tickets`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");
      setTickets(data.data || []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdminLoggedIn) fetchTickets(); }, []);

  return (
    <div className="min-h-screen py-8" style={{ background: "hsl(40,33%,98%)" }}>
      <div className="container max-w-6xl mx-auto px-4">

        {/* ── Not logged in gate ── */}
        {!isAdminLoggedIn && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "hsl(152,55%,32%,0.1)" }}>
              <Lock className="w-8 h-8" style={{ color: "hsl(152,55%,32%)" }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "hsl(152,55%,32%)" }}>Admin Access Required</p>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Ticket Bookings</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              You need to be logged in as an admin to view ticket bookings.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              Login as Admin
            </button>
          </div>
        )}

        {/* ── Authenticated view ── */}
        {isAdminLoggedIn && (
          <>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "hsl(152,55%,32%)" }}>
              Telegram Stars
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Ticket Bookings</h1>
            <div className="h-1 w-16 rounded-full mt-2" style={{ background: "linear-gradient(90deg, hsl(152,55%,32%), hsl(145,47%,45%))" }} />
          </div>
          <button
            onClick={fetchTickets}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:-translate-y-0.5"
            style={{ borderColor: "hsl(152,55%,32%)", color: "hsl(152,55%,32%)" }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total Tickets", value: tickets.length },
            { label: "Total Stars Earned", value: `⭐ ${tickets.reduce((s, t) => s + t.stars, 0)}` },
            { label: "Unique Packages", value: new Set(tickets.map(t => t.package_id)).size },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center border" style={{ background: "white", borderColor: "hsl(152,55%,32%,0.15)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
              <p className="font-display text-2xl font-bold" style={{ color: "hsl(152,55%,32%)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(152,55%,32%)" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && tickets.length === 0 && !error && (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-muted/30">
            <div className="text-5xl mb-4">🎫</div>
            <p className="font-display text-xl font-bold text-foreground mb-1">No tickets yet</p>
            <p className="text-sm text-muted-foreground">Tickets will appear here after users complete Telegram Stars payments.</p>
          </div>
        )}

        {/* Table */}
        {!loading && tickets.length > 0 && (
          <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "hsl(152,55%,32%,0.15)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "hsl(152,55%,32%,0.07)", borderBottom: "1px solid hsl(152,55%,32%,0.15)" }}>
                    {["#", "Ticket No.", "Package", "Stars", "User Phone", "Seat", "Date"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, idx) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      style={{ borderColor: "hsl(152,55%,32%,0.08)" }}
                    >
                      <td className="px-4 py-3 text-muted-foreground text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(152,55%,32%)" }} />
                          <code className="text-xs font-mono font-bold text-foreground">{t.ticket_number}</code>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-foreground">{t.package_name || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold" style={{ color: "hsl(152,55%,32%)" }}>⭐ {t.stars}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.user_phone || t.user_id?.slice(0, 8) + "…"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.seat_number ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.issued_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground" style={{ borderTop: "1px solid hsl(152,55%,32%,0.1)", background: "hsl(152,55%,32%,0.03)" }}>
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              All tickets are confirmed payments via Telegram Stars
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
