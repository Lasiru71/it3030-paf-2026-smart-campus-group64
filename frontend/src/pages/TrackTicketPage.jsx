import React, { useState, useEffect } from "react";
import { 
    Search, AlertCircle, Clock, Wrench, CheckCircle, 
    ArrowRight, Shield, Calendar, MapPin, Tag, X,
    MessageSquare, Send, User, MessageCircle
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

const TrackTicketPage = () => {
    const { auth, isTechnician } = useAuth();
    const [ticketId, setTicketId] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!ticketId.trim()) return;

        setLoading(true);
        setError("");
        setTicket(null);

        try {
            const res = await axiosInstance.get(`/api/incidents/${ticketId}`);
            setTicket(res.data);
        } catch (err) {
            console.error("Search failed", err);
            setError(err.response?.status === 404 ? "Ticket not found. Please check the ID." : "An error occurred while fetching the ticket.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !ticket) return;

        setSending(true);
        try {
            const comment = {
                authorId: auth?.id || "anonymous",
                authorName: auth?.fullName || auth?.email || "Student",
                text: newComment,
                timestamp: new Date().toISOString()
            };
            const res = await axiosInstance.post(`/api/incidents/${ticket.id}/comments`, comment);
            setTicket(res.data);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setSending(false);
        }
    };

    const steps = [
        { label: "Submitted", status: "OPEN", icon: AlertCircle },
        { label: "Assigned", status: "IN_PROGRESS", icon: Wrench },
        { label: "Ongoing", status: "ONGOING", icon: Clock },
        { label: "Resolved", status: "RESOLVED", icon: CheckCircle },
        { label: "Completed", status: "CLOSED", icon: Shield },
    ];

    const getStatusIndex = (status) => {
        if (status === "REJECTED") return -1;
        const currentIdx = steps.findIndex(s => s.status === status);
        return currentIdx;
    };

    const currentStepIdx = ticket ? getStatusIndex(ticket.status) : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header section */}
            <div className="max-w-3xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6">
                    <Search className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Track your <span className="text-blue-600">Ticket</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                    {isTechnician 
                      ? "As a staff member, your assigned cases are waitng in your dedicated console."
                      : "Enter your unique ticket ID below to see the real-time status and progress of your maintenance request."
                    }
                </p>
            </div>

            {/* Role-Specific Action Section */}
            {isTechnician ? (
               <div className="max-w-2xl w-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden group">
                     {/* Decorative background */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
                     
                     <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600 border border-blue-100 shadow-inner">
                        <Shield className="h-10 w-10" />
                     </div>
                     <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Staff Workspace Identified</h2>
                     <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-10 px-6">
                        Staff members do not need to track tickets manually. Your assignments are ready in your console.
                     </p>
                     <button 
                        onClick={() => navigate(ROUTES.STAFF_DASHBOARD)} 
                        className="inline-flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95"
                     >
                        Enter Staff Dashboard <ArrowRight className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            ) : (
                /* Search Bar section for Students/Guests */
                <div className="max-w-2xl w-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <form onSubmit={handleSearch} className="group relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-2xl opacity-10 group-focus-within:opacity-20 transition-opacity" />
                        <div className="relative flex items-center bg-white rounded-[2rem] p-2 shadow-2xl shadow-slate-200/50 border border-slate-100 ring-4 ring-transparent group-focus-within:ring-blue-50 transition-all">
                            <div className="pl-6 pr-3 text-slate-400">
                                <Tag className="h-6 w-6" />
                            </div>
                            <input
                                type="text"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                placeholder="Paste your Ticket ID here (e.g., 69e2a...)"
                                className="flex-1 bg-transparent border-none text-lg font-bold text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-300 py-4"
                            />
                            <button
                                type="submit"
                                disabled={loading || !ticketId.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading ? "Searching..." : (
                                    <>
                                        Track <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <p className="mt-4 text-center text-red-500 font-bold animate-in shake duration-300">
                            {error}
                        </p>
                    )}
                </div>
            )}

            {/* Result Section */}
            {ticket && (
                <div className="max-w-5xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
                    {/* Status Tracker Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        {ticket.status === "REJECTED" ? (
                            <div className="text-center py-6">
                                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <X className="h-10 w-10 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-widest">Ticket Rejected</h2>
                                <p className="text-slate-500 font-medium max-w-md mx-auto">
                                    This request was marked as invalid or not applicable.
                                </p>
                                <div className="mt-8 bg-red-50 border border-red-100 p-6 rounded-3xl text-left">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Reason for Rejection</p>
                                    <p className="text-red-700 font-bold leading-relaxed italic">
                                        "{ticket.rejectionReason || "No specific reason provided."}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl font-black text-slate-900">Current Status</h2>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-600 shadow-sm`}>
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                </div>

                                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-2 px-4 pb-4">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden sm:block rounded-full" />
                                    <div 
                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 hidden sm:block rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                        style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                                    />

                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIdx;
                                        const isActive = idx === currentStepIdx;
                                        return (
                                            <div key={idx} className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-3 group">
                                                <div className={`
                                                    h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl
                                                    ${isCompleted ? "bg-blue-600 text-white scale-110" : "bg-white text-slate-300 border-2 border-slate-100"}
                                                    ${isActive ? "ring-8 ring-blue-50 animate-pulse" : ""}
                                                `}>
                                                    <step.icon className={`h-6 w-6 ${isCompleted ? "animate-in zoom-in-50" : ""}`} />
                                                </div>
                                                <div className="text-left sm:text-center">
                                                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isCompleted ? "text-blue-600" : "text-slate-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCompleted && !isActive && <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">Completed</p>}
                                                    {isActive && <p className="text-[9px] font-bold text-blue-400 uppercase mt-0.5 animate-bounce">Ongoing</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Issue Details (Left Column) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-full">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-blue-500" /> Case Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                               <MapPin className="h-3 w-3" /> Location
                                            </p>
                                            <p className="font-black text-slate-800 uppercase">{ticket.resource}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                               <Tag className="h-3 w-3" /> Category
                                            </p>
                                            <p className="font-bold text-slate-700">{ticket.category}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                         <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                               <Shield className="h-3 w-3" /> Priority Level
                                            </p>
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                ticket.priority === 'URGENT' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                               <Calendar className="h-3 w-3" /> Reported On
                                            </p>
                                            <p className="font-bold text-slate-700">{new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pb-8 border-b border-slate-50 mb-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Report</p>
                                    <div className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-[2rem] italic border border-slate-100 flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                            <MessageCircle className="h-5 w-5 text-blue-400" />
                                        </div>
                                        "{ticket.description}"
                                    </div>
                                </div>

                                {ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-4">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" /> Final Resolution Action
                                        </p>
                                        <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 text-emerald-900 font-bold text-sm italic shadow-sm">
                                            "{ticket.resolutionNotes || "The issue has been successfully addressed by our team."}"
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100 text-center">
                                        <Clock className="h-10 w-10 text-blue-300 mx-auto mb-4" />
                                        <h4 className="text-lg font-black text-blue-900 leading-none mb-2">Technician is Working</h4>
                                        <p className="text-xs text-blue-800/60 font-medium max-w-xs mx-auto">
                                            Our staff is currently processing your request. Most issues are typically resolved within 2 business days.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Communication (Right Column) */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full min-h-[500px]">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-500" /> Conversation History
                                </h3>

                                <div className="flex-1 space-y-6 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                                    {ticket.comments && ticket.comments.length > 0 ? ticket.comments.map((comment, i) => (
                                        <div key={i} className={`flex flex-col ${comment.authorId === (auth?.id || "anonymous") ? "items-end" : "items-start"}`}>
                                            <div className={`max-w-[90%] p-4 rounded-3xl text-xs font-semibold leading-relaxed shadow-sm ${
                                                comment.authorId === (auth?.id || "anonymous") ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
                                            }`}>
                                                {comment.text}
                                            </div>
                                            <span className="mt-1.5 px-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                {comment.authorName} • {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
                                            <MessageCircle className="h-12 w-12 text-slate-300 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No history yet</p>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleAddComment} className="mt-auto relative">
                                    <input 
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Send a message to staff..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={sending || !newComment.trim()}
                                        className="absolute right-2 top-2 h-9 w-9 bg-blue-600 rounded-xl text-white flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Technician Badge */}
                            <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl text-white flex items-center gap-4 overflow-hidden relative">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <Wrench className="h-24 w-24 transform rotate-12" />
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                    <User className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="overflow-hidden">
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Assigned Support</p>
                                     <p className="font-black text-sm truncate">{ticket.technicianName || "Pending Assignee"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackTicketPage;
