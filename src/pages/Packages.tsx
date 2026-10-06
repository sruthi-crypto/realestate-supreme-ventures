// import { CheckCircle, Loader2, Lock, Ticket } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const BASE = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/+$/, "");
// const CF_BOT_USERNAME = ((import.meta.env.VITE_CF_BOT_USERNAME as string) || "supremv_bot")
//   .trim()
//   .replace(/^@+/, "");

// interface CfTicket {
//   id: string;
//   ticket_number: string;
//   ticket_type: string;
//   customer_phone?: string | null;
//   amount_paise: number;
//   issued_at: string;
//   status: string;
// }

// const Packages = () => {
//   const navigate = useNavigate();
//   const userToken = localStorage.getItem("user_token");
//   const isLoggedIn = !!userToken;
//   const isAdmin = !!localStorage.getItem("token");

//   const [cfTickets, setCfTickets] = useState<CfTicket[]>([]);
//   const [cfTicketsLoading, setCfTicketsLoading] = useState(false);

//   useEffect(() => {
//     if (!isLoggedIn) return;
//     let active = true;
//     const loadCfTickets = (showLoading = false) => {
//       if (showLoading) setCfTicketsLoading(true);
//       fetch(`${BASE}/user-auth/cf-tickets`, { headers: { Authorization: `Bearer ${userToken}` } })
//         .then(r => r.json())
//         .then(res => { if (active && res.success) setCfTickets(res.data || []); })
//         .catch(() => { })
//         .finally(() => { if (active && showLoading) setCfTicketsLoading(false); });
//     };
//     loadCfTickets(true);
//     const refreshId = window.setInterval(() => loadCfTickets(), 10_000);
//     return () => {
//       active = false;
//       window.clearInterval(refreshId);
//     };
//   }, [isLoggedIn, userToken]);

//   const getUserId = () => {
//     try {
//       if (!userToken) return "";
//       const payload = JSON.parse(atob(userToken.split(".")[1]));
//       return payload.id || "";
//     } catch { return ""; }
//   };

//   const openCfBot = () => {
//     const userId = getUserId();
//     const link = `https://t.me/${CF_BOT_USERNAME}${userId ? `?start=${userId}` : ""}`;
//     window.open(link, "_blank");
//   };

//   return (
//     <div className="min-h-screen py-12 px-4" style={{ background: "hsl(40,33%,98%)" }}>
//       {/* Floating CF Telegram Bot Button */}
//       <button
//         onClick={openCfBot}
//         aria-label="Book ticket via Telegram"
//         className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center group"
//         style={{ background: "linear-gradient(135deg, #229ED9, #1a7fb5)" }}
//       >
//         ...
//       </button>
//       <div className="max-w-3xl mx-auto space-y-12">
//         ...full ticket booking UI...
//       </div>
//     </div>
//   );
// };

// export default Packages;

const Packages = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <p className="text-4xl">🚧</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Coming Soon</h1>
        <p className="text-sm text-muted-foreground">Ticket booking is currently unavailable.</p>
      </div>
    </div>
  );
};

export default Packages;
