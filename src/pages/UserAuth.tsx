import { AlertCircle, Building2, Eye, EyeOff, Lock, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearUserLoginAction, clearUserRegisterAction, userLoginAction, userRegisterAction } from "@/store/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const UserAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const login = useAppSelector((state) => state.userLoginReducer);
  const register = useAppSelector((state) => state.userRegisterReducer);
  const active = mode === "login" ? login : register;

  useEffect(() => {
    if (!active.successData) return;
    const { user, token } = active.successData.data;
    localStorage.setItem("user_token", token);
    localStorage.setItem("user_phone", user.phone);
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("user_role", "user");
    dispatch(clearUserLoginAction());
    dispatch(clearUserRegisterAction());
    navigate("/");
  }, [active.successData, dispatch, navigate]);

  useEffect(() => {
    if (active.error) setError(active.errorInfo || "Please try again.");
  }, [active.error, active.errorInfo]);

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError("");
    dispatch(clearUserLoginAction());
    dispatch(clearUserRegisterAction());
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!phone.trim()) return setError("Phone number is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup") {
      dispatch(userRegisterAction({ phone: phone.trim(), password, location: location.trim() || undefined }));
    } else {
      dispatch(userLoginAction({ phone: phone.trim(), password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "hsl(40,33%,98%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl shadow-lg mb-5" style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}><Building2 className="h-8 w-8 text-white" /></div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(152,55%,32%)" }}>DreamHome Realty</p>
          <h1 className="font-display text-3xl font-bold text-foreground mt-1">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground mt-2">{mode === "login" ? "Sign in to continue" : "Register with your phone number"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background shadow-lg p-6">
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1 mb-6">
            {(["login", "signup"] as const).map((item) => <button key={item} type="button" onClick={() => switchMode(item)} className={`rounded-lg py-2 text-sm font-semibold transition ${mode === item ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}>{item === "login" ? "Sign in" : "Sign up"}</button>)}
          </div>
          {error && <div className="flex gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number<span className="relative block mt-2"><Phone className="absolute left-3 top-3.5 w-4 h-4 text-primary" /><input type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full rounded-xl border border-border pl-10 pr-4 py-3 text-sm" /></span></label>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Password<span className="relative block mt-2"><Lock className="absolute left-3 top-3.5 w-4 h-4 text-primary" /><input type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" className="w-full rounded-xl border border-border pl-10 pr-11 py-3 text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>
            {mode === "signup" && <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Location <span className="normal-case font-normal">(optional)</span><span className="relative block mt-2"><MapPin className="absolute left-3 top-3.5 w-4 h-4 text-primary" /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Hyderabad, Telangana" className="w-full rounded-xl border border-border pl-10 pr-4 py-3 text-sm" /></span></label>}
            <button disabled={active.loading} className="w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60" style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}>{active.loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
