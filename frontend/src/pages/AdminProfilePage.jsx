// AdminProfilePage — premium administrator profile page
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield, ArrowLeft, Camera, User, Mail, Phone,
  Lock, Eye, EyeOff, CheckCircle, Edit3, Save,
  X, BookOpen, Users, Activity, CalendarDays,
  Home, Settings, BarChart3, LogOut, ChevronRight, Bell, Search
} from "lucide-react";
import { ROUTES } from "../utils/constants";
import { userService } from "../services/userService";

const navItems = [
  { icon: Home, label: "Overview" },
  { icon: Users, label: "Users" },
  { icon: BookOpen, label: "Bookings" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const activityLog = [
  { action: "Deleted user account",     time: "2 minutes ago", icon: X,        color: "text-red-500   bg-red-50" },
  { action: "Updated system settings",  time: "1 hour ago",    icon: Settings, color: "text-blue-500  bg-blue-50" },
  { action: "Added new user",           time: "3 hours ago",   icon: User,     color: "text-emerald-500 bg-emerald-50" },
  { action: "Reviewed booking #BK-102", time: "Yesterday",     icon: BookOpen, color: "text-violet-500 bg-violet-50" },
  { action: "Exported user report",     time: "2 days ago",    icon: Activity, color: "text-amber-500  bg-amber-50" },
];

export default function AdminProfilePage() {
  const { auth, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("Overview");
  const [editMode, setEditMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("admin_avatar") || null);
  const fileInputRef = useRef(null);

  const displayName = auth?.fullName || auth?.email || "Admin";

  const [form, setForm] = useState({
    fullName:   auth?.fullName || "",
    email:      auth?.email    || "",
    phone:      "",
    department: "",
    bio:        "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch real user data on mount
  useEffect(() => {
    if (auth?.id) {
       userService.getUserById(auth.id)
         .then(data => {
            setForm({
              fullName: data.fullName || "",
              email: data.email || "",
              phone: data.phone || "",
              department: data.department || "",
              bio: data.bio || "",
            });
            setLoading(false);
         })
         .catch(err => {
            console.error("Failed to load profile", err);
            setLoading(false);
         });
    }
  }, [auth?.id]);

  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setAvatarUrl(url);
      localStorage.setItem("admin_avatar", url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (auth?.id) {
        await userService.updateProfile(auth.id, {
          fullName: form.fullName,
          phone: form.phone,
          department: form.department,
          bio: form.bio
        });
        setSaved(true);
        setEditMode(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        className="w-64 shrink-0 flex flex-col h-full"
        style={{ background: "linear-gradient(175deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#38bdf8,#2563eb)" }}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight leading-none">CampusReserve</p>
              <p className="text-slate-500 text-[9px] mt-1 font-bold uppercase tracking-[0.18em]">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map((item) => {
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); navigate(ROUTES.ADMIN_DASHBOARD); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5 pt-4 border-t border-white/[0.07]">
          <button
            onClick={() => navigate(ROUTES.ADMIN_PROFILE)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all group mb-1"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-violet-400 shrink-0" />
            ) : (
              <span className="h-8 w-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                {displayName[0]}
              </span>
            )}
            <div className="min-w-0 text-left">
              <p className="text-white text-xs font-bold truncate">{displayName}</p>
              <p className="text-slate-500 text-[10px]">Administrator</p>
            </div>
            <Edit3 className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
          </button>
          <button
            onClick={() => { logoutUser(); navigate(ROUTES.HOME); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-600/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <span className="text-slate-200">|</span>
            <h1 className="text-lg font-black text-slate-900">My Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                placeholder="Search…"
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition"
              />
            </div>
            <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {/* Save banner */}
          {saved && (
            <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-3 rounded-2xl animate-in fade-in duration-300">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          {loading && (
            <div className="mb-6 flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-5 py-3 rounded-2xl animate-pulse">
              <Activity className="h-4 w-4 animate-spin" />
              Fetching latest profile data...
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── LEFT ── */}
            <div className="lg:col-span-1 space-y-5">
              {/* Profile card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Cover */}
                <div
                  className="h-28 relative"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}
                  />
                </div>

                <div className="px-6 pb-6 -mt-12 relative">
                  {/* Avatar with upload */}
                  <div className="relative inline-block mb-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="h-[72px] w-[72px] rounded-2xl object-cover border-4 border-white shadow-xl"
                      />
                    ) : (
                      <div className="h-[72px] w-[72px] rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center text-3xl font-black uppercase border-4 border-white shadow-xl">
                        {displayName[0]}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload photo"
                      className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-90 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 leading-tight">{form.fullName}</h2>
                  <p className="text-slate-400 text-sm mb-3">{form.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200 text-xs font-bold">
                      <Shield className="h-3 w-3" /> ADMIN
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Account Stats</h3>
                <div className="space-y-0.5">
                  {[
                    { icon: Users,        label: "Users Managed",    value: "1,284" },
                    { icon: BookOpen,     label: "Bookings Approved", value: "347" },
                    { icon: CalendarDays, label: "Member Since",      value: "Jan 2026" },
                    { icon: Activity,     label: "Last Active",       value: "Just now" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                          <item.icon className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        {item.label}
                      </div>
                      <span className="font-black text-slate-800 text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Recent Activity</h3>
                <div className="space-y-3">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${log.color}`}>
                        <log.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700 leading-snug">{log.action}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Card header */}
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Update your profile details</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-200"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: "fullName",   label: "Full Name",  icon: User,  type: "text" },
                      { id: "email",      label: "Email",      icon: Mail,  type: "email" },
                      { id: "phone",      label: "Phone",      icon: Phone, type: "text" },
                      { id: "department", label: "Department", icon: Shield,type: "text" },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type={field.type}
                            value={form[field.id]}
                            onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                            disabled={!editMode}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              editMode
                                ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                                : "border-slate-100 bg-slate-50 text-slate-600 cursor-default"
                            }`}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                      <textarea
                        rows={3}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          editMode
                            ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                            : "border-slate-100 bg-slate-50 text-slate-600 cursor-default"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Lock className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Change Password</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Keep your account secure</p>
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  {[
                    { id: "current", label: "Current Password" },
                    { id: "newPass", label: "New Password" },
                    { id: "confirm", label: "Confirm Password" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                        {f.label}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showPass ? "text" : "password"}
                          value={passForm[f.id]}
                          onChange={(e) => setPassForm({ ...passForm, [f.id]: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                        />
                        {f.id === "current" && (
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
