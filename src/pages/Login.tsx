import { Button } from "@/components/ui/button";
import { clearLoginAction, loginAction } from "@/store/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Building2, Mail, KeyRound, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");

  const {
    loading: loginLoading,
    error: loginError,
    successData: loginSuccessData,
    errorInfo: loginErrorInfo,
  } = useAppSelector((state) => state.loginReducer);

  useEffect(() => {
    if (loginSuccessData) {
      const loginData = loginSuccessData?.data;
      const userData = loginSuccessData?.data?.user;
      const role = userData?.role;

      localStorage.setItem("token", loginData?.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userData?.id);
      localStorage.setItem("name", userData?.username);
      localStorage.setItem("email", userData?.email);
      localStorage.setItem("twoFactorEnabled", String(userData?.twoFactorEnabled));

      navigate("/admin");
      dispatch(clearLoginAction());
    }
  }, [loginSuccessData, dispatch, navigate]);

  useEffect(() => {
    if (loginError) {
      setError(loginErrorInfo || "An error occurred. Please try again.");
    }
  }, [loginError, loginErrorInfo]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email && token) {
      dispatch(loginAction({ email, token }));
    } else {
      setError("Please enter both email and token.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "hsl(40,33%,98%)" }}
    >
      {/* Background blobs — match the hero/dashboard palette */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(152,55%,42%), transparent 70%)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(145,47%,55%), transparent 70%)", transform: "translate(-30%, 30%)" }}
      />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(152,55%,20%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* Brand mark */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-flex mb-5">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-2xl blur-md opacity-40"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            />
            <div
              className="relative p-4 rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>

          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "hsl(152,55%,32%)" }}
          >
            Property Management
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Login
          </h1>
          <div
            className="h-1 w-12 rounded-full mx-auto mt-2"
            style={{ background: "linear-gradient(90deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          />
          <p className="text-sm text-muted-foreground mt-3">
            Sign in to manage your properties
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-border bg-background shadow-lg p-6 animate-scale-in space-y-5"
          style={{ animationDelay: "0.15s" }}
        >
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 p-3 rounded-xl border animate-slide-up"
              style={{ background: "hsl(0,85%,97%)", borderColor: "hsl(0,72%,88%)" }}
            >
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 font-medium leading-snug">{error}</p>
            </div>
          )}

          {/* Email field */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Email / Phone
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(152,55%,32%,0.1)" }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200"
                style={{
                  boxShadow: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(152,55%,32%)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px hsl(152,55%,32%,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Token field */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.25s" }}
          >
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Token
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(152,55%,32%,0.1)" }}
              >
                <KeyRound className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
              </div>
              <input
                type={showToken ? "text" : "password"}
                required
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background pl-11 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(152,55%,32%)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px hsl(152,55%,32%,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowToken(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2 animate-fade-in"
            style={{
              background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))",
              animationDelay: "0.3s",
            }}
          >
            {loginLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;