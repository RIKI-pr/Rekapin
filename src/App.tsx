import React, { useState, useMemo, useRef, useEffect } from "react";

import {
  Wallet,
  Plus,
  Bell,
  ChevronLeft,
  PieChart as PieChartIcon,
  Home,
  ListTodo,
  User,
  Building2,
  Smartphone,
  Banknote,
  Briefcase,
  Coffee,
  ShoppingBag,
  Car,
  Film,
  Wifi,
  Activity,
  Check,
  Clock,
  ChevronRight,
  Settings,
  ShieldCheck,
  Lock,
  LogOut,
  Target,
  Calendar as CalendarIcon,
  AlertCircle,
  FileText,
  TrendingUp,
  TrendingDown,
  Archive,
  X,
  CreditCard,
  MapPin,
  AlignLeft,
  ChevronDown,
  Users,
  MessageCircle,
  Send,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  UserPlus,
  UserMinus,
  Zap,
  BarChart3 as BarChartIcon,
  AlertTriangle,
  Receipt,
  Filter,
  Map,
  Hash,
  Tag,
  CheckCircle,
  CircleDashed,
  RefreshCw,
  Info,
  CalendarClock,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  SlidersHorizontal,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ==========================================
// 1. UTILS & DATA HELPERS
// ==========================================
const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getPercentage = (part: number, total: number) => {
  if (!total || total === 0) return 0;
  return Math.min(Math.round((part / total) * 100), 100);
};
const getMemberNameSafe = (team: any, id: string, defaultName = "Anggota") => {
  if (id === "shared" || id === "all") return "Keluarga";
  if (!team || !team.members) return defaultName;

  const member = team.members.find((m: any) => m.id === id);
  return member ? member.name : defaultName;
};
const getDaysDiff = (dateString: string) => {
  const targetDate = new Date(dateString);

  const today = new Date("2026-05-04");

  const diffTime = Math.abs(targetDate.getTime() - today.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
// ==========================================
// 2. INITIAL DUMMY DATA
// ==========================================
const INITIAL_DATA = {
  user: {
    id: "u1",
    name: "Riki",
    email: "riki@example.com",
    job: "Product Designer",
    tier: "Pro Member",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  team: {
    id: "tm1",
    name: "Keluarga Bahagia",
    members: [
      {
        id: "u1",
        name: "Riki",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      },
      {
        id: "u2",
        name: "Siska",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      },
    ],
  },
  pockets: [
    {
      id: "p1",
      owner: "u1",
      name: "SeaBank Riki",
      type: "Tabungan Pribadi",
      accountNo: "**** 9921",
      balance: 12500000,
      status: "Aman",
      color: "text-blue-500",
      bg: "bg-blue-50",
      icon: "building",
      syncStatus: "Real-time",
    },
    {
      id: "p2",
      owner: "u2",
      name: "BCA Siska",
      type: "Gaji & Operasional",
      accountNo: "**** 8842",
      balance: 8500000,
      status: "Aktif",
      color: "text-purple-500",
      bg: "bg-purple-50",
      icon: "building",
      syncStatus: "Real-time",
    },
    {
      id: "p3",
      owner: "shared",
      name: "Rekening Bersama",
      type: "Dana Darurat & KPR",
      accountNo: "**** 1109",
      balance: 52000000,
      status: "Bertumbuh",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      icon: "wallet",
      syncStatus: "Terjadwal",
    },
  ],
  transactions: [
    {
      id: "t1",
      owner: "u2",
      ref: "TRX-091B",
      title: "Kopi Kenangan Mantan",
      amount: 65000,
      type: "expense",
      date: "2026-05-04T15:00:00",
      time: "15:00",
      category: "Konsumsi",
      method: "ShopeePay",
      pocket: "BCA Siska",
      icon: "coffee",
      isToday: true,
      dateInt: 4,
      isActivity: true,
      location: "Senayan City",
      comments: [
        { sender: "u1", text: "Wah ngopi terus nih..", time: "15:10" },
      ],
    },
    {
      id: "t2",
      owner: "u1",
      ref: "TRX-092C",
      title: "Makan Siang Padang",
      amount: 45000,
      type: "expense",
      date: "2026-05-04T12:30:00",
      time: "12:30",
      category: "Konsumsi",
      method: "GoPay",
      pocket: "SeaBank Riki",
      icon: "coffee",
      isToday: true,
      dateInt: 4,
      isActivity: true,
      location: "RM. Sederhana Slipi",
      comments: [],
    },
    {
      id: "t3",
      owner: "u2",
      ref: "TRX-093D",
      title: "Belanja Superindo",
      amount: 1850000,
      type: "expense",
      date: "2026-05-04T10:30:00",
      time: "10:30",
      category: "Belanja",
      method: "Debit Card",
      pocket: "Rekening Bersama",
      icon: "shopping-bag",
      isToday: true,
      dateInt: 4,
      isActivity: true,
      location: "Superindo Tanjung Duren",
      comments: [
        {
          sender: "u1",
          text: "Struknya jangan lupa difoto ya.",
          time: "10:35",
        },
        {
          sender: "u2",
          text: "Sudah aku foto dan upload di folder ya.",
          time: "10:40",
        },
        {
          sender: "u1",
          text: "Sip, makasih banyak. Ada diskon ngga tadi?",
          time: "10:42",
        },
        {
          sender: "u2",
          text: "Ada diskon 10% untuk buah-buahan.",
          time: "10:45",
        },
      ],
    },
    {
      id: "t4",
      owner: "u1",
      ref: "INC-011A",
      title: "Gaji Freelance UI/UX",
      amount: 8500000,
      type: "income",
      date: "2026-05-04T09:00:00",
      time: "09:00",
      category: "Pekerjaan",
      method: "Transfer Bank",
      pocket: "SeaBank Riki",
      icon: "briefcase",
      isToday: true,
      dateInt: 4,
      isActivity: false,
      comments: [],
    },
    {
      id: "t5",
      owner: "shared",
      ref: "TRX-094E",
      title: "Nonton Bioskop Premiere",
      amount: 250000,
      type: "expense",
      date: "2026-05-03T19:30:00",
      time: "19:30",
      category: "Hiburan",
      method: "Credit Card",
      pocket: "Rekening Bersama",
      icon: "film",
      isToday: false,
      dateInt: 3,
      isActivity: true,
      location: "CGV Central Park",
      comments: [],
    },
  ],
  activities: [
    {
      id: "a1",
      owner: "u1",
      title: "Meeting Klien UI/UX",
      date: "2026-05-04T10:00:00",
      timeStart: "10:00",
      timeEnd: "11:30",
      location: "Google Meet",
      type: "Kerja",
      desc: "Membahas revisi desain aplikasi mobile.",
      color: "bg-blue-500",
      dateInt: 4,
      comments: [],
    },
    {
      id: "a2",
      owner: "u2",
      title: "Kelas Yoga",
      date: "2026-05-04T07:00:00",
      timeStart: "07:00",
      timeEnd: "08:30",
      location: "Studio Sehat Senopati",
      type: "Olahraga",
      desc: "Kelas pagi bersama instruktur.",
      color: "bg-emerald-500",
      dateInt: 4,
      comments: [],
    },
  ],
  tasks: [
    {
      id: "tk1",
      owner: "shared",
      title: "Bayar Cicilan KPR",
      date: "2026-05-10T00:00:00",
      time: "09:00",
      status: "belum",
      priority: "Tinggi",
      category: "Keuangan",
      isToday: false,
      desc: "Batas waktu pembayaran cicilan rumah bulan ini.",
      dateInt: 10,
      comments: [],
    },
    {
      id: "tk2",
      owner: "shared",
      title: "Bayar Tagihan Listrik",
      date: "2026-05-04T12:00:00",
      time: "12:00",
      status: "belum",
      priority: "Tinggi",
      category: "Keuangan",
      isToday: true,
      desc: "Batas akhir pembayaran listrik rumah, jangan telat!",
      dateInt: 4,
      comments: [],
    },
    {
      id: "tk3",
      owner: "u1",
      title: "Beli Kopi & Camilan Sore",
      date: "2026-05-04T15:00:00",
      time: "15:00",
      status: "belum",
      priority: "Sedang",
      category: "Belanja",
      isToday: true,
      desc: "Beli kopi arabika dan roti bakar untuk camilan sore keluarga.",
      dateInt: 4,
      comments: [],
    },
  ],
  budgets: [
    {
      id: "b1",
      owner: "shared",
      name: "Belanja Dapur & Rumah",
      category: "Belanja",
      limit: 3000000,
      period: "Siklus Bulanan",
      color: "text-orange-500",
      bg: "bg-orange-50",
      icon: "shopping-bag",
      resetDays: 26,
    },
    {
      id: "b2",
      owner: "u1",
      name: "Jajan & Kopi Riki",
      category: "Konsumsi",
      limit: 1000000,
      period: "Siklus Bulanan",
      color: "text-blue-500",
      bg: "bg-blue-50",
      icon: "coffee",
      resetDays: 26,
    },
  ],
  debts: [
    {
      id: "d2",
      owner: "shared",
      type: "payable",
      refId: "KPR-BCA-1029",
      title: "Cicilan KPR Tahunan",
      person: "Bank BCA",
      amount: 5500000,
      paid: 0,
      dueDate: "2026-05-10",
      status: "Mendesak",
      desc: "Cicilan ke-36 dari 180",
    },
  ],
  feed: [
    {
      id: "f1",
      type: "trx_add",
      text: "mencatat pengeluaran di 'Kopi Kenangan'",
      time: "Baru saja",
      owner: "u2",
    },
    {
      id: "f3",
      type: "task_done",
      text: "menyelesaikan tugas 'Bayar Listrik'",
      time: "Kemarin",
      owner: "shared",
    },
  ],
  chats: [
    {
      id: "c1",
      sender: "u2",
      text: "Sayang, uang sekolah anak udah ditransfer belum?",
      time: "08:15",
      date: "Hari ini",
    },
    {
      id: "c2",
      sender: "u1",
      text: "Udah ya, barusan dari Rekening Bersama.",
      time: "08:20",
      date: "Hari ini",
    },
  ],
};
// ==========================================
// 3. DESIGN SYSTEM & SHARED COMPONENTS
// ==========================================
const IconRenderer = ({ name, size = 20, className = "" }) => {
  const icons = {
    wallet: Wallet,
    briefcase: Briefcase,
    coffee: Coffee,
    activity: Activity,
    building: Building2,
    smartphone: Smartphone,
    banknote: Banknote,
    "shopping-bag": ShoppingBag,
    car: Car,
    film: Film,
    wifi: Wifi,
    target: Target,
    file: FileText,
  };
  const IconComponent = icons[name] || Wallet;
  return <IconComponent size={size} className={className} />;
};
const sizeMap = {
  4: "w-4 h-4",
  5: "w-5 h-5",
  6: "w-6 h-6",
  8: "w-8 h-8",
  10: "w-10 h-10",
  12: "w-12 h-12",
  16: "w-16 h-16",
};
const OwnerAvatar = ({
  ownerId,
  size = 6,
  showBorder = true,
  teamData = INITIAL_DATA.team,
  userData = INITIAL_DATA.user,
  className = "",
}: {
  ownerId: any;
  size?: number;
  showBorder?: boolean;
  teamData?: any;
  userData?: any;
  className?: string;
}) => {
  const sizeClass = sizeMap[size] || "w-6 h-6";

  const iconSize = size === 6 ? 12 : size === 10 ? 20 : 10;
  if (ownerId === "shared" || ownerId === "all")
    return (
      <div
        className={cn(
          sizeClass,
          "rounded-full bg-slate-800 flex items-center justify-center shadow-sm shrink-0",
          showBorder && "border border-white",
          className,
        )}
      >
        <Users size={iconSize} className="text-white" />
      </div>
    );

  const member = teamData.members.find((m: any) => m.id === ownerId);

  const img = member ? member.avatar : userData.avatar;
  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-100",
        showBorder && "border border-white",
        className,
      )}
    >
      <img src={img} className="w-full h-full object-cover" alt="owner" />
    </div>
  );
};
// ... (keep everything until Badge)
const Badge = ({
  children,
  variant = "default",
  className = "",
  icon: Icon = null,
}: any) => {
  const variants: any = {
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm",
    danger: "bg-rose-50 text-rose-700 border border-rose-200 shadow-sm",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm",
    info: "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm",
    purple: "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm",
    dark: "bg-slate-800 text-white border border-slate-700 shadow-sm",
    outline: "bg-transparent text-slate-500 border border-slate-200",
    outlineWarning: "bg-transparent text-amber-600 border border-amber-200",
    outlineInfo: "bg-transparent text-blue-600 border border-blue-200",
  };
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 w-fit border",
        variants[variant] || variants.default,
        className,
      )}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
};
const getCategoryColor = (cat: string) => {
  const map: any = {
    Konsumsi: "bg-orange-50 text-orange-600 border-orange-100",
    Belanja: "bg-pink-50 text-pink-600 border-pink-100",
    Transportasi: "bg-cyan-50 text-cyan-600 border-cyan-100",
    Pekerjaan: "bg-blue-50 text-blue-600 border-blue-100",
    Hiburan: "bg-purple-50 text-purple-600 border-purple-100",
    Tagihan: "bg-rose-50 text-rose-600 border-rose-100",
    Pribadi: "bg-slate-50 text-slate-600 border-slate-100",
    Keuangan: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return map[cat] || "bg-slate-100 text-slate-600 border-slate-100";
};
const SectionHeader = ({
  title,
  action,
  subtitle,
  className = "",
  icon: Icon = null,
  count,
  rightContent,
}: any) => {
  const hasCustomMargin = className.includes("mb-");
  return (
    <div className={cn(
      "flex justify-between items-center px-1",
      !hasCustomMargin && "mb-5",
      className
    )}>
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={16} className="text-blue-500 shrink-0" />}
        <div className="relative">
          <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight relative z-10 leading-none">
            {title}
          </h3>
        </div>
        {count !== undefined && (
          <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-extrabold border border-slate-200">
            {count}
          </span>
        )}
      </div>
      {subtitle && (
        <p className={cn(
          "text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-0.5",
          Icon ? "ml-5" : ""
        )}>
          {subtitle}
        </p>
      )}
    </div>
    <div className="flex items-center gap-3">
      {rightContent}
      {action && (
        <button className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group">
          {action}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}
    </div>
  </div>
  );
};

const ProgressBar = ({
  percent,
  colorClass = "bg-blue-500",
  label,
  labelRight,
}) => (
  <div className="w-full">
    {(label || labelRight) && (
      <div className="flex justify-between text-[11px] font-bold mb-1.5">
        <span className="text-slate-500">{label}</span>
        <span className={colorClass.replace("bg-", "text-")}>
          {labelRight ||
            `${percent}
%`}
        </span>
      </div>
    )}
    <div className="w-full bg-slate-100 rounded-full overflow-hidden h-2.5 shadow-inner border border-slate-200/50">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-1000 ease-out",
          colorClass,
        )}
        style={{
          width: `${Math.min(percent, 100)}
%`,
        }}
      />
    </div>
  </div>
);

// --- DROPDOWN PILIHAN PENAMPIL (SWITCH VIEWER) ---
const SwitchViewerDropdown = ({
  isOpen,
  onClose,
  teamData,
  activeOwner,
  onSelect,
  onOpenProfile,
}: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[140]" onClick={onClose} />
      <div className="absolute top-[68px] left-6 z-[450] w-[220px] bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-slate-200 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-left overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-50 mb-1 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Anggota Grup</p>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
            {teamData.members.length + 1}
          </span>
        </div>
        <div className="flex flex-col px-1.5 max-h-[280px] overflow-y-auto hide-scrollbar">
          <button
            onClick={() => {
              onSelect("all");
              onClose();
            }}
            className={cn(
              "w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group",
              activeOwner === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                : "bg-white hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  activeOwner === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                <Users size={16} strokeWidth={2.5} />
              </div>
              <span className={cn("text-[13px] font-bold", activeOwner === "all" ? "text-white" : "text-slate-700")}>
                Semua Anggota
              </span>
            </div>
            {activeOwner === "all" && <Check size={14} strokeWidth={3} className="mr-1" />}
          </button>
          
          {teamData.members.map((m: any) => (
            <button
              key={`switch-${m.id}`}
              onClick={() => {
                onSelect(m.id);
                onClose();
              }}
              className={cn(
                "w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group",
                activeOwner === m.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "bg-white hover:bg-slate-50",
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-8 h-8 rounded-lg overflow-hidden border transition-all",
                  activeOwner === m.id ? "border-white/30" : "border-slate-100"
                )}>
                  <img src={m.avatar} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <span className={cn("text-[13px] font-bold", activeOwner === m.id ? "text-white" : "text-slate-700")}>
                  {m.name}
                </span>
              </div>
              {activeOwner === m.id && <Check size={14} strokeWidth={3} className="mr-1" />}
            </button>
          ))}
        </div>
        
        <div className="mx-3 my-1.5 h-px bg-slate-50" />
        
        <div className="px-1.5 pb-1">
          <button
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="w-full flex items-center gap-2.5 p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
              <Settings size={16} />
            </div>
            <p className="text-[13px] font-bold text-slate-700">Pengaturan Profile</p>
          </button>
        </div>
      </div>
    </>
  );
};
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-5">
      <div className="bg-white rounded-[24px] p-6 shadow-xl w-full max-w-sm border border-slate-200 animate-in zoom-in-95 duration-200">
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">
          Konfirmasi Hapus
        </h3>
        <p className="text-[14px] text-slate-600 mb-6 font-normal">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-[14px] hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold text-[14px] shadow-sm hover:bg-rose-700 transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
const MessageModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-5">
      <div className="bg-white rounded-[24px] p-6 shadow-xl w-full max-w-sm border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info size={28} />
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[14px] text-slate-600 mb-6 font-normal">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-[14px] shadow-sm hover:bg-blue-700 transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
};
// --- KOMPONEN HEADER UTAMA (KONSISTEN) ---
const AppHeader = ({
  title,
  teamData,
  onOpenNotif,
  onOpenProfile,
  onBack,
  variant = "home",
  isProfileOpen = false,
}: any) => {
  const getDisplayNames = () => {
    if (!teamData) return "";
    return teamData.members.map((m: any) => m.name.split(" ")[0]).join(", ");
  };
  // Consistent height and style for all headers
  const headerClass =
    "sticky top-0 w-full h-[72px] bg-white z-50 px-6 flex items-center border-b border-slate-200 shrink-0 transition-all duration-300";
  if (variant === "centered" || onBack) {
    return (
      <header className="sticky top-0 w-full h-[64px] bg-white z-50 px-5 flex items-center gap-3 border-b border-slate-200 shrink-0 transition-all duration-300">
        <div className="flex-1 flex justify-start">
            {onBack ? (
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm active:scale-95 transition-all hover:bg-slate-50 outline-none"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <div
                className="relative cursor-pointer transition-transform active:scale-95"
                onClick={onOpenProfile}
              >
                <div className="flex -space-x-2">
                  {teamData?.members.slice(0, 3).map((m: any) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      alt="m"
                    />
                  ))}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md border border-slate-200">
                  <ChevronDown
                    size={10}
                    className={cn(
                      "text-slate-400 transition-transform duration-300",
                      isProfileOpen && "rotate-180",
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        <div className="flex-[2] flex justify-center text-center">
          <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={onOpenNotif}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all relative"
          >
            <Bell size={18} strokeWidth={2.2} />
            <span className="absolute top-[11px] right-[11px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>
    );
  }
  return (
    <header className="sticky top-0 w-full h-[64px] bg-white z-50 px-5 flex items-center gap-3 border-b border-slate-200 shrink-0 transition-all duration-300">
      {teamData && (
          <div
            className="relative group cursor-pointer transition-transform active:scale-95"
            onClick={onOpenProfile}
          >
            <div className="flex -space-x-2">
              {teamData.members.slice(0, 3).map((m: any) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  alt={m.name}
                />
              ))}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-slate-200 flex items-center justify-center">
              <ChevronDown
                size={12}
                className={cn("text-slate-500 transition-transform duration-300", isProfileOpen && "rotate-180")}
                strokeWidth={3}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h1 className="text-[18px] font-extrabold text-blue-600 tracking-tight leading-none">
            Family Hub
          </h1>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
            {getDisplayNames()}
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onOpenNotif}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all relative outline-none"
          >
            <Bell size={20} strokeWidth={2.2} />
            <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
    </header>
  );
};
// --- KOMPONEN DETAIL HEADER (KONSISTEN) ---
const DetailHeader = ({ title, onClose, action }: any) => (
  <header className="sticky top-0 w-full h-[64px] bg-white z-50 px-5 flex items-center border-b border-slate-200 shrink-0">
    <div className="flex-1 flex justify-start">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-sm active:scale-95 transition-all hover:bg-white hover:text-blue-500 outline-none"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="flex-[2] flex justify-center text-center">
        <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-none">
          {title}
        </h2>
      </div>
      <div className="flex-1 flex justify-end">
        {action ? action : <div className="w-10 h-10" />}
      </div>
  </header>
);

// --- KOMPONEN NOTIFIKASI PANEL ---
const NotificationPanel = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[500] flex justify-center font-inter overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md h-full bg-[#f1f5f9] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <header className="sticky top-0 w-full h-[64px] bg-white z-50 px-5 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex-1 flex justify-start">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-sm active:scale-95 transition-all hover:bg-white hover:text-blue-500 outline-none"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="flex-[2] flex flex-col justify-center text-center">
            <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-none mb-1">
              Notifikasi
            </h3>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Informasi Terbaru
            </p>
          </div>
          <div className="flex-1"></div>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scroll-smooth">
          <div>
            <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-4 px-1">
              Aktivitas Terbaru
            </h4>
            <div className="space-y-3">
              {data.transactions.slice(0, 8).map((t: any) => (
                <div
                  key={t.id}
                  className="p-4 bg-white border border-slate-200 rounded-[22px] hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm group cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={
                          data.team.members.find((m: any) => m.id === t.owner)
                            ?.avatar || data.user.avatar
                        }
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] text-slate-900 leading-snug">
                        <span className="font-extrabold">
                          {t.owner === "u1"
                            ? "Anda"
                            : data.team.members.find(
                                (m: any) => m.id === t.owner,
                              )?.name}
                        </span>
                        mencatat{" "}
                        <span className="font-bold text-blue-600">
                          {t.title}
                        </span>
                        sebesar{" "}
                        <span className="font-extrabold">
                          {formatCurrency(t.amount)}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-bold flex items-center gap-1">
                        <Clock size={10} />
                        {t.time}    Baru saja
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <button className="w-full py-4 bg-white border border-slate-200 rounded-[18px] text-[13px] font-extrabold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
            Tandai Semua Sudah Dibaca
          </button>
        </div>
      </div>
    </div>
  );
};

const DailyDateSelector = ({ selectedDate, onSelectDate, itemsMap = {} }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderCalendar = () => {
    const daysInMonth = 31;
    const startOffset = 4; // 1 Mei 2026 adalah Jumat (idx 4 jika mulai Senin 0?)
    // 1 Mei 2026 adalah Jumat. 
    // Jika Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6.
    
    const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7;
    const cells = [];
    const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const TODAY = 4;

    dayNames.forEach((day, idx) => {
      cells.push(
        <div key={`header-${day}`} className={cn("text-[10px] font-semibold uppercase text-center mb-2", idx === 6 ? "text-rose-500" : "text-slate-400")}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < totalCells; i++) {
      const date = i - startOffset + 1;
      const isCurrentMonth = date > 0 && date <= daysInMonth;
      const isSelected = date === selectedDate;
      const isToday = date === TODAY;
      const isSunday = i % 7 === 6;
      const items = isCurrentMonth ? itemsMap[date] || [] : [];

      cells.push(
        <div
          key={`cell-${i}`}
          onClick={() => {
            if (isCurrentMonth) {
              onSelectDate(date);
              setIsOpen(false);
            }
          }}
          className={cn(
            "h-[42px] rounded-xl flex flex-col items-center justify-start pt-1.5 relative cursor-pointer transition-all border",
            !isCurrentMonth ? "opacity-0 pointer-events-none" : "",
            isSelected
              ? "bg-slate-900 text-white shadow-md border-slate-900"
              : isToday
                ? "bg-blue-50/80 border-blue-200"
                : "bg-transparent border-transparent hover:bg-slate-50",
          )}
        >
          <span className={cn("text-[13px] font-semibold leading-none z-10", 
            isSelected ? "text-white" : 
            isToday ? "text-blue-700" : 
            isSunday ? "text-rose-500" : "text-slate-700"
          )}>
            {isCurrentMonth ? date : ""}
          </span>
          {items.length > 0 && (
            <div className="absolute bottom-1.5 flex w-full px-2 gap-0.5 h-1 justify-center opacity-90">
              {items.slice(0, 3).map((col: any, idx: number) => (
                <div key={`dot-${idx}`} className={cn("flex-1 rounded-full", isSelected ? "bg-white/80" : col)}></div>
              ))}
              {items.length > 3 && (
                <div className={cn("w-1 h-1 rounded-full shrink-0", isSelected ? "bg-white/80" : "bg-slate-400")}></div>
              )}
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-[18px] p-1.5 shadow-sm">
        <button
          onClick={() => onSelectDate(Math.max(1, selectedDate - 1))}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex justify-center items-center gap-2 px-3 hover:bg-slate-50 py-1.5 rounded-lg transition-colors"
        >
          <CalendarIcon size={14} className="text-blue-600" />
          <span className="text-[13px] font-semibold text-slate-800">
            {selectedDate} Mei 2026
          </span>
          <ChevronDown
            size={14}
            className={cn("text-slate-400 transition-transform duration-300", isOpen ? "rotate-180" : "")}
          />
        </button>
        <button
          onClick={() => onSelectDate(Math.min(31, selectedDate + 1))}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-[18px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-top-2 duration-200 w-full mt-1 z-20 absolute top-[100%]">
          <div className="flex justify-between items-center mb-4 px-2 border-b border-slate-100 pb-3">
            <h4 className="text-[14px] font-bold text-slate-900">Mei 2026</h4>
          </div>
          <div className="grid grid-cols-7 gap-y-2 mb-4">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};
// --- KOMPONEN KARTU TRANSAKSI (GAYA PREMIUM BERSIH) ---
const TransactionCard = ({ trx, team, budgets, onOpenDetail, onOpenComments }: any) => {
  const hasComments = trx.comments && trx.comments.length > 0;

  const budgetMatch = budgets?.find((b) => b.category === trx.category);

  // Kustomisasi warna badge spesifik untuk Kategori
  const getCatColor = (cat: any) => {
    const map: any = {
      Konsumsi: "bg-orange-50 text-orange-600 border-orange-200 shadow-sm",
      Belanja: "bg-pink-50 text-pink-600 border-pink-200 shadow-sm",
      Transportasi: "bg-cyan-50 text-cyan-600 border-cyan-200 shadow-sm",
      Pekerjaan: "bg-blue-50 text-blue-600 border-blue-200 shadow-sm",
      Hiburan: "bg-purple-50 text-purple-600 border-purple-200 shadow-sm",
      Tagihan: "bg-rose-50 text-rose-600 border-rose-200 shadow-sm",
    };
    return map[cat] || "bg-slate-50 text-slate-500 border-slate-200 shadow-sm";
  };
  return (
    <div
      className="bg-white p-5 rounded-[22px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200 mb-3.5 relative z-10 group cursor-pointer active:scale-[0.98] transition-all"
      onClick={() => onOpenDetail(trx, trx.type)}
    >
      <div className="flex items-start gap-4">
        {/* Ikon Kiri */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm",
              trx.type === "income"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : trx.type === "transfer"
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-rose-50 text-rose-600 border-rose-100",
            )}
          >
            <IconRenderer name={trx.icon} size={22} />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-white">
            <OwnerAvatar ownerId={trx.owner} size={5} teamData={team} />
          </div>
        </div>
        {/* Konten Tengah */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-[15px] font-bold text-slate-900 truncate pr-2">
              {trx.title}
            </p>
            <p
              className={cn(
                "text-[16px] font-extrabold tracking-tight font-outfit",
                trx.type === "income" ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trx.type === "income" ? "+" : "-"}
              {formatCurrency(trx.amount)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-0.5 mb-1">
            <p className="text-[12px] font-normal text-slate-500 truncate flex items-center gap-1">
              <CreditCard size={12} className="text-slate-400" />
              {trx.pocket}
            </p>
            <p className="text-[11px] font-bold text-slate-900">{trx.time}</p>
          </div>
          {/* Baris Badge & Tombol Bawah */}
          <div className="flex justify-between items-end mt-1">
            <div className="flex flex-col gap-1.5 items-start">
              {/* 1. Badge Kategori / Anggaran */}
              {budgetMatch ? (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit border",
                    getCatColor(trx.category),
                  )}
                >
                  <PieChartIcon size={10} strokeWidth={2.5} />
                  {budgetMatch.name}
                </span>
              ) : (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit border",
                    getCatColor(trx.category),
                  )}
                >
                  <Tag size={10} strokeWidth={2.5} />
                  {trx.category}
                </span>
              )}
              {/* 2. Badge Lokasi Langsung Nama */}
              {trx.isActivity && trx.location && (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 flex items-center gap-1 uppercase tracking-wider w-fit shadow-sm">
                  <MapPin size={10} strokeWidth={2.5} />
                  {trx.location}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {/* Tombol Dropdown Komen (Balas) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenComments) onOpenComments("transaction", trx.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors border shadow-sm ${
                  hasComments 
                    ? "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100" 
                    : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <MessageCircle size={12} />
                {hasComments && <span className="text-[11px] font-bold">{trx.comments.length}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- KOMPONEN ITEM AKTIVITAS SATUAN (AMAN & PROFESIONAL) ---
const ActivityCardItem = ({ act, team, onOpenDetail, onOpenComments, onToggleTaskStatus }: any) => {
  // Custom type mapping
  const colors: Record<string, any> = {
    Olahraga: { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
    Kerja: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-200" },
    Keluarga: { bg: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50", border: "border-rose-200" },
    Makan: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", border: "border-orange-200" },
    Belanja: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50", border: "border-pink-200" },
    Bermain: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-200" },
    Lainnya: { bg: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
  };
  const typeColor = colors[act.type] || {
    bg: "bg-slate-600",
    text: "text-slate-600",
    light: "bg-slate-50",
    border: "border-slate-200",
  };
  const isDoneTask = act.isTask && act.status === "selesai";
  const isDeadline = act.isTask && act.priority === "Tinggi";
  const isRegularTask = act.isTask && !isDeadline;
  const hasComments = act.comments && act.comments.length > 0;

  // Clean 24-hour format time string
  const time24 = (act.timeStart || "").replace(/(?:[ ]?(?:AM|PM|am|pm))/gi, "").trim();

  // Determine if task deadline is overdue or within time
  const isOverdue = (() => {
    if (!act.isTask || act.priority !== "Tinggi" || isDoneTask) return false;
    const deadlineDate = new Date(act.refItem.date);
    return deadlineDate.getTime() < new Date().getTime();
  })();

  const isWithinTime = (() => {
    if (!act.isTask || act.priority !== "Tinggi" || isDoneTask) return false;
    const deadlineDate = new Date(act.refItem.date);
    return deadlineDate.getTime() >= new Date().getTime();
  })();

  const cardStyle = (() => {
    if (isDoneTask) {
      return "bg-slate-50/50 border-slate-200 opacity-60 hover:bg-slate-50/70";
    }
    if (isOverdue) {
      return "bg-rose-50/80 border-rose-200 hover:bg-rose-100/40 shadow-[0_4px_16px_rgba(244,63,94,0.06)] hover:border-rose-300";
    }
    if (isWithinTime) {
      return "bg-amber-50/80 border-amber-200 hover:bg-amber-100/40 shadow-[0_4px_16px_rgba(245,158,11,0.06)] hover:border-amber-300";
    }
    return "bg-white border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-slate-300/80";
  })();

  return (
    <div className="relative z-10 animate-in fade-in duration-200">
      {/* Time Label - Perfectly Centered Vertically with the Top Row Avatar */}
      <div className="absolute -left-[90px] top-[26px] w-[60px] text-right">
        <p
          className={cn(
            "text-[13px] font-black font-outfit tracking-tight leading-tight",
            isDoneTask ? "text-slate-300" : "text-slate-900",
          )}
        >
          {time24}
        </p>
      </div>

      {/* Timeline Node - Perfectly Centered Vertically with the Top Row Avatar and Mathematically Aligned with the Vertical Line */}
      <div
        className={cn(
          "absolute -left-[26px] top-[30px] w-3 h-3 rounded-full z-20 flex items-center justify-center ring-4 ring-slate-50",
          isDoneTask
            ? "bg-slate-300"
            : isDeadline
              ? isOverdue
                ? "bg-rose-500 animate-pulse"
                : "bg-amber-500 animate-pulse"
              : isRegularTask
                ? "bg-emerald-500"
                : typeColor.bg,
        )}
      >
        {isDeadline ? (
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
        ) : (
          <div className="w-1 h-1 bg-white rounded-full opacity-60" />
        )}
      </div>

      {/* Main Card - Perfectly Matched to Transaction Card Styles */}
      <div
        onClick={() => onOpenDetail(act.refItem, act.isTask ? "task" : "activity")}
        className={cn(
          "rounded-[22px] p-5 border transition-all relative overflow-hidden group cursor-pointer active:scale-[0.99] shadow-sm select-none",
          cardStyle
        )}
      >
        {/* Top Header Row: Owner Avatar and Name in Corner, Type Badge on Right */}
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center gap-2">
            <OwnerAvatar
              ownerId={act.owner}
              size={6}
              showBorder={false}
              teamData={team}
            />
            <span className="text-[11px] font-extrabold text-slate-500 font-outfit uppercase tracking-wider">
              {team.members.find((m: any) => m.id === act.owner)?.name.split(" ")[0] || "Saya"}
            </span>
          </div>

          {/* Top-Right Badges Container */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Priority Badge */}
            {act.isTask && act.priority && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border shrink-0 shadow-sm flex items-center gap-1",
                  isDoneTask
                    ? "bg-slate-100 text-slate-500 border-slate-200"
                    : act.priority === "Tinggi"
                      ? isOverdue
                        ? "bg-rose-100 text-rose-700 border-rose-200 shadow-sm"
                        : "bg-amber-100 text-amber-700 border-amber-200 shadow-sm"
                      : act.priority === "Sedang"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                )}
              >
                <AlertCircle size={10} strokeWidth={3.5} />
                {act.priority}
              </span>
            )}

            {/* Done Badge */}
            {isDoneTask && (
              <span
                className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border shrink-0 shadow-sm flex items-center gap-1 bg-emerald-50 text-emerald-600 border-emerald-200"
              >
                <CheckCircle size={10} strokeWidth={3.5} />
                Selesai
              </span>
            )}

            {/* Top-Right Corner Type Badge (Only rendered for non-task items, keeping UI clean for tasks) */}
            {!act.isTask && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border shrink-0 shadow-sm flex items-center gap-1",
                  cn(typeColor.light, typeColor.text, typeColor.border),
                )}
              >
                {act.type}
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-2.5">
          {/* Middle Row: Checkbox on Left, Title/Desc Column on Right */}
          <div className="flex items-start gap-3 relative">
            {act.isTask && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onToggleTaskStatus) onToggleTaskStatus(act.refItem.id);
                }}
                className="w-12 h-12 -ml-3 -mt-2.5 flex items-center justify-center cursor-pointer transition-all active:scale-90 shrink-0 z-30 select-none bg-transparent focus:outline-none group/btn"
              >
                <div
                  className={cn(
                    "w-[26px] h-[26px] rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden",
                    isDoneTask
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_3px_10px_rgba(16,185,129,0.35)] scale-[1.05]"
                      : isOverdue
                        ? "border-rose-300 bg-rose-50/10 hover:bg-rose-50 hover:border-rose-500 text-transparent"
                        : isWithinTime
                          ? "border-amber-300 bg-amber-50/10 hover:bg-amber-50 hover:border-amber-500 text-transparent"
                          : "border-slate-300 bg-slate-50/10 hover:bg-slate-50 hover:border-slate-400 text-transparent",
                  )}
                >
                  {/* Faint preview checkmark when hovering over unchecked box */}
                  {!isDoneTask && (
                    <Check 
                      size={13} 
                      strokeWidth={4.5} 
                      className="absolute opacity-0 group-hover/btn:opacity-40 transition-opacity duration-200 text-slate-400 scale-90" 
                    />
                  )}

                  {/* High contrast sharp checkmark with rotation when active */}
                  <Check 
                    size={13} 
                    strokeWidth={4.5} 
                    className={cn(
                      "transition-all duration-300 transform", 
                      isDoneTask ? "scale-100 opacity-100 rotate-0 text-white" : "scale-50 opacity-0 -rotate-12 text-transparent"
                    )} 
                  />
                </div>
              </button>
            )}

            {/* Title & Description Column */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4
                className={cn(
                  "text-[15px] font-bold tracking-tight leading-tight transition-colors",
                  isDoneTask
                    ? "line-through text-slate-400 font-medium"
                    : isOverdue
                      ? "text-rose-950 font-extrabold"
                      : isWithinTime
                        ? "text-amber-950 font-extrabold"
                        : "text-slate-900",
                )}
              >
                {act.title}
              </h4>

              {/* Description inside the shifted column */}
              {act.desc && (
                <p
                  className={cn(
                    "text-[12px] font-normal leading-relaxed transition-colors",
                    isDoneTask
                      ? "text-slate-400"
                      : isOverdue
                        ? "text-rose-700/80 font-medium"
                        : isWithinTime
                          ? "text-amber-700/80 font-medium"
                          : "text-slate-500"
                  )}
                >
                  {act.desc}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row: Location & Actions (Comments, detail views) */}
          <div className="flex justify-between items-center pt-1">
            <div className="flex flex-wrap gap-2">
              {act.location && !act.isTask && (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 flex items-center gap-1 uppercase tracking-wider w-fit shadow-sm">
                  <MapPin size={10} strokeWidth={2.5} />
                  {act.location}
                </span>
              )}
              {act.isTask && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[9px] font-extrabold flex items-center gap-1 uppercase tracking-wider w-fit shadow-sm border transition-colors",
                    isDoneTask
                      ? "bg-slate-100 text-slate-400 border-slate-200"
                      : isOverdue
                        ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                        : "bg-amber-100 text-amber-700 border-amber-300"
                  )}
                >
                  <Clock size={10} strokeWidth={2.5} />
                  {isDeadline ? `DEADLINE: JAM ${time24}` : `TARGET TUGAS: JAM ${time24}`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onOpenComments) onOpenComments("activity", act.id);
                }}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all border shadow-sm active:scale-95 hover:scale-105 z-20",
                  isDoneTask
                    ? "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                    : isOverdue
                      ? hasComments
                        ? "text-rose-700 bg-rose-100 border-rose-300 hover:bg-rose-200"
                        : "text-rose-500 bg-white border-rose-200 hover:bg-rose-50/50"
                      : isWithinTime
                        ? hasComments
                          ? "text-amber-700 bg-amber-100 border-amber-300 hover:bg-amber-200"
                          : "text-amber-500 bg-white border-amber-200 hover:bg-amber-50/50"
                        : hasComments
                          ? "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100"
                          : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                )}
              >
                <MessageCircle size={13} strokeWidth={2.5} />
                {hasComments && <span className="text-[11px] font-extrabold">{act.comments.length}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- BOTTOM SHEET KOMENTAR (OPSI 1) ---
const CommentsBottomSheet = ({ item, type, team, budgets, onClose, onAddComment }: any) => {
  const [text, setText] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Swipe down anywhere on list (Instagram logic) gesture refs
  const listScrollStartY = useRef(0);
  const listIsAtTopOnTouchStart = useRef(false);

  const handleListTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    listScrollStartY.current = e.touches[0].clientY;
    listIsAtTopOnTouchStart.current = listRef.current ? listRef.current.scrollTop <= 0 : true;
  };

  const handleListTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!listIsAtTopOnTouchStart.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - listScrollStartY.current;
    
    // Drag DOWN gesture when list is scrolled to the absolute top
    if (deltaY > 0) {
      setIsDragging(true);
      dragStartY.current = listScrollStartY.current;
    }
  };

  const handleListMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    listScrollStartY.current = e.clientY;
    listIsAtTopOnTouchStart.current = listRef.current ? listRef.current.scrollTop <= 0 : true;
  };

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    if (!listIsAtTopOnTouchStart.current) return;
    
    const deltaY = e.clientY - listScrollStartY.current;
    if (deltaY > 0) {
      setIsDragging(true);
      dragStartY.current = listScrollStartY.current;
    }
  };

  // Track dynamic visual viewport dimensions in real-time to match virtual keyboard
  const [vvHeight, setVvHeight] = useState(window.innerHeight);
  const [vvOffsetTop, setVvOffsetTop] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setVvHeight(vv.height);
      setVvOffsetTop(vv.offsetTop);
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    // Execute immediately
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // Auto scroll comment list to bottom when comments change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [item?.comments]);

  // DRAG & DISMISS GESTURE STATE
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartY.current;

      // Dismiss keyboard immediately when user starts dragging down
      if (deltaY > 10) {
        (document.activeElement as HTMLElement)?.blur();
      }

      if (deltaY > 0) {
        if (e.cancelable) e.preventDefault();
        setDragOffset(deltaY);
      }
    };

    const onEnd = () => {
      setIsDragging(false);
      if (dragOffset > 150) {
        onClose();
      } else {
        setDragOffset(0);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, dragOffset, onClose]);

  if (!item) return null;

  const budgetMatch = budgets?.find((b: any) => b.category === item.category);

  const getCatColor = (cat: any) => {
    const map: any = {
      Konsumsi: "bg-orange-50 text-orange-600 border-orange-200 shadow-sm",
      Belanja: "bg-pink-50 text-pink-600 border-pink-200 shadow-sm",
      Transportasi: "bg-cyan-50 text-cyan-600 border-cyan-200 shadow-sm",
      Pekerjaan: "bg-blue-50 text-blue-600 border-blue-200 shadow-sm",
      Hiburan: "bg-purple-50 text-purple-600 border-purple-200 shadow-sm",
      Tagihan: "bg-rose-50 text-rose-600 border-rose-200 shadow-sm",
    };
    return map[cat] || "bg-slate-50 text-slate-500 border-slate-200 shadow-sm";
  };

  const commentsCount = item.comments ? item.comments.length : 0;
  const getSenderName = (id: string) => {
    if (id === "u1") return "Riki";
    const member = team?.members?.find((m: any) => m.id === id);
    return member ? member.name : "Anggota";
  };

  // Full Visual Viewport Height
  const sheetHeight = vvHeight;

  return (
    <div 
      style={{
        position: "fixed",
        left: 0,
        top: `${vvOffsetTop}px`,
        width: "100%",
        height: `${vvHeight}px`,
      }}
      className="z-[500] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Tap Backdrop to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Drawer — perfectly fitted inside Visual Viewport */}
      <div
        ref={sheetRef}
        style={{
          height: `${sheetHeight}px`,
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative w-full max-w-md bg-slate-100 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Notch & Header Premium (High Contrast / Staggered Layout) */}
        <div 
          className="bg-slate-100 border-b border-slate-200/80 shrink-0 cursor-grab active:cursor-grabbing select-none pb-4 relative"
          onMouseDown={(e) => {
            // Block dragging if clicking close button
            setIsDragging(true);
            dragStartY.current = e.clientY;
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            dragStartY.current = e.touches[0].clientY;
          }}
        >
          {/* iOS Drag Notch */}
          <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />

          {/* Floating Close Button (Absolute in top-left) */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm active:scale-95 transition-all"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Centered Title Row (Offset vertically to let close button sit higher) */}
          <div className="text-center px-16 mt-4.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
              Komentar ({commentsCount})
            </h3>
          </div>
        </div>

        {/* Premium Context Card (Super Compact Badge Pill Layout) */}
        <div 
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="px-5 py-4 bg-slate-100 border-b border-slate-200/80 flex flex-col relative z-10 shrink-0"
        >
          {/* Floating White Shadow Card - Designed for Comments Detail */}
          <div className="bg-white p-3.5 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-slate-200/80 flex flex-col gap-3 w-full">
            
            {/* Hero Section: Icon, Title & Amount */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Main Icon Container with Overlapping Owner Avatar */}
                <div className="relative shrink-0 select-none">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                      type === "transaction"
                        ? item.type === "income"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : item.type === "transfer"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    )}
                  >
                    {type === "transaction" ? (
                      <IconRenderer name={item.icon || "Wallet"} size={18} />
                    ) : (
                      <CalendarIcon size={18} />
                    )}
                  </div>
                  {/* Floating Owner Avatar - Absolute overlapping in bottom-right corner (Large & Visible) */}
                  <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-white">
                    <OwnerAvatar ownerId={item.owner || item.creator || "u1"} size={5} teamData={team} />
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h4 className="text-[13.5px] font-extrabold text-slate-800 truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-none mt-1.5 flex items-center gap-1">
                    <span>{item.time || "Hari ini"}</span>
                    <span>•</span>
                    <span>Oleh <span className="text-slate-500 font-extrabold">{getSenderName(item.owner || item.creator || "u1")}</span></span>
                  </p>
                </div>
              </div>

              {type === "transaction" && (
                <div className="text-right shrink-0">
                  <span
                    className={cn(
                      "text-[15.5px] font-black tracking-tight font-outfit block leading-none",
                      item.type === "income" ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              )}
            </div>

            {/* Premium Pill Badges Row - Perfectly wrapping, no truncation dots */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {/* Sumber Dana / Pocket */}
              <span className="px-2 py-1 rounded-lg text-[9.5px] font-bold text-slate-600 bg-slate-50 border border-slate-200/50 flex items-center gap-1.5 shadow-sm">
                <CreditCard size={11} strokeWidth={2.5} className="text-slate-400" />
                <span>{item.pocket || "Kantong Utama"}</span>
              </span>

              {/* Anggaran / Category */}
              {type === "transaction" && (
                budgetMatch ? (
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[9.5px] font-bold flex items-center gap-1.5 border shadow-sm",
                    getCatColor(item.category)
                  )}>
                    <PieChartIcon size={11} strokeWidth={2.5} />
                    <span>{budgetMatch.name}</span>
                  </span>
                ) : (
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[9.5px] font-bold flex items-center gap-1.5 border shadow-sm",
                    getCatColor(item.category)
                  )}>
                    <Tag size={11} strokeWidth={2.5} />
                    <span>{item.category}</span>
                  </span>
                )
              )}

              {/* Lokasi (jika ada) */}
              {item.location && (
                <span className="px-2 py-1 rounded-lg text-[9.5px] font-bold text-amber-600 bg-amber-50 border border-amber-200 flex items-center gap-1.5 shadow-sm">
                  <MapPin size={11} strokeWidth={2.5} />
                  <span>{item.location}</span>
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Scrollable Comment List */}
        <div
          ref={listRef}
          onTouchStart={handleListTouchStart}
          onTouchMove={handleListTouchMove}
          onMouseDown={handleListMouseDown}
          onMouseMove={handleListMouseMove}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scroll-smooth hide-scrollbar bg-slate-50 overscroll-contain touch-pan-y"
        >
          {commentsCount > 0 ? (
            item.comments.map((c: any, i: number) => {
              const isMe = c.sender === "u1";
              return (
                <div 
                  key={`sheet-comment-${i}`} 
                  className={cn(
                    "flex items-end gap-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-200", 
                    isMe ? "flex-row-reverse justify-start" : "justify-start"
                  )}
                >
                  {/* Avatar */}
                  <OwnerAvatar ownerId={c.sender} size={7} teamData={team} className="shrink-0 mb-0.5" />
                  
                  {/* Chat Bubble */}
                  <div
                    className={cn(
                      "px-4 py-2.5 shadow-sm border transition-all max-w-[72%]",
                      isMe
                        ? "bg-[#0066ff] border-transparent text-white rounded-[20px] rounded-br-[4px] shadow-blue-500/5"
                        : "bg-white border-slate-200/50 text-slate-800 rounded-[20px] rounded-bl-[4px]"
                    )}
                  >
                    {!isMe && (
                      <span className="text-[11px] font-extrabold text-blue-600 block mb-1">
                        {getSenderName(c.sender)}
                      </span>
                    )}
                    <p className={cn("text-[13px] font-medium leading-relaxed break-words", isMe ? "text-white" : "text-slate-700")}>
                      {c.text}
                    </p>
                    {/* Sub timestamp inside bubble */}
                    <span className={cn("text-[9px] font-semibold block mt-1 text-right tracking-tight opacity-75", isMe ? "text-blue-100/90" : "text-slate-400")}>
                      {c.time}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <MessageSquare size={20} />
              </div>
              <p className="text-[13px] font-bold text-slate-400">Belum ada komentar</p>
              <p className="text-[11px] text-slate-300 mt-1">Mulai obrolan di bawah untuk item ini.</p>
            </div>
          )}
        </div>

        {/* Bottom Reply Bar - Anchored beautifully (FB & IG style) */}
        <div 
          className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe-offset-4 shrink-0"
        >
          <OwnerAvatar ownerId="u1" size={8} teamData={team} />
          <div className="flex-1 bg-slate-100/90 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
            <textarea
              rows={1}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Tulis komentar..."
              className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-slate-700 resize-none h-[20px] py-0 leading-normal focus:ring-0"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim()) {
                    onAddComment(text.trim());
                    setText("");
                    (document.activeElement as HTMLElement)?.blur();
                  }
                }
              }}
            />
            <button
              onClick={() => {
                if (text.trim()) {
                  onAddComment(text.trim());
                  setText("");
                  (document.activeElement as HTMLElement)?.blur();
                }
              }}
              className="text-blue-600 hover:text-blue-700 active:scale-90 transition-all ml-2"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN MODAL DETAIL ITEM ---
const ItemDetailModal = ({
  isOpen,
  item,
  type,
  onClose,
  onEdit,
  requestDelete,
  team,
  transactions,
  budgets,
  showMessage,
  onOpenDetail,
  onOpenComments,
  onToggleTaskStatus,
}: any) => {
  const [newComment, setNewComment] = useState("");



  const [localSearch, setLocalSearch] = useState("");

  const [localType, setLocalType] = useState("all");
  if (!isOpen || !item) return null;

  const isTrx = type === "expense" || type === "income" || type === "transfer";

  const isTask = type === "task" || (item && typeof item === "object" && ("priority" in item || "status" in item));

  const isAct = type === "activity" && !(item && typeof item === "object" && ("priority" in item || "status" in item));

  const isPocket = type === "pocket";

  const isBudget = type === "budget";

  const isDebt = type === "debt";

  const hasComments = item.comments && item.comments.length > 0;

  // Filter Riwayat based on localMonth and localSearch
  const historyTransactions = transactions
    ? isPocket
      ? transactions.filter((t: any) => t.pocket === item.name)
      : transactions.filter(
          (t: any) => t.category === item.category && t.type === "expense",
        )
    : [];

  const filteredHistory = historyTransactions
    .filter((t: any) => {
      const matchesSearch =
        t.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(localSearch.toLowerCase());

      const matchesType = localType === "all" || t.type === localType;
      return matchesSearch && matchesType;
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const groupedHistory = (() => {
    const groups: any = {};
    filteredHistory.forEach((trx: any) => {
      const dateLabel = trx.isToday ? "Hari Ini" : formatDate(trx.date);
      if (!groups[dateLabel]) {
        groups[dateLabel] = {
          dateRaw: new Date(trx.date).getTime(),
          totalIncome: 0,
          totalExpense: 0,
          items: [],
        };
      }
      groups[dateLabel].items.push(trx);
      if (trx.type === "income") groups[dateLabel].totalIncome += trx.amount;
      if (trx.type === "expense") groups[dateLabel].totalExpense += trx.amount;
    });
    return Object.entries(groups).sort(
      (a: any, b: any) => b[1].dateRaw - a[1].dateRaw,
    );
  })();

  const monthlyStats = (() => {
    if (!isPocket || !historyTransactions) return { income: 0, expense: 0 };
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTrx = historyTransactions.filter((t: any) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return {
      income: thisMonthTrx
        .filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + t.amount, 0),
      expense: thisMonthTrx
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + t.amount, 0),
    };
  })();

  const getTitle = () => {
    if (isPocket) return "Detail Kantong";
    if (isBudget) return "Detail Budget";
    if (isDebt)
      return item.type === "payable" ? "Detail Hutang" : "Detail Piutang";
    if (isTrx) return "Detail Transaksi";
    if (isTask) return "Detail Tugas";
    if (isAct) return "Detail Aktivitas";
    return "Detail";
  };
  return (
    <div className="fixed inset-0 z-[410] flex flex-col bg-[#f8fafc] border border-slate-200 animate-in slide-in-from-bottom-full duration-300 overflow-hidden max-w-md mx-auto left-0 right-0 sm:rounded-b-[40px] sm:rounded-t-none">
      <DetailHeader 
        title={getTitle()} 
        onClose={onClose} 
        action={(
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(type, item)}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white active:scale-90 transition-all shadow-sm cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => {
                onClose();
                const collection = isPocket ? "pockets" : isBudget ? "budgets" : isDebt ? "debts" : isTrx ? "transactions" : isTask ? "tasks" : "activities";
                requestDelete(collection, item.id);
              }}
              className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-100 active:scale-90 transition-all shadow-sm cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-12 scroll-smooth hide-scrollbar bg-[#f8fafc]">
        {/* CONTENT AREA */}
        <div className="bg-white rounded-[22px] p-6 shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
          {/* 1. TRANSAKSI DETAIL */}
          {isTrx && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                    item.type === "income"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.type === "transfer"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-rose-100 text-rose-600",
                  )}
                >
                  <IconRenderer name={item.icon} size={24} />
                </div>
                <OwnerAvatar ownerId={item.owner} size={8} teamData={team} />
              </div>
              <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight mb-2 pr-6">
                {item.title}
              </h3>
              <p
                className={cn(
                  "text-[32px] font-bold tracking-tight mb-6 font-outfit",
                  item.type === "income"
                    ? "text-emerald-600"
                    : item.type === "transfer"
                      ? "text-blue-600"
                      : "text-rose-600",
                )}
              >
                {item.type === "income" ? "+" : "-"}
                {formatCurrency(item.amount)}
              </p>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Kategori</span>
                  <span
                    className={cn(
                      "font-bold px-3 py-1 rounded-lg border text-[11px] shadow-sm",
                      getCategoryColor(item.category).replace("border-100", "border-200"),
                    )}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Sumber Dana
                  </span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                    <CreditCard size={12} />
                    {item.pocket}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Waktu Transaksi
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatDate(item.date)}    {item.time}
                  </span>
                </div>
                {item.location && (
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Lokasi</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 text-right max-w-[180px] truncate">
                      <MapPin size={12} className="text-rose-500" />
                      {item.location}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
          {/* 2. KANTONG DETAIL (RE-DESIGNED) */}
          {isPocket && (
            <div className="relative overflow-hidden transition-all duration-500">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100",
                        item.bg.replace("500", "50").replace("600", "50"),
                        item.color,
                      )}
                    >
                      <IconRenderer name={item.icon} size={24} />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 leading-none mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                          {item.accountNo || "**** 0000"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ICON BUTTONS EDIT & DELETE */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(type, item)}
                      className="w-8 h-8 rounded-lg bg-transparent border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => requestDelete(type, item.id)}
                      className="w-8 h-8 rounded-lg bg-transparent border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-slate-400 text-[10px] font-bold mb-1 tracking-wider uppercase">
                    Saldo Saat Ini
                  </p>
                  <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">
                    {formatCurrency(item.balance)}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Pemasukan Bulan Ini
                    </p>
                    <p className="text-[16px] font-bold text-emerald-600">
                      +{formatCurrency(monthlyStats.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Pengeluaran Bulan Ini
                    </p>
                    <p className="text-[16px] font-bold text-rose-600">
                      -{formatCurrency(monthlyStats.expense)}
                    </p>
                  </div>
                  <div className="col-span-2 pt-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Saldo Bulan Kemarin
                    </p>
                    <p className="text-[16px] font-bold text-slate-700">
                      {formatCurrency(item.balance * 0.92)} 
                      <span className="text-[10px] font-medium text-emerald-500 ml-2">
                            8.2%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* 3. BUDGET DETAIL */}
          {isBudget &&
            (() => {
              const pct = getPercentage(item.spent, item.limit);

              const isDanger = pct >= 100;
              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white/20",
                        item.bg,
                        item.color,
                      )}
                    >
                      <IconRenderer name={item.icon} size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <OwnerAvatar
                        ownerId={item.owner}
                        size={8}
                        teamData={team}
                      />
                      <Badge variant={isDanger ? "danger" : "success"}>
                        {isDanger ? "Bocor" : "Aman"}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[12px] font-bold text-slate-400 flex items-center gap-1 mb-6 uppercase tracking-wider">
                    <Clock size={12} />
                    PERIOD: {item.period}
                  </p>
                  <ProgressBar
                    percent={pct}
                    colorClass={isDanger ? "bg-rose-500" : "bg-blue-600"}
                    label={`Terpakai: ${formatCurrency(item.spent)}
`}
                    labelRight={`Batas: ${formatCurrency(item.limit)}
`}
                  />
                </>
              );
            })()}
          {/* 4. HUTANG DETAIL */}
          {isDebt &&
            (() => {
              const isHutang = item.type === "payable";

              const pct = getPercentage(item.paid, item.amount);
              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-white",
                        isHutang ? "bg-rose-600" : "bg-emerald-600",
                      )}
                    >
                      {isHutang ? (
                        <ArrowDownLeft size={28} />
                      ) : (
                        <ArrowUpRight size={28} />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <OwnerAvatar
                        ownerId={item.owner}
                        size={8}
                        teamData={team}
                      />
                      <Badge variant={isHutang ? "danger" : "success"}>
                        {isHutang ? "Hutang" : "Piutang"}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-1 pr-14">
                    {item.title}
                  </h3>
                  <p className="text-[13px] font-bold text-slate-400 flex items-center gap-1 mb-6 uppercase tracking-wider">
                    <User size={12} />
                    {isHutang ? "KEPADA:" : "DARI:"}
                    <span className="text-slate-900">{item.person}</span>
                  </p>
                  <p className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-6 font-outfit">
                    {formatCurrency(item.amount)}
                  </p>
                  <ProgressBar
                    percent={pct}
                    colorClass={isHutang ? "bg-rose-600" : "bg-emerald-600"}
                    label={`Dibayar: ${formatCurrency(item.paid)}
`}
                    labelRight={`Sisa: ${formatCurrency(Math.max(0, item.amount - item.paid))}
`}
                  />
                </>
              );
            })()}
          {/* 5. TUGAS & AKTIVITAS */}
          {(isTask || isAct) &&
            (() => {
              const modalIsDeadline = isTask && item.priority === "Tinggi";
              const modalIsRegularTask = isTask && !modalIsDeadline;
              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                        modalIsDeadline
                          ? "bg-rose-500 animate-pulse"
                          : modalIsRegularTask
                            ? "bg-emerald-500"
                            : item.color || "bg-blue-600"
                      )}
                    >
                      {modalIsDeadline ? (
                        <AlertCircle size={28} />
                      ) : modalIsRegularTask ? (
                        <CheckCircle size={28} />
                      ) : (
                        <CalendarIcon size={28} />
                      )}
                    </div>
                    <OwnerAvatar ownerId={item.owner} size={9} teamData={team} />
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="default"
                      className={cn(
                        "font-extrabold uppercase tracking-widest text-[9px] px-2.5 border",
                        modalIsDeadline
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : modalIsRegularTask
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                      )}
                    >
                      {modalIsDeadline ? "🚨 PERINGATAN" : modalIsRegularTask ? "📝 TUGAS" : item.type || item.category || "KEGIATAN"}
                    </Badge>
                    {item.priority && (
                      <Badge
                        variant={
                          item.priority === "Tinggi"
                            ? "danger"
                            : item.priority === "Sedang"
                              ? "warning"
                              : "info"
                        }
                        icon={AlertCircle}
                      >
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-[22px] font-extrabold text-slate-900 leading-tight mb-3 pr-4">
                    {item.title}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-600 mb-8 leading-relaxed bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/60 italic">
                    "{item.desc || "Tidak ada catatan tambahan."}"
                  </p>
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        {modalIsDeadline ? "🚨 Batas Akhir (Deadline)" : "Waktu Eksekusi"}
                      </span>
                      <span className="font-extrabold text-slate-900 flex items-center gap-2">
                        <Clock size={14} className={modalIsDeadline ? "text-rose-500" : "text-blue-500"} />
                        {formatDate(item.date)}    {item.timeStart || item.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        Lokasi / Referensi
                      </span>
                      <span className="font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin size={14} className="text-rose-500" />
                        {isTask ? "Daftar Tugas (Task List)" : item.location || "Fleksibel"}
                      </span>
                    </div>
                  </div>
                  
                  {isTask && (
                    <button
                      onClick={() => onToggleTaskStatus && onToggleTaskStatus(item.id)}
                      className={cn(
                        "w-full h-[46px] rounded-2xl font-bold text-[13px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-6 shadow-sm border cursor-pointer",
                        item.status === "selesai"
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                      )}
                    >
                      {item.status === "selesai" ? (
                        <>
                          <CircleDashed size={16} strokeWidth={2.5} className="text-slate-400" />
                          Tandai Belum Selesai
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} strokeWidth={2.5} className="text-white" />
                          Tandai Sudah Selesai
                        </>
                      )}
                    </button>
                  )}
                </>
              );
            })()}

        </div>
        {/* FILTER AREA (Khusus Kantong & Budget) */}
        {(isPocket || isBudget) && (
          <div className="mb-6 flex flex-col gap-4 px-1">
            {/* HEADER & FILTERS */}
            <SectionHeader 
              title="Riwayat" 
              icon={History} 
              count={filteredHistory.length}
              className="mb-1"
              rightContent={
                <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  {[
                    {
                      id: "all",
                      label: "Semua",
                      icon: Filter,
                      color: "text-blue-500",
                      activeBg: "bg-blue-600",
                    },
                    {
                      id: "income",
                      label: "Masuk",
                      icon: Banknote,
                      color: "text-emerald-500",
                      activeBg: "bg-emerald-600",
                    },
                    {
                      id: "expense",
                      label: "Keluar",
                      icon: Receipt,
                      color: "text-rose-500",
                      activeBg: "bg-rose-600",
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setLocalType(t.id)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all outline-none flex items-center justify-center gap-1.5",
                        localType === t.id
                          ? `${t.activeBg} text-white shadow-sm shadow-blue-500/10`
                          : "text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      <t.icon
                        size={11}
                        className={localType === t.id ? "text-white" : t.color}
                        strokeWidth={2}
                      />
                      <span className="inline">{t.label}</span>
                    </button>
                  ))}
                </div>
              }
            />
            {/* SEARCH & MONTH */}
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-[16px] py-3 pl-11 pr-4 text-[13px] font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all shadow-sm"
                />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
                >
                  <X size={10} />
                </button>
              )}
            </div>
            {groupedHistory.length > 0 ? (
              groupedHistory.map(([dateLabel, group]: any, idx: number) => (
                <div key={`group-hist-${idx}`} className="mb-6">
                  <div className="flex justify-between items-end mb-3 px-1">
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                      {dateLabel}
                    </h3>
                    <div className="flex gap-2 text-[10px] font-bold">
                      {group.totalIncome > 0 && (
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          +{formatCurrency(group.totalIncome)}
                        </span>
                      )}
                      {group.totalExpense > 0 && (
                        <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                          -{formatCurrency(group.totalExpense)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {group.items.map((trx: any) => (
                      <TransactionCard
                        key={`hist-${trx.id}`}
                        trx={trx}
                        team={team}
                        budgets={budgets}
                        onOpenDetail={onOpenDetail}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Archive size={32} />
                </div>
                <p className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Tidak Ada Data
                  <br />
                  <span className="text-[10px] font-bold normal-case text-slate-300">
                    Riwayat belum tersedia
                    {localSearch && ` untuk "${localSearch}"`}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
        {/* COMMENTS CARD CONTAINER (Hanya Tampil di Transaksi & Aktivitas, Sesuai Request) */}
        {(isTrx || isAct) && (
          <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)] border border-slate-200 mb-8 relative z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-extrabold text-slate-900 flex items-center gap-2 shrink-0">
                <MessageCircle size={17} className="text-blue-500" />
                <span>Komentar</span>
              </h3>
              <button
                onClick={() => {
                  if (onOpenComments) onOpenComments(type, item.id);
                }}
                className="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer group"
                title="Buka Chat Obrolan"
              >
                <MessageSquare size={13} className="text-blue-500 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="text-[9.5px] font-extrabold tracking-wider uppercase">
                  {hasComments ? `Balas Komen (${item.comments.length})` : 'Tulis Komen'}
                </span>
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {hasComments ? (
                <>
                  <div className="space-y-4">
                    {/* Subtle link if there are older comments */}
                    {item.comments.length > 3 && (
                      <div 
                        onClick={() => {
                          if (onOpenComments) onOpenComments(type, item.id);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer pb-2 hover:underline w-fit mx-auto"
                      >
                        <span>Lihat komentar sebelumnya...</span>
                      </div>
                    )}
                    
                    {/* Sliced Comments list */}
                    {item.comments.slice(-3).map((c: any, i: number) => {
                      const isMe = c.sender === "u1";
                      return (
                        <div 
                          key={`comment-${i}`} 
                          className={cn(
                            "flex items-end gap-2.5 w-full animate-in fade-in slide-in-from-bottom-2 duration-205", 
                            isMe ? "flex-row-reverse justify-start" : "justify-start"
                          )}
                        >
                          {/* Avatar */}
                          <OwnerAvatar ownerId={c.sender} size={7} teamData={team} className="shrink-0 mb-0.5" />
                          
                          {/* Chat Bubble */}
                          <div
                            className={cn(
                              "px-4 py-2.5 shadow-sm border transition-all max-w-[72%]",
                              isMe
                                ? "bg-[#0066ff] border-transparent text-white rounded-[20px] rounded-br-[4px] shadow-blue-500/5"
                                : "bg-slate-50 border-slate-200/50 text-slate-800 rounded-[20px] rounded-bl-[4px]"
                            )}
                          >
                            {!isMe && (
                              <span className="text-[11px] font-extrabold text-blue-605 block mb-1">
                                {getMemberNameSafe(team, c.sender)}
                              </span>
                            )}
                            <p className={cn("text-[13px] font-medium leading-relaxed break-words", isMe ? "text-white" : "text-slate-700")}>
                              {c.text}
                            </p>
                            {/* Sub timestamp inside bubble */}
                            <span className={cn("text-[9px] font-semibold block mt-1 text-right tracking-tight opacity-75", isMe ? "text-blue-100/90" : "text-slate-400")}>
                              {c.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => {
                    if (onOpenComments) onOpenComments(type, item.id);
                  }}
                  className="text-center py-10 bg-slate-50 hover:bg-slate-100/40 rounded-[24px] border border-slate-200/60 shadow-sm cursor-pointer transition-all flex flex-col items-center justify-center group active:scale-[0.99]"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare size={16} />
                  </div>
                  <p className="text-[12px] font-extrabold text-slate-800 tracking-wide">
                    Belum Ada Komentar
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium px-4">
                    Ketuk untuk menulis komentar pertama
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>



    </div>
  );
};
// ==========================================
// 4. TAB VIEWS
// ==========================================
const HomeView = ({
  data,
  activeOwner,
  onOpenDetail,
  onOpenNotif,
  onOpenProfile,
  onOpenComments,
}: any) => {
  const isAll = activeOwner === "all";

  const activeTrx = data.transactions.filter(
    (t) => isAll || t.owner === activeOwner || t.owner === "shared",
  );

  const activePockets = data.pockets.filter(
    (p) => isAll || p.owner === activeOwner || p.owner === "shared",
  );

  const activeDebts = data.debts.filter(
    (d) =>
      (isAll || d.owner === activeOwner || d.owner === "shared") &&
      d.type === "payable",
  );

  const totalBalance = activePockets.reduce((sum, p) => sum + p.balance, 0);

  const totalIncome = activeTrx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = activeTrx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const activeName =
    activeOwner === "all"
      ? "Dashboard Keluarga"
      : activeOwner === "u1"
        ? data.user.name
        : `Profil ${data.team.members.find((m) => m.id === activeOwner)?.name}
`;

  const urgentReminders = [
    ...activeDebts
      .filter((d) => d.status === "Mendesak")
      .map((d) => ({
        id: `d-${d.id}
`,
        title: d.title,
        desc: `Jatuh tempo: ${formatDate(d.dueDate)}
`,
        icon: AlertTriangle,
        color: "text-rose-600",
        bg: "bg-rose-50",
      })),
    ...(data.tasks || [])
      .filter(
        (t) =>
          (isAll || t.owner === activeOwner || t.owner === "shared") &&
          t.priority === "Tinggi",
      )
      .map((t) => ({
        id: `t-${t.id}
`,
        title: t.title,
        desc: t.desc,
        icon: Bell,
        color: "text-amber-600",
        bg: "bg-amber-50",
      })),
  ];
  return (
    <div className="pb-32 animate-in fade-in duration-300">
      <div className="px-6 mt-4 mb-2">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">
          Selamat Datang, {data.user.name}
        </h2>
        <p className="text-[13px] font-bold text-slate-500 mt-1 leading-relaxed">
          Pantau ringkasan <span className="text-blue-600">{activeName}</span>
          secara real-time.{" "}
        </p>
      </div>
      <div className="px-5 mt-5">
        <div className="bg-white rounded-[22px] shadow-sm text-slate-900 relative overflow-hidden p-6 border border-slate-200 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] -translate-y-1/3 translate-x-1/3"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 uppercase tracking-wider w-fit shadow-sm mb-2 inline-block">
                  Total Saldo Aktif
                </span>
                <h2 className="text-[34px] font-bold tracking-tight leading-none font-outfit text-slate-900">
                  {formatCurrency(totalBalance)}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Pemasukan Bulan Ini
                </p>
                <p className="text-[15px] font-black text-emerald-600 font-outfit">
                  +{formatCurrency(totalIncome)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Pengeluaran Bulan Ini
                </p>
                <p className="text-[15px] font-black text-rose-600 font-outfit">
                  -{formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {urgentReminders.length > 0 && (
        <div className="px-5 mt-8 text-slate-900">
          <SectionHeader 
            title="Pengingat Penting" 
            icon={Bell} 
            action="Lihat Semua"
          />
          <div className="flex flex-col gap-3">
            {urgentReminders.map((rem) => (
              <div
                key={rem.id}
                className="bg-white rounded-[22px] p-5 border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-blue-200 cursor-pointer group active:scale-[0.98]"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    rem.bg,
                    rem.color,
                  )}
                >
                  <rem.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-slate-900 leading-tight mb-1">
                    {rem.title}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {rem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 text-slate-900">
        <div className="px-5 mb-4">
          <SectionHeader 
            title="Transaksi Terbaru" 
            icon={Clock} 
            action="Lihat Semua"
          />
        </div>
        <div className="flex flex-col px-5">
          {activeTrx.filter((t) => t.isToday).length > 0 ? (
            activeTrx
              .filter((t) => t.isToday)
              .map((trx) => (
                <TransactionCard
                  key={`home-trx-${trx.id}`}
                  trx={trx}
                  team={data.team}
                  budgets={data.budgets}
                  onOpenDetail={onOpenDetail}
                  onOpenComments={onOpenComments}
                />
              ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-[20px]">
              <p className="text-[12px] font-bold text-slate-500">
                Belum ada transaksi hari ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// --- Komponen Analisis ---
const AnalysisTab = ({ transactions, budgets }: any) => {
  // Income vs Expense Data
  const statsData = [
    { name: "Jan", income: 4500000, expense: 3200000 },
    { name: "Feb", income: 5200000, expense: 4100000 },
    { name: "Mar", income: 4800000, expense: 3800000 },
    { name: "Apr", income: 6100000, expense: 4900000 },
    { name: "Mei", income: 5550000, expense: 4230000 },
  ];

  // Spending by Category
  const categoryData = useMemo(() => {
    const counts: any = {};
    transactions
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        counts[t.category] = (counts[t.category] || 0) + t.amount;
      });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#6366f1",
  ];

  // Budget vs Reality
  const budgetData = budgets
    .map((b: any) => ({ name: b.name, limit: b.limit, spent: b.spent }))
    .slice(0, 5);
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      {/* Overview Chart */}
      <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm">
        <SectionHeader 
          title="Tren Arus Kas" 
          subtitle="5 Bulan Terakhir"
          icon={PieChartIcon}
        />
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={statsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ fontSize: "11px", fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorInc)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-slate-500">
              Pemasukan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold text-slate-500">
              Pengeluaran
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm">
          <SectionHeader 
            title="Distribusi Pengeluaran" 
            icon={PieChartIcon}
          />
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-[10px] font-bold text-slate-500 truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Budget vs Actual */}
        <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm">
          <SectionHeader 
            title="Kepatuhan Budget" 
            icon={Target}
          />
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetData}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: "bold" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="spent"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="limit"
                  fill="#f1f5f9"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2 italic font-medium">
            * Menampilkan 5 budget teratas bulan ini
          </p>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[22px] p-6 text-white overflow-hidden relative group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-400" size={18} />
            <h4 className="text-[14px] font-bold tracking-wide uppercase opacity-80">
              AI Insight
            </h4>
          </div>
          <p className="text-[15px] font-medium leading-relaxed mb-4 opacity-90">
            "Pengeluaran kategori{" "}
            <span className="text-blue-400 font-bold">Makan & Minum</span>
            meningkat 12% dibanding bulan lalu. Namun, Anda berhasil menghemat
            15% di <span className="text-emerald-400 font-bold">Hiburan</span>.
            Teruskan tren positif ini!"{" "}
          </p>
          <button className="text-[12px] font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors">
            Tanya AI Lebih Lanjut <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
// --- View Keuangan Lengkap ---
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const FinanceView = ({
  data,
  activeOwner,
  activeMonth,
  setActiveMonth,
  onOpenDetail,
  requestDelete,
  showMessage,
  onOpenNotif,
  onNav,
  onOpenComments,
}: any) => {
  const [finTab, setFinTab] = useState("transaksi");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDragOffset, setFilterDragOffset] = useState(0);
  const [isFilterDragging, setIsFilterDragging] = useState(false);
  const [filterSheetHeight, setFilterSheetHeight] = useState(85); // 85vh or 95vh
  const filterDragStartY = useRef(0);

  useEffect(() => {
    if (!isFilterDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (e.cancelable) e.preventDefault(); // Lock browser scroll & bounce completely!
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - filterDragStartY.current;
      setFilterDragOffset(deltaY);
    };

    const onEnd = () => {
      setIsFilterDragging(false);
      if (filterDragOffset > 150) {
        setShowFilterModal(false);
        setFilterDragOffset(0);
      } else if (filterDragOffset < -80) {
        setFilterSheetHeight(95);
        setFilterDragOffset(0);
      } else if (filterSheetHeight === 95 && filterDragOffset > 100) {
        setFilterSheetHeight(85);
        setFilterDragOffset(0);
      } else {
        setFilterDragOffset(0);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isFilterDragging, filterDragOffset, filterSheetHeight]);

  const activeName =
    activeOwner === "all"
      ? "Semua Rekening"
      : activeOwner === "u1"
        ? data.user.name
        : "Rekening Bersama";

  const tabs = [
    { id: "transaksi", label: "Transaksi", icon: History, color: "blue" },
    { id: "kantong", label: "Kantong", icon: Wallet, color: "emerald" },
    { id: "budget", label: "Budget", icon: PieChartIcon, color: "orange" },
    { id: "hutang", label: "Hutang", icon: UserMinus, color: "rose" },
    { id: "analisis", label: "Analisis", icon: BarChartIcon, color: "purple" },
  ];

  const [trxFilter, setTrxFilter] = useState<string[]>(["all"]);
  const [timeRange, setTimeRange] = useState("month");
  const [pocketFilter, setPocketFilter] = useState<string[]>(["all"]);
  const [budgetFilter, setBudgetFilter] = useState<string[]>(["all"]);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = (list: string[], setList: any, id: string) => {
    if (id === "all") {
      setList(["all"]);
    } else {
      let newList = list.filter((item) => item !== "all");
      if (newList.includes(id)) {
        newList = newList.filter((item) => item !== id);
        if (newList.length === 0) newList = ["all"];
      } else {
        newList.push(id);
      }
      setList(newList);
    }
  };

  const isAll = activeOwner === "all";

  const baseFilteredTrx = data.transactions.filter(
    (t: any) => isAll || t.owner === activeOwner || t.owner === "shared",
  );

  const monthFilteredTrx = baseFilteredTrx.filter((t: any) => {
    const d = new Date(t.date);
    return d.getMonth() === activeMonth;
  });

  const activeFilteredTrx = baseFilteredTrx.filter((t: any) => {
    const d = new Date(t.date);
    
    // 1. Time Range
    let matchesTime = true;
    if (timeRange === "month") {
      matchesTime = d.getMonth() === activeMonth;
    } else if (timeRange === "week") {
      matchesTime = t.isToday || (t.dateInt && t.dateInt >= 4);
    }

    // 2. Type
    const matchesType = trxFilter.includes("all") || trxFilter.includes(t.type);

    // 3. Pocket
    const matchesPocket = pocketFilter.includes("all") || pocketFilter.includes(t.pocket);

    // 4. Budget
    const matchesBudget = budgetFilter.includes("all") || budgetFilter.includes(t.category);

    // 5. Search
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTime && matchesType && matchesPocket && matchesBudget && matchesSearch;
  });

  const activePockets = data.pockets.filter((p: any) => {
    const matchesOwner =
      isAll || p.owner === activeOwner || p.owner === "shared";

    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bank.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOwner && matchesSearch;
  });

  const activeBudgets = data.budgets.filter((b: any) => {
    const matchesOwner =
      isAll || b.owner === activeOwner || b.owner === "shared";

    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOwner && matchesSearch;
  });

  const activeDebts = data.debts.filter((d: any) => {
    const matchesOwner =
      isAll || d.owner === activeOwner || d.owner === "shared";

    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOwner && matchesSearch;
  });

  const syncedPockets = activePockets.map((p: any) => {
    const inAmt = baseFilteredTrx
      .filter((t: any) => t.pocket === p.name && t.type === "income")
      .reduce((s: any, t: any) => s + t.amount, 0);

    const outAmt = baseFilteredTrx
      .filter((t: any) => t.pocket === p.name && t.type === "expense")
      .reduce((s: any, t: any) => s + t.amount, 0);
    return { ...p, balance: (p.balance || 0) + inAmt - outAmt };
  });

  const syncedBudgets = activeBudgets.map((b: any) => {
    const spent = baseFilteredTrx
      .filter((t: any) => {
        const d = new Date(t.date);
        return d.getMonth() === activeMonth && t.category === b.category && t.type === "expense";
      })
      .reduce((s: any, t: any) => s + t.amount, 0);
    return { ...b, spent };
  });

  const groupedTransactions = useMemo(() => {
    const groups: any = {};
    activeFilteredTrx.forEach((trx: any) => {
      const dateLabel = trx.isToday ? "Hari Ini" : formatDate(trx.date);
      if (!groups[dateLabel])
        groups[dateLabel] = {
          dateInt: trx.dateInt,
          dateRaw: new Date(trx.date).getTime(),
          totalIncome: 0,
          totalExpense: 0,
          items: [],
        };
      groups[dateLabel].items.push(trx);
      if (trx.type === "income") groups[dateLabel].totalIncome += trx.amount;
      if (trx.type === "expense") groups[dateLabel].totalExpense += trx.amount;
    });
    return Object.entries(groups).sort(
      (a: any, b: any) => b[1].dateRaw - a[1].dateRaw,
    );
  }, [activeFilteredTrx]);

  const monthlyIncome = monthFilteredTrx
    .filter((t: any) => t.type === "income")
    .reduce((s: any, t: any) => s + t.amount, 0);

  const monthlyExpense = monthFilteredTrx
    .filter((t: any) => t.type === "expense")
    .reduce((s: any, t: any) => s + t.amount, 0);
  return (
    <div className="pb-40 pt-2 animate-in fade-in duration-300 relative">
      <div className="px-5 mb-2">
        <div className="bg-white rounded-[22px] p-5 shadow-sm border border-slate-200 relative overflow-hidden transition-all duration-300">
          
          <div className="relative z-10 text-slate-900">
            {/* Top row: date + month picker */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 bg-orange-50/50 border border-orange-100 px-3 py-1 rounded-full shadow-sm">
                <CalendarIcon size={12} className="text-orange-500" />
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-blue-50/50 border border-blue-100 rounded-full p-0.5 shadow-sm">
                <button
                  onClick={() => setActiveMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 transition-all active:scale-90"
                >
                  <ChevronLeft size={14} className="text-blue-600" />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 px-2">
                  {MONTH_NAMES[activeMonth]}
                </span>
                <button
                  onClick={() => setActiveMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 transition-all active:scale-90"
                >
                  <ChevronRight size={14} className="text-blue-600" />
                </button>
              </div>
            </div>
            
            {/* Main Balance Area */}
            <div className="relative mb-2">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Total Saldo
                  </p>
                </div>
                <h2 className="text-[28px] font-bold tracking-tighter font-outfit leading-none text-slate-900 mb-1">
                  {formatCurrency(syncedPockets.reduce((sum, p) => sum + p.balance, 0))}
                </h2>
                
                {(() => {
                  const totalNow = syncedPockets.reduce((sum, p) => sum + p.balance, 0);
                  const prevBalance = totalNow - monthlyIncome + monthlyExpense;
                  const changePercent = prevBalance > 0 ? ((totalNow - prevBalance) / prevBalance * 100) : 0;
                  const isUp = changePercent >= 0;
                  const currentDay = new Date().getDate();
                  const dailyAvg = monthlyExpense / (currentDay || 1);
                  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome * 100) : 0;
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", isUp ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500")}>
                            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          </div>
                          <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">Saldo Bulan Lalu:</span>
                          <span className="text-[11px] font-bold text-slate-700">{formatCurrency(prevBalance)}</span>
                          <span className={cn("text-[10px] font-black", isUp ? "text-emerald-500" : "text-rose-500")}>
                            {isUp ? "+" : "-"} {Math.abs(changePercent).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bottom Stats (Kinerja Bulan Ini) */}
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {/* Column 1: Pemasukan */}
              <div className="bg-emerald-50 rounded-[16px] p-2.5 shadow-sm border border-emerald-200/60 group transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.98]">
                <div>
                  <div className="w-6.5 h-6.5 rounded-full bg-white/90 border border-emerald-100 flex items-center justify-center mb-1.5 shadow-sm">
                    <TrendingUp size={12} className="text-emerald-600" />
                  </div>
                  <span className="px-1 py-0.5 rounded-md text-[7px] font-extrabold text-slate-700 bg-white border border-slate-200 uppercase tracking-wider w-fit shadow-sm mb-1 inline-block whitespace-nowrap">
                    Masuk {MONTH_NAMES[activeMonth]}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12.5px] font-black text-emerald-600 font-outfit leading-tight tracking-tighter whitespace-nowrap overflow-visible">
                  +{formatCurrency(monthlyIncome)}
                </p>
              </div>

              {/* Column 2: Pengeluaran */}
              <div className="bg-rose-50 rounded-[16px] p-2.5 shadow-sm border border-rose-200/60 group transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.98]">
                <div>
                  <div className="w-6.5 h-6.5 rounded-full bg-white/90 border border-rose-100 flex items-center justify-center mb-1.5 shadow-sm">
                    <TrendingDown size={12} className="text-rose-600" />
                  </div>
                  <span className="px-1 py-0.5 rounded-md text-[7px] font-extrabold text-slate-700 bg-white border border-slate-200 uppercase tracking-wider w-fit shadow-sm mb-1 inline-block whitespace-nowrap">
                    Keluar {MONTH_NAMES[activeMonth]}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12.5px] font-black text-rose-600 font-outfit leading-tight tracking-tighter whitespace-nowrap overflow-visible">
                  -{formatCurrency(monthlyExpense)}
                </p>
              </div>

              {/* Column 3: Sisa */}
              <div className="bg-amber-50 rounded-[16px] p-2.5 shadow-sm border border-amber-200/60 group transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.98]">
                <div>
                  <div className="w-6.5 h-6.5 rounded-full bg-white/90 border border-amber-100 flex items-center justify-center mb-1.5 shadow-sm">
                    <PieChartIcon size={12} className="text-amber-600" />
                  </div>
                  <span className="px-1 py-0.5 rounded-md text-[7px] font-extrabold text-slate-700 bg-white border border-slate-200 uppercase tracking-wider w-fit shadow-sm mb-1 inline-block whitespace-nowrap">
                    Total {MONTH_NAMES[activeMonth]}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12.5px] font-black text-amber-600 font-outfit leading-tight tracking-tighter whitespace-nowrap overflow-visible">
                  {formatCurrency(monthlyIncome - monthlyExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-40 w-full shrink-0 backdrop-blur-md bg-[#f1f5f9]/80 border-b border-slate-200/50">
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-5 py-3">
          {tabs.map((t) => {
            const isActive = finTab === t.id;
            const colors: any = {
              blue: "bg-blue-50 text-blue-600 border-blue-200 shadow-blue-500/10",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-500/10",
              orange: "bg-orange-50 text-orange-600 border-orange-200 shadow-orange-500/10",
              rose: "bg-rose-50 text-rose-600 border-rose-200 shadow-rose-500/10",
              purple: "bg-purple-50 text-purple-600 border-purple-200 shadow-purple-500/10",
            };
            return (
              <button
                key={t.id}
                onClick={() => setFinTab(t.id)}
                className={cn(
                  "px-4.5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 shrink-0 flex-none whitespace-nowrap shadow-sm",
                  isActive
                    ? `${colors[t.color] || colors.blue} border-current/20`
                    : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50",
                )}
              >
                <t.icon size={12} strokeWidth={2.5} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-5 relative pt-2">
        {/* TRANSAKSI */}
        {finTab === "transaksi" && (
          <div className="flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="mb-3">
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cari transaksi atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-[18px] py-3.5 pl-11 pr-24 text-[13px] font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className={cn(
                      "p-2.5 rounded-xl transition-all flex items-center gap-1.5",
                      (!trxFilter.includes("all") || timeRange !== "month" || !budgetFilter.includes("all"))
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/50"
                    )}
                  >
                    <SlidersHorizontal size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {groupedTransactions.length > 0 ? (
              groupedTransactions.map(([dateLabel, group], idx) => (
                <div
                  key={`group-${idx}`}
                  className="mb-4"
                >
                  <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                      {dateLabel}
                    </h3>
                    <div className="flex gap-2 text-[10px] font-bold">
                      {group.totalIncome > 0 && (
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          +{formatCurrency(group.totalIncome)}
                        </span>
                      )}
                      {group.totalExpense > 0 && (
                        <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                          -{formatCurrency(group.totalExpense)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {group.items.map((trx) => (
                      <TransactionCard
                        key={`trx-${trx.id}`}
                        trx={trx}
                        team={data.team}
                        budgets={data.budgets}
                        onOpenDetail={onOpenDetail}
                        onOpenComments={onOpenComments}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50 flex flex-col items-center mt-4">
                <Receipt size={32} className="text-slate-300 mb-2" />
                <p className="text-[13px] font-bold text-slate-600">
                  Transaksi Kosong
                </p>
              </div>
            )}
          </div>
        )}
        {/* KANTONG */}
        {finTab === "kantong" && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100 border-dashed flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors text-blue-600 mb-2">
              <Plus size={18} />
              <span className="text-[13px] font-bold">Buat Kantong Baru</span>
            </div>
            {syncedPockets.map((pocket) => (
              <div
                key={`pocket-${pocket.id}`}
                onClick={() => onOpenDetail(pocket, "pocket")}
                className="bg-white rounded-[22px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <OwnerAvatar
                    ownerId={pocket.owner}
                    size={8}
                    teamData={data.team}
                  />
                  <Badge
                    variant={
                      pocket.status === "Aman"
                        ? "success"
                        : pocket.status === "Aktif"
                          ? "info"
                          : pocket.status === "Bertumbuh"
                            ? "success"
                            : "danger"
                    }
                  >
                    {pocket.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      pocket.bg,
                      pocket.color,
                    )}
                  >
                    <IconRenderer name={pocket.icon} size={24} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {pocket.name}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <CreditCard size={12} />
                      {pocket.accountNo || "ID Tersembunyi"}
                    </p>
                  </div>
                </div>
                <p className="text-[28px] font-bold text-slate-900 tracking-tight mb-4">
                  {formatCurrency(pocket.balance)}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <RefreshCw size={10} />
                    Sync: {pocket.syncStatus || "Real-time"}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {(
                      (pocket.balance /
                        syncedPockets.reduce((s, p) => s + p.balance, 0)) *
                      100
                    ).toFixed(1)}
                    % dari Total
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* BUDGET */}
        {finTab === "budget" && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100 border-dashed flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors text-blue-600 mb-2">
              <Plus size={18} />
              <span className="text-[13px] font-bold">Buat Budget Baru</span>
            </div>
            {syncedBudgets.map((b) => {
              const pct = getPercentage(b.spent, b.limit);

              const isWarning = pct > 80;

              const isDanger = pct >= 100;
              return (
                <div
                  key={`budget-${b.id}`}
                  onClick={() => onOpenDetail(b, "budget")}
                  className="bg-white rounded-[22px] p-5 border border-slate-200 shadow-sm relative cursor-pointer transition-all group active:scale-[0.98]"
                >
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <OwnerAvatar
                      ownerId={b.owner}
                      size={6}
                      teamData={data.team}
                    />
                    <Badge
                      variant={
                        isDanger ? "danger" : isWarning ? "warning" : "success"
                      }
                    >
                      {isDanger
                        ? "Melebihi Batas"
                        : isWarning
                          ? "Hampir Habis"
                          : "Aman"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-4 pr-10">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        b.bg,
                        b.color,
                      )}
                    >
                      <IconRenderer name={b.icon} size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {b.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 border",
                            getCategoryColor(b.category),
                          )}
                        >
                          <Tag size={10} strokeWidth={2.5} />
                          {b.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-1.5 mt-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      Terpakai: {formatCurrency(b.spent)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Sisa{" "}
                      {formatCurrency(Math.max(0, b.limit - b.spent))}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full overflow-hidden h-2.5 shadow-inner border border-slate-200/50">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        isDanger
                          ? "bg-rose-500"
                          : isWarning
                            ? "bg-amber-500"
                            : "bg-blue-500",
                      )}
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <CalendarClock size={10} />
                      Reset dlm {b.resetDays || 26} hari
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* HUTANG */}
        {finTab === "hutang" && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100 border-dashed flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors text-blue-600 mb-2">
              <Plus size={18} />
              <span className="text-[13px] font-bold">
                Catat Hutang / Piutang Baru
              </span>
            </div>
            <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-[22px] shadow-sm">
              <div>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold text-amber-700 bg-amber-50 border border-amber-200 uppercase tracking-wider w-fit shadow-sm mb-1 inline-block">
                  Total Harus Dibayar
                </span>
                <p className="text-[22px] font-bold text-slate-900 font-outfit">
                  {formatCurrency(
                    activeDebts
                      .filter((d) => d.type === "payable")
                      .reduce((s, d) => s + (d.amount - d.paid), 0),
                  )}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
            </div>
            {activeDebts.map((debt) => {
              const isHutang = debt.type === "payable";

              const pct = getPercentage(debt.paid, debt.amount);

              const daysLeft = getDaysDiff(debt.dueDate);

              const isOverdue = new Date(debt.dueDate) < new Date("2026-05-04");
              return (
                <div
                  key={`debt-${debt.id}`}
                  onClick={() => onOpenDetail(debt, "debt")}
                  className="bg-white rounded-[22px] p-5 border border-slate-200 shadow-sm relative cursor-pointer transition-all group active:scale-[0.98]"
                >
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <OwnerAvatar
                      ownerId={debt.owner}
                      size={6}
                      teamData={data.team}
                    />
                    <Badge
                      variant={
                        isOverdue
                          ? "danger"
                          : debt.status === "Mendesak"
                            ? "warning"
                            : "success"
                      }
                    >
                      {isOverdue ? "Jatuh Tempo" : debt.status}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <div className="flex gap-1.5 mb-2">
                      <Badge
                        variant={isHutang ? "danger" : "success"}
                        className="inline-flex"
                      >
                        {isHutang ? "Hutang" : "Piutang"}
                      </Badge>
                      {debt.refId && (
                        <Badge
                          variant="default"
                          className="inline-flex bg-slate-50 border-slate-100"
                          icon={Hash}
                        >
                          {debt.refId}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-900 leading-tight pr-20 group-hover:text-blue-600 transition-colors">
                      {debt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                      <User size={12} />
                      {isHutang ? "Ke:" : "Dari:"}
                      <b>{debt.person}</b>
                    </p>
                  </div>
                  <ProgressBar
                    percent={pct}
                    colorClass={isHutang ? "bg-rose-500" : "bg-emerald-500"}
                    label={`Dibayar: ${formatCurrency(debt.paid)}`}
                    labelRight={`Total: ${formatCurrency(debt.amount)}`}
                  />
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">
                        Sisa:{" "}
                        <span
                          className={
                            isHutang ? "text-rose-600" : "text-emerald-600"
                          }
                        >
                          {formatCurrency(debt.amount - debt.paid)}
                        </span>
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1",
                        isOverdue
                          ? "bg-rose-50 text-rose-600"
                          : "bg-slate-50 text-slate-500",
                      )}
                    >
                      <CalendarIcon size={12} />
                      {isOverdue
                        ? "Terlewat!"
                        : `${daysLeft} Hari Lagi`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ANALISIS */}
        {finTab === "analisis" && (
          <AnalysisTab
            transactions={monthFilteredTrx}
            budgets={syncedBudgets}
          />
        )}
        {/* REFINED FILTER MODAL */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[400] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0" onClick={() => setShowFilterModal(false)} />
            <div
              style={{
                height: `${filterSheetHeight}vh`,
                transform: `translateY(${filterDragOffset > 0 ? filterDragOffset : 0}px)`,
                transition: isFilterDragging ? "none" : "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="relative w-full max-w-md bg-[#f8fafc] rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200"
            >
              
              {/* iOS Drag Notch & Header Premium (High Contrast / Staggered Layout) */}
              <div 
                className="bg-slate-50 border-b border-slate-200/80 shrink-0 cursor-grab active:cursor-grabbing select-none pb-4 relative"
                onMouseDown={(e) => {
                  setIsFilterDragging(true);
                  filterDragStartY.current = e.clientY;
                }}
                onTouchStart={(e) => {
                  setIsFilterDragging(true);
                  filterDragStartY.current = e.touches[0].clientY;
                }}
              >
                {/* iOS Drag Notch */}
                <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />

                {/* Floating Close Button (Absolute in top-left) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilterModal(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm active:scale-95 transition-all"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {/* Centered Title Row (Offset vertically to let close button sit higher) */}
                <div className="text-center px-16 mt-4.5">
                  <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
                    Pengaturan Filter
                  </h3>
                </div>
              </div>

              {/* Scrollable Content */}
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto px-7 py-6 space-y-5 hide-scrollbar pb-32"
              >
                
                {/* 1. TIPE TRANSAKSI (MULTI) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 px-1">Tipe Transaksi</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "Semua", icon: Filter, activeClass: "bg-blue-600 border-blue-600 text-white shadow-blue-500/20" },
                      { id: "income", label: "Masuk", icon: TrendingUp, activeClass: "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-emerald-500/10" },
                      { id: "expense", label: "Keluar", icon: TrendingDown, activeClass: "bg-rose-50 border-rose-200 text-rose-600 shadow-rose-500/10" }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleFilter(trxFilter, setTrxFilter, item.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                          trxFilter.includes(item.id) 
                            ? item.activeClass 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        <item.icon size={14} strokeWidth={2.5} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. TANGGAL (WAKTU) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 px-1">Rentang Waktu</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "Semua Waktu", icon: Archive, activeClass: "bg-slate-800 border-slate-800 text-white shadow-slate-900/10" },
                      { id: "today", label: "Hari Ini", icon: Sparkles, activeClass: "bg-amber-50 border-amber-200 text-amber-600 shadow-amber-500/10" },
                      { id: "week", label: "Minggu Ini", icon: Clock, activeClass: "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-indigo-500/10" },
                      { id: "month", label: "Bulan Ini", icon: CalendarIcon, activeClass: "bg-blue-50 border-blue-200 text-blue-600 shadow-blue-500/10" }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setTimeRange(item.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                          timeRange === item.id 
                            ? item.activeClass 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        <item.icon size={14} strokeWidth={2.5} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. BUDGET (MULTI) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 px-1">Kategori Budget</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleFilter(budgetFilter, setBudgetFilter, "all")}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                        budgetFilter.includes("all") ? "bg-orange-600 border-orange-600 text-white shadow-orange-500/20" : "bg-white border-slate-200 text-slate-500"
                      )}
                    >
                      Semua Kategori
                    </button>
                    {data.budgets.map((b: any) => (
                      <button
                        key={b.id}
                        onClick={() => toggleFilter(budgetFilter, setBudgetFilter, b.category)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                          budgetFilter.includes(b.category) ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm" : "bg-white border-slate-200 text-slate-500"
                        )}
                      >
                        <PieChartIcon size={12} />
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. KANTONG (MULTI) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 px-1">Pilih Kantong</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleFilter(pocketFilter, setPocketFilter, "all")}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                        pocketFilter.includes("all") ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20" : "bg-white border-slate-200 text-slate-500"
                      )}
                    >
                      Semua Kantong
                    </button>
                    {data.pockets.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => toggleFilter(pocketFilter, setPocketFilter, p.name)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm",
                          pocketFilter.includes(p.name) ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm" : "bg-white border-slate-200 text-slate-500"
                        )}
                      >
                        <Wallet size={12} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Compact - Matched with Navbot */}
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="px-5 pt-3 pb-5 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]"
              >
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="w-full bg-blue-600 text-white h-[46px] rounded-2xl font-bold text-[14px] shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} strokeWidth={3} />
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// --- View Aktivitas (GOOGLE CALENDAR STYLE TIMELINE) ---
const ActivityView = ({
  data,
  activeOwner,
  onOpenDetail,
  onOpenNotif,
  onOpenComments,
  onToggleTaskStatus,
}: any) => {
  const [selectedDate, setSelectedDate] = useState(4);
  const [actSearch, setActSearch] = useState("");
  const [actFilter, setActFilter] = useState("all"); // "all" | "trx" | "event" | "task"
  const [showFilterModal, setShowFilterModal] = useState(false);

  const activeName =
    activeOwner === "all"
      ? "Semua Rekening"
      : activeOwner === "u1"
        ? data.user.name
        : "Rekening Bersama";

  const isAll = activeOwner === "all";

  const activeTrx = (data.transactions || []).filter(
    (t) =>
      (isAll || t.owner === activeOwner || t.owner === "shared") &&
      t.isActivity,
  );

  const activeActs = (data.activities || []).filter(
    (a) => isAll || a.owner === activeOwner || a.owner === "shared",
  );

  const activeTasks = (data.tasks || []).filter(
    (t) => isAll || t.owner === activeOwner || t.owner === "shared",
  );

  const rawTimelineData = [
    ...activeTrx.map((t) => ({
      id: `act-trx-${t.id}`,
      owner: t.owner,
      title: t.title,
      timeStart: t.time || "00:00",
      location: t.location || "",
      type: "Makan",
      desc: `Tercatat ${formatCurrency(t.amount)}`,
      color: "bg-orange-500",
      dateInt: t.dateInt || 4,
      isTask: false,
      comments: t.comments,
      refItem: t,
    })),
    ...activeActs.map((a) => ({
      id: `act-evt-${a.id}`,
      owner: a.owner,
      title: a.title,
      timeStart: a.timeStart || "00:00",
      location: a.location || "",
      type: a.type || "Aktivitas Harian",
      desc: a.desc,
      color: a.color || "bg-blue-500",
      dateInt: a.dateInt || 4,
      isTask: false,
      comments: a.comments,
      refItem: a,
    })),
    ...activeTasks.map((t) => ({
      id: `act-tsk-${t.id}`,
      owner: t.owner,
      title: t.title,
      timeStart: t.time || "00:00",
      location: "Daftar Tugas",
      type: "Kerja",
      desc: t.desc,
      color:
        t.priority === "Tinggi"
          ? "bg-rose-500"
          : t.category === "Pekerjaan"
            ? "bg-blue-600"
            : "bg-amber-500",
      dateInt: t.dateInt || 4,
      isTask: true,
      status: t.status,
      priority: t.priority,
      category: t.category,
      comments: t.comments,
      refItem: t,
    })),
  ]
    .filter((item) => item.dateInt === selectedDate)
    .sort((a, b) => (b.timeStart || "").localeCompare(a.timeStart || ""));

  // Filter based on search input & category filter pill
  const timelineData = rawTimelineData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(actSearch.toLowerCase()) ||
      (item.desc || "").toLowerCase().includes(actSearch.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(actSearch.toLowerCase());
    
    const matchesFilter =
      actFilter === "all" ||
      (actFilter === "trx" && item.id.startsWith("act-trx-")) ||
      (actFilter === "event" && item.id.startsWith("act-evt-")) ||
      (actFilter === "task" && item.id.startsWith("act-tsk-"));
      
    return matchesSearch && matchesFilter;
  });

  const densityMap = useMemo(() => {
    const map = {};
    [...activeTrx, ...activeActs, ...activeTasks].forEach((t) => {
      const dInt = t.dateInt || 4;
      if (!map[dInt]) map[dInt] = [];

      const bgClass =
        (t.color || "").split(" ").find((c) => c.startsWith("bg-")) ||
        (t.priority ? "bg-amber-500" : "bg-blue-500");
      map[dInt].push(bgClass || "bg-blue-500");
    });
    return map;
  }, [activeTrx, activeActs, activeTasks]);

  return (
    <div className="pb-32 animate-in fade-in duration-300 bg-[#f1f5f9] min-h-screen">
      <div className="sticky top-0 z-40 bg-[#f1f5f9]/95 backdrop-blur-md border-b border-slate-200/50 px-5 pt-3.5 pb-2.5">
        <DailyDateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          itemsMap={densityMap}
        />
      </div>
      <div className="mt-3.5 animate-in slide-in-from-right-4 duration-300">
        {/* Search Bar & Advanced Inline Filters */}
        <div className="px-5 mb-4">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Cari jadwal, tugas, atau kegiatan..."
              value={actSearch}
              onChange={(e) => setActSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[18px] py-3.5 pl-11 pr-24 text-[13px] font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all shadow-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {actSearch && (
                <button
                  onClick={() => setActSearch("")}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => setShowFilterModal(true)}
                className={cn(
                  "p-2.5 rounded-xl transition-all flex items-center justify-center",
                  actFilter !== "all" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/50"
                )}
              >
                <SlidersHorizontal size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {timelineData.length > 0 ? (
          <div className="flex flex-col relative pl-[92px] pr-5 gap-4 mt-4 pb-10">
            {/* Garis Vertikal Stylized - gradien 2 warna padat (abu-abu di atas, putih di bawah) tanpa transparan */}
            <div className="absolute left-[72px] top-4 bottom-[20px] w-[2px] bg-gradient-to-b from-slate-300 via-slate-300 to-white z-0 rounded-full"></div>
            {/* Mapping ActivityCardItem */}
            {timelineData.map((act) => (
              <ActivityCardItem
                key={act.id}
                act={act}
                team={data.team}
                onOpenDetail={onOpenDetail}
                onOpenComments={onOpenComments}
                onToggleTaskStatus={onToggleTaskStatus}
              />
            ))}
          </div>
        ) : (
          <div className="mx-5 text-center py-12 border-2 border-dashed border-slate-200 rounded-[24px] bg-white flex flex-col items-center">
            <CalendarIcon size={32} className="text-slate-300 mb-2" />
            <p className="text-[13px] font-bold text-slate-600">
              Jadwal Kosong
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Tidak ada jadwal atau kegiatan yang cocok.
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM SHEET FILTER AKTIVITAS */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0" onClick={() => setShowFilterModal(false)} />
          <div className="relative w-full max-w-md bg-[#f8fafc] rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
            {/* iOS Notch Notch & Header */}
            <div className="bg-slate-50 border-b border-slate-200/80 shrink-0 pb-4 relative">
              <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />
              <button 
                onClick={() => setShowFilterModal(false)}
                className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm active:scale-95 transition-all"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div className="text-center px-16 mt-4.5">
                <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
                  Filter Jadwal & Kegiatan
                </h3>
              </div>
            </div>

            {/* Scrollable content options */}
            <div className="px-7 py-6 space-y-6 pb-20">
              {/* Category selector */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Kategori Aktivitas</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "all", label: "Semua", icon: Filter, activeClass: "bg-blue-600 border-blue-600 text-white shadow-blue-500/20" },
                    { id: "trx", label: "Transaksi", icon: TrendingUp, activeClass: "bg-orange-600 border-orange-600 text-white shadow-orange-500/20" },
                    { id: "event", label: "Kegiatan", icon: CalendarIcon, activeClass: "bg-blue-600 border-blue-600 text-white shadow-blue-500/20" },
                    { id: "task", label: "Tugas", icon: CheckCircle, activeClass: "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActFilter(item.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95 shadow-sm",
                        actFilter === item.id
                          ? item.activeClass
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <item.icon size={13} strokeWidth={2.5} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Info helper */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Tips Pencarian</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Anda juga dapat mencari jadwal menggunakan kata kunci judul, deskripsi, atau lokasi secara instan pada kolom pencarian halaman utama.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Apply Button */}
            <div className="p-5 bg-white border-t border-slate-100 mt-auto">
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full bg-blue-600 text-white h-[46px] rounded-2xl font-bold text-[13px] shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// --- View Ruang Obrolan Tim ---
const TeamChatView = ({ data }) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-[80px] animate-in fade-in duration-300">
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 rounded-t-[32px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-none">
              Ruang Kita
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                {data.team.members.length}
                Aktif
              </p>
            </div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {data.team.members.slice(0, 3).map((m: any) => (
            <img
              key={m.id}
              src={m.avatar}
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              alt="Mem"
            />
          ))}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4"
      >
        <div className="text-center mb-2">
          <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
            Hari ini
          </span>
        </div>
        {data.chats.map((chat) => {
          const isMe = chat.sender === "u1";
          return (
            <div key={`chat-${chat.id}`} className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "flex max-w-[80%] gap-2",
                  isMe ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div className="shrink-0 mt-auto">
                  <OwnerAvatar
                    ownerId={chat.sender}
                    size={8}
                    teamData={data.team}
                  />
                </div>
                <div
                  className={cn(
                    "p-3 rounded-[18px] shadow-sm relative",
                    isMe
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm",
                  )}
                >
                  {!isMe && (
                    <p className="text-[10px] font-bold text-slate-400 mb-0.5">
                      {getMemberNameSafe(data.team, chat.sender)}
                    </p>
                  )}
                  <p className="text-[14px] leading-relaxed font-medium">
                    {chat.text}
                  </p>
                  <p
                    className={cn(
                      "text-[9px] font-bold mt-1 text-right",
                      isMe ? "text-blue-200" : "text-slate-400",
                    )}
                  >
                    {chat.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-white border-t border-slate-200 absolute bottom-[80px] w-full max-w-md">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm transition-all shrink-0">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            placeholder="Ketik pesan..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-slate-800 placeholder:text-slate-400 px-2"
          />
          <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0">
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
// --- View Profile Lengkap & Pengaturan ---
const ProfileView = ({ data }) => {
  return (
    <div className="pb-32 pt-6 px-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center mb-6 relative overflow-hidden">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md mb-4 relative z-10">
          <img
            src={data.user.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-[20px] font-bold text-slate-900 mb-1 relative z-10">
          {data.user.name}
        </h2>
        <p className="text-[13px] font-medium text-slate-500 mb-3 relative z-10">
          {data.user.email}
        </p>
        <Badge variant="info">{data.user.tier}</Badge>
      </div>
      <div className="mb-6">
        <SectionHeader
          title="Anggota Grup"
          action="Kelola"
          subtitle={`Nama: ${data.team.name}
`}
          className="mt-0"
        />
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
          {data.team.members.map((m) => (
            <div
              key={`member-${m.id}`}
              className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <OwnerAvatar ownerId={m.id} size={10} teamData={data.team} />
              <div className="flex-1">
                <p className="text-[14px] font-bold text-slate-900">
                  {m.name}
                  {m.id === data.user.id && "(Anda)"}
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {m.id === "u1" ? "Admin" : "Anggota"}
                </p>
              </div>
            </div>
          ))}
          <button className="mt-2 w-full bg-white border border-dashed border-blue-300 text-blue-600 font-bold text-[13px] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
            <UserPlus size={16} />
            Undang Anggota Baru{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
// --- FORM TAMBAH PENGELUARAN & PEMASUKAN ---
const AddExpenseForm = ({
  isOpen,
  onClose,
  onSave,
  data,
  type,
  initialData,
}) => {
  const isIncome = type === "income";

  const [amount, setAmount] = useState("");

  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("Konsumsi");

  const [pocket, setPocket] = useState("SeaBank Riki");

  const [method, setMethod] = useState("E-Wallet");

  const [isActivity, setIsActivity] = useState(false);

  const [location, setLocation] = useState("");

  const [date, setDate] = useState("2026-05-04");

  const [time, setTime] = useState("18:00");
  useEffect(() => {
    if (initialData && isOpen) {
      setAmount(initialData.amount);
      setTitle(initialData.title);
      setCategory(initialData.category);
      setPocket(initialData.pocket);
      setMethod(initialData.method || "E-Wallet");
      setIsActivity(initialData.isActivity || false);
      setLocation(initialData.location || "");
      if (initialData.date) setDate(initialData.date.substring(0, 10));
      setTime(initialData.time || "18:00");
    } else if (isOpen) {
      setAmount("");
      setTitle("");
      setIsActivity(false);
      setLocation("");
      setMethod("E-Wallet");
    }
  }, [initialData, isOpen]);
  if (!isOpen) return null;

  const handleSave = () => {
    if (!amount || !title) return alert("Harap isi nominal dan nama!");

    const dateInt = parseInt(date.split("-")[2], 10);

    const newTrx = {
      ...initialData,
      id: initialData ? initialData.id : "t" + Date.now(),
      owner: initialData ? initialData.owner : "u1",
      ref: initialData
        ? initialData.ref
        : `TRX-${Math.floor(Math.random() * 1000)}
X`,
      title: title,
      amount: parseInt(amount) || 0,
      type: isIncome ? "income" : "expense",
      date: new Date(date).toISOString(),
      time: time,
      category: category,
      method: method,
      pocket: pocket,
      icon:
        category === "Konsumsi"
          ? "coffee"
          : category === "Transportasi"
            ? "car"
            : isIncome
              ? "briefcase"
              : "shopping-bag",
      isToday: dateInt === 4,
      dateInt: dateInt,
      isActivity: isActivity,
      location: isActivity ? location : undefined,
      comments: initialData ? initialData.comments : [],
    };
    onSave(newTrx, type, initialData ? "edit" : "add");
  };
  return (
    <div className="absolute inset-0 z-[410] flex flex-col bg-white sm:rounded-b-[40px] sm:rounded-t-none border border-slate-200 animate-in slide-in-from-right-full duration-300">
      <header className="sticky top-0 w-full bg-[#f8fafc] z-50 shrink-0 pb-4 relative border-b border-slate-200/80">
        {/* iOS Notch Handle */}
        <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />
        {/* Close Button on the Left */}
        <button
          onClick={onClose}
          className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 active:scale-95 transition-all shadow-sm outline-none hover:text-slate-600"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
        {/* Centered Title */}
        <div className="text-center px-16 mt-4.5">
          <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
            {initialData ? "Edit" : "Catat"} {isIncome ? "Pemasukan" : "Pengeluaran"}
          </h2>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-[22px] mb-6 border border-slate-200 shadow-sm">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total {isIncome ? "Pemasukan" : "Pengeluaran"}
          </p>
          <div className="flex items-center gap-1 text-slate-900">
            <span className="text-[20px] font-bold mt-2">Rp</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent border-none outline-none text-[48px] font-bold w-full max-w-[200px] text-center placeholder:text-slate-300"
              autoFocus
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Nama {isIncome ? "Pemasukan" : "Pengeluaran"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isIncome ? "Cth: Gaji Bulanan" : "Cth: Makan Nasi Goreng"
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none appearance-none"
              >
                {isIncome ? (
                  <>
                    <option value="Pekerjaan">Pekerjaan</option>
                    <option value="Investasi">Investasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Belanja">Belanja</option>
                    <option value="Transportasi">Transportasi</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Metode
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none appearance-none"
              >
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Debit Card">Debit Card</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="ShopeePay">ShopeePay</option>
                <option value="GoPay">GoPay</option>
                <option value="Cash">Cash / Tunai</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[12px] font-bold text-slate-600">
              Sumber Dana
            </label>
            <select
              value={pocket}
              onChange={(e) => setPocket(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none appearance-none text-blue-600"
            >
              {data.pockets.map((p) => (
                <option
                  key={`opt-${p.id}`}
                  value={p.name}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {!isIncome && (
            <div className="mt-4 bg-blue-50/50 border border-slate-200 p-4 rounded-[22px] transition-all shadow-sm">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsActivity(!isActivity)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">
                      Catat sebagai Aktivitas?
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tampilkan di Kalender & Dashboard
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative shrink-0",
                    isActivity ? "bg-blue-600" : "bg-slate-300",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      isActivity ? "left-7" : "left-1",
                    )}
                  ></div>
                </div>
              </div>
              {isActivity && (
                <div className="mt-4 pt-4 border-t border-blue-100/50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-blue-700">
                      Nama Lokasi
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Cth: Nasi Goreng Gila Slipi"
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-[13px] font-medium outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-blue-700">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-[13px] font-medium outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-blue-700">
                        Jam
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-[13px] font-medium outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="relative mt-auto w-full px-5 pt-1 pb-2 bg-white border-t border-slate-200 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] mb-[86px]">
        <button
          onClick={handleSave}
          className={cn(
            "w-full text-white font-bold text-[15px] py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-95 transition-all flex justify-center items-center gap-2",
            isIncome
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          <Check size={18} />
          Simpan Data{" "}
        </button>
      </div>
    </div>
  );
};
// --- FORM TAMBAH AKTIVITAS ---
const AddActivityForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");

  const [location, setLocation] = useState("");

  const [date, setDate] = useState("2026-05-04");

  const [timeStart, setTimeStart] = useState("10:00");

  const [timeEnd, setTimeEnd] = useState("11:00");

  const [type, setType] = useState("Keluarga");

  const [desc, setDesc] = useState("");
  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setLocation(initialData.location);
      if (initialData.date) setDate(initialData.date.substring(0, 10));
      setTimeStart(initialData.timeStart || "10:00");
      setTimeEnd(initialData.timeEnd || "11:00");
      setType(initialData.type || "Keluarga");
      setDesc(initialData.desc || "");
    } else if (isOpen) {
      setTitle("");
      setLocation("");
      setDesc("");
      setType("Keluarga");
    }
  }, [initialData, isOpen]);
  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return alert("Harap isi nama!");

    const dateInt = parseInt(date.split("-")[2], 10);
    let colorClass = "bg-blue-500";
    if (type === "Olahraga") colorClass = "bg-emerald-500";
    if (type === "Keluarga") colorClass = "bg-rose-500";
    if (type === "Hiburan") colorClass = "bg-purple-500";
    if (type === "Makan") colorClass = "bg-orange-500";
    if (type === "Belanja") colorClass = "bg-pink-500";

    const newAct = {
      ...initialData,
      id: initialData ? initialData.id : "a" + Date.now(),
      owner: initialData ? initialData.owner : "u1",
      title: title,
      date: new Date(date).toISOString(),
      timeStart: timeStart,
      timeEnd: timeEnd,
      location: location || "TBD",
      type: type,
      desc: desc || "Tidak ada detail tambahan.",
      color: colorClass,
      dateInt: dateInt,
      comments: initialData ? initialData.comments : [],
    };
    onSave(newAct, "activity", initialData ? "edit" : "add");
  };
  return (
    <div className="absolute inset-0 z-[410] flex flex-col bg-white sm:rounded-b-[40px] sm:rounded-t-none border border-slate-200 animate-in slide-in-from-bottom-full duration-300">
      <header className="sticky top-0 w-full bg-[#f8fafc] z-50 shrink-0 pb-4 relative border-b border-slate-200/80">
        {/* iOS Notch Handle */}
        <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />
        {/* Close Button on the Left */}
        <button
          onClick={onClose}
          className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 active:scale-95 transition-all shadow-sm outline-none hover:text-slate-600"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
        {/* Centered Title */}
        <div className="text-center px-16 mt-4.5">
          <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
            {initialData ? "Edit" : "Catat"} Aktivitas Baru
          </h2>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Judul Aktivitas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Nonton Konser, Makan Malam"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Kategori Tipe
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none appearance-none"
              >
                <option value="Keluarga">Keluarga</option>
                <option value="Pekerjaan">Kerja</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Makan">Makan</option>
                <option value="Belanja">Belanja</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Jam Mulai
              </label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Jam Selesai
              </label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Lokasi
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cth: Gelora Bung Karno"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Catatan Khusus
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tambahkan detail jika perlu..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="relative mt-auto w-full px-5 pt-1 pb-2 bg-white border-t border-slate-200 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] mb-[86px]">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white font-bold text-[15px] py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <Check size={18} />
          Simpan Data{" "}
        </button>
      </div>
    </div>
  );
};
// --- FORM TAMBAH TUGAS (TO-DO) ---
const AddTaskForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");

  const [date, setDate] = useState("2026-05-04");

  const [time, setTime] = useState("10:00");

  const [priority, setPriority] = useState("Sedang");

  const [category, setCategory] = useState("Pribadi");

  const [desc, setDesc] = useState("");
  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      if (initialData.date) setDate(initialData.date.substring(0, 10));
      setTime(initialData.time || "10:00");
      setPriority(initialData.priority || "Sedang");
      setCategory(initialData.category || "Pribadi");
      setDesc(initialData.desc || "");
    } else if (isOpen) {
      setTitle("");
      setDesc("");
      setPriority("Sedang");
      setCategory("Pribadi");
    }
  }, [initialData, isOpen]);
  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return alert("Harap isi nama tugas!");

    const dateInt = parseInt(date.split("-")[2], 10);

    const newTask = {
      ...initialData,
      id: initialData ? initialData.id : "tk" + Date.now(),
      owner: initialData ? initialData.owner : "u1",
      title: title,
      date: new Date(date).toISOString(),
      time: time,
      status: initialData ? initialData.status : "belum",
      priority: priority,
      category: category,
      desc: desc || "Tidak ada detail tambahan.",
      dateInt: dateInt,
      comments: initialData ? initialData.comments : [],
    };
    onSave(newTask, "task", initialData ? "edit" : "add");
  };
  return (
    <div className="absolute inset-0 z-[410] flex flex-col bg-white sm:rounded-b-[40px] sm:rounded-t-none border border-slate-200 animate-in slide-in-from-bottom-full duration-300">
      <header className="sticky top-0 w-full bg-[#f8fafc] z-50 shrink-0 pb-4 relative border-b border-slate-200/80">
        {/* iOS Notch Handle */}
        <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />
        {/* Close Button on the Left */}
        <button
          onClick={onClose}
          className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 active:scale-95 transition-all shadow-sm outline-none hover:text-slate-600"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
        {/* Centered Title */}
        <div className="text-center px-16 mt-4.5">
          <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
            {initialData ? "Edit" : "Catat"} Tugas
          </h2>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Judul Tugas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Bayar Listrik, Ambil Laundry"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Tenggat Waktu
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Jam
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none appearance-none"
              >
                <option value="Pribadi">Pribadi</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Kerja">Pekerjaan</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-600">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium outline-none appearance-none"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-600">
              Catatan Khusus
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tambahkan detail jika perlu..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="relative mt-auto w-full px-5 pt-1 pb-2 bg-white border-t border-slate-200 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] mb-[86px]">
        <button
          onClick={handleSave}
          className="w-full bg-amber-500 text-white font-bold text-[15px] py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(245,158,11,0.25)] hover:bg-amber-600 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <Check size={18} />
          Simpan Data{" "}
        </button>
      </div>
    </div>
  );
};
// --- Modal Tambah Cepat (FAB) ---
const QuickAddModal = ({ isOpen, onClose, onOpenForm }) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: "income",
      icon: TrendingUp,
      label: "Pemasukan",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: "expense",
      icon: TrendingDown,
      label: "Pengeluaran",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      id: "activity",
      icon: CalendarIcon,
      label: "Aktivitas",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "task",
      icon: ListTodo,
      label: "Tugas Baru",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];
  return (
    <div className="absolute inset-0 z-[400] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full bg-slate-50 rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col overflow-hidden">
        {/* iOS Notch & Header */}
        <div className="bg-[#f8fafc] border-b border-slate-200/80 shrink-0 pb-4 relative">
          <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-3.5" />
          <button 
            onClick={onClose}
            className="absolute left-5 top-3.5 w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm active:scale-95 transition-all outline-none"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
          <div className="text-center px-16 mt-4.5">
            <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
              Pencatatan Baru
            </h3>
          </div>
        </div>
        <div className="p-6 pt-6 pb-8">
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {actions.map((act, i) => (
            <button
              key={`action-${i}`}
              onClick={() => {
                if (act.id === "expense") onOpenForm("expense");
                else if (act.id === "income") onOpenForm("income");
                else if (act.id === "activity") onOpenForm("activity");
                else if (act.id === "task") onOpenForm("task");
                else onClose();
              }}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] flex items-center justify-center transition-transform group-active:scale-90 shadow-sm border border-slate-100",
                  act.bg,
                  act.color,
                )}
              >
                <act.icon size={28} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};
// ==========================================
// 5. APP CONTAINER
// ==========================================
export default function App() {
  const [data, setData] = useState(INITIAL_DATA);

  const [activeTab, setActiveTab] = useState("home");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeCommentItem, setActiveCommentItem] = useState<{
    type: "transaction" | "activity";
    id: string;
  } | null>(null);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsInputFocused(true);
      }
    };
    const handleBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  // State manajemen Form Edit & Delete
  const [formConfig, setFormConfig] = useState({
    isOpen: false,
    type: null,
    initialData: null,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const [msgBox, setMsgBox] = useState({ isOpen: false, title: "", desc: "" });

  // Detail Modal State (Pengganti Expand Inline)
  const [detailModalConfig, setDetailModalConfig] = useState({
    isOpen: false,
    item: null,
    type: null,
  });

  const [activeOwner, setActiveOwner] = useState("all");

  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());

  // 0-11
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isSwitchViewerOpen, setIsSwitchViewerOpen] = useState(false);

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleSaveData = (newData, type, mode = "add") => {
    const collection =
      type === "expense" || type === "income"
        ? "transactions"
        : type === "task"
          ? "tasks"
          : "activities";
    setData((prev) => {
      const updatedCollection =
        mode === "edit"
          ? prev[collection].map((item) =>
              item.id === newData.id ? newData : item,
            )
          : [newData, ...prev[collection]];
      return { ...prev, [collection]: updatedCollection };
    });
    setFormConfig({ isOpen: false, type: null, initialData: null });
    setActiveTab(
      type === "activity" || type === "task" ? "activity" : "finance",
    );
  };
  const requestDelete = (collection, id, onComplete) => {
    setDetailModalConfig({ isOpen: false, item: null, type: null });

    setConfirmDialog({
      isOpen: true,
      message:
        "Data yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?",
      onConfirm: () => {
        setData((prev) => ({
          ...prev,
          [collection]: prev[collection].filter((item) => item.id !== id),
        }));
        if (onComplete) onComplete();
        setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
      },
    });
  };
  const handleEdit = (type, item) => {
    setDetailModalConfig({ isOpen: false, item: null, type: null });

    setFormConfig({ isOpen: true, type, initialData: item });
  };
  const handleToggleTaskStatus = (taskId: string) => {
    setData((prev) => {
      const updatedTasks = (prev.tasks || []).map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "selesai" ? "belum" : "selesai";
          const updated = { ...task, status: newStatus };
          
          // Also update the active detail modal item if it is this task
          setDetailModalConfig((prevModal) => {
            if (prevModal.isOpen && prevModal.item && prevModal.item.id === taskId) {
              return { ...prevModal, item: updated };
            }
            return prevModal;
          });
          
          return updated;
        }
        return task;
      });
      return { ...prev, tasks: updatedTasks };
    });
  };
  const openDetailModal = (item, type) => {
    setDetailModalConfig({ isOpen: true, item, type });
  };
  const showMessage = (title, desc) => setMsgBox({ isOpen: true, title, desc });

  const getHeaderTitle = () => {
    if (activeTab === "finance") return "Keuangan";
    if (activeTab === "activity") return "Jadwal & Tugas";
    if (activeTab === "team") return null;
    if (activeTab === "profile") return "Pengaturan";
    return null;
  };

  const selectedCommentItem = (() => {
    if (!activeCommentItem) return null;
    const { type, id } = activeCommentItem;
    if (type === "transaction") {
      return data.transactions.find((t: any) => t.id === id);
    }
    if (type === "activity") {
      let act = data.activities?.find((a: any) => `act-evt-${a.id}` === id || a.id === id);
      if (act) return act;
      let task = data.tasks?.find((t: any) => `act-tsk-${t.id}` === id || t.id === id);
      if (task) return task;
      let trx = data.transactions?.find((t: any) => `act-trx-${t.id}` === id || t.id === id);
      if (trx) return trx;
    }
    return null;
  })();

  const handleAddComment = (text: string) => {
    if (!activeCommentItem || !text.trim()) return;
    const { type, id } = activeCommentItem;
    const newCommentObj = {
      sender: "u1",
      text: text.trim(),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setData((prev) => {
      if (type === "transaction") {
        const updatedTrxs = prev.transactions.map((t: any) => {
          if (t.id === id) {
            return { ...t, comments: [...(t.comments || []), newCommentObj] };
          }
          return t;
        });
        return { ...prev, transactions: updatedTrxs };
      }
      if (type === "activity") {
        const updatedActs = (prev.activities || []).map((a: any) => {
          if (`act-evt-${a.id}` === id || a.id === id) {
            return { ...a, comments: [...(a.comments || []), newCommentObj] };
          }
          return a;
        });
        const updatedTasks = (prev.tasks || []).map((t: any) => {
          if (`act-tsk-${t.id}` === id || t.id === id) {
            return { ...t, comments: [...(t.comments || []), newCommentObj] };
          }
          return t;
        });
        const updatedTrxs = (prev.transactions || []).map((t: any) => {
          if (`act-trx-${t.id}` === id || t.id === id) {
            return { ...t, comments: [...(t.comments || []), newCommentObj] };
          }
          return t;
        });
        return { ...prev, activities: updatedActs, tasks: updatedTasks, transactions: updatedTrxs };
      }
      return prev;
    });

    showMessage("Komentar berhasil ditambahkan!", "success");
  };

  return (
    <div className="h-[100dvh] w-screen bg-slate-900 overflow-hidden">
      <div className="w-full max-w-md mx-auto bg-white h-full relative shadow-2xl flex flex-col shadow-slate-900/40">
        {activeTab !== "team" && (
          <AppHeader
            title={getHeaderTitle() || "Family Hub"}
            teamData={data.team}
            onOpenNotif={() => setIsNotifOpen(true)}
            onOpenProfile={() => setIsSwitchViewerOpen(!isSwitchViewerOpen)}
            onBack={
              activeTab === "home" || activeTab === "team"
                ? null
                : () => setActiveTab("home")
            }
            variant={activeTab === "home" ? "home" : "centered"}
            isProfileOpen={isSwitchViewerOpen}
          />
        )}
        <main
          className={cn(
            "flex-1 hide-scrollbar relative bg-[#f1f5f9] border-x border-slate-200 shadow-inner transition-all",
            isInputFocused ? "overflow-hidden" : "overflow-y-auto"
          )}
        >
          {activeTab === "home" && (
            <HomeView
              data={data}
              activeOwner={activeOwner}
              onOpenDetail={openDetailModal}
              onOpenNotif={() => setIsNotifOpen(true)}
              onOpenProfile={() => setIsSwitchViewerOpen(true)}
              onOpenComments={(type: any, id: any) => setActiveCommentItem({ type, id })}
            />
          )}
          {activeTab === "finance" && (
            <FinanceView
              data={data}
              activeOwner={activeOwner}
              activeMonth={activeMonth}
              setActiveMonth={setActiveMonth}
              onOpenDetail={openDetailModal}
              requestDelete={requestDelete}
              showMessage={showMessage}
              onOpenNotif={() => setIsNotifOpen(true)}
              onNav={setActiveTab}
              onOpenComments={(type: any, id: any) => setActiveCommentItem({ type, id })}
            />
          )}
          {activeTab === "activity" && (
            <ActivityView
              data={data}
              activeOwner={activeOwner}
              onOpenDetail={openDetailModal}
              onOpenNotif={() => setIsNotifOpen(true)}
              onOpenComments={(type: any, id: any) => setActiveCommentItem({ type, id })}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}
          {activeTab === "team" && <TeamChatView data={data} />}
          {activeTab === "profile" && <ProfileView data={data} />}
        </main>
        <NotificationPanel
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          data={data}
        />
        <QuickAddModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onOpenForm={(type) => {
            setIsAddOpen(false);
            setFormConfig({ isOpen: true, type, initialData: null });
          }}
        />
        <AddExpenseForm
          isOpen={
            (formConfig.type === "expense" || formConfig.type === "income") &&
            formConfig.isOpen
          }
          type={formConfig.type}
          initialData={formConfig.initialData}
          onClose={() => setFormConfig({ isOpen: false, type: null })}
          onSave={handleSaveData}
          data={data}
        />
        <AddActivityForm
          isOpen={formConfig.type === "activity" && formConfig.isOpen}
          initialData={formConfig.initialData}
          onClose={() => setFormConfig({ isOpen: false, type: null })}
          onSave={handleSaveData}
        />
        <AddTaskForm
          isOpen={formConfig.type === "task" && formConfig.isOpen}
          initialData={formConfig.initialData}
          onClose={() => setFormConfig({ isOpen: false, type: null })}
          onSave={handleSaveData}
        />
        <ConfirmModal
          isOpen={confirmDialog.isOpen}
          message={confirmDialog.message}
          onCancel={() => setConfirmDialog({ isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
        />
        <SwitchViewerDropdown
          isOpen={isSwitchViewerOpen}
          onClose={() => setIsSwitchViewerOpen(false)}
          teamData={data.team}
          activeOwner={activeOwner}
          onSelect={(id) => setActiveOwner(id)}
          onOpenProfile={() => setActiveTab("profile")}
        />
        <MessageModal
          isOpen={msgBox.isOpen}
          title={msgBox.title}
          message={msgBox.desc}
          onClose={() => setMsgBox({ isOpen: false })}
        />
        <ItemDetailModal
          isOpen={detailModalConfig.isOpen}
          item={detailModalConfig.item}
          type={detailModalConfig.type}
          onClose={() =>
            setDetailModalConfig({ isOpen: false, item: null, type: null })
          }
          onEdit={handleEdit}
          requestDelete={requestDelete}
          team={data.team}
          transactions={data.transactions}
          budgets={data.budgets}
          showMessage={showMessage}
          onOpenDetail={openDetailModal}
          onToggleTaskStatus={handleToggleTaskStatus}
          onOpenComments={(itemType: any, itemId: any) => {
            setActiveCommentItem({ type: itemType === "expense" || itemType === "income" || itemType === "transfer" ? "transaction" : "activity", id: itemId });
          }}
        />
        {activeCommentItem && (
          <CommentsBottomSheet
            item={selectedCommentItem}
            type={activeCommentItem.type}
            team={data.team}
            budgets={data.budgets}
            onClose={() => setActiveCommentItem(null)}
            onAddComment={handleAddComment}
          />
        )}
        <div className={cn(
          "navbot-container fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-5 pb-safe-offset-2 pt-1.5 pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[420] transition-all duration-300",
          isInputFocused ? "translate-y-28 opacity-0 pointer-events-none" : "translate-y-0"
        )}>
          <div className="flex justify-around items-center h-14">
            {/* Home Tab */}
            <button
              onClick={() => setActiveTab("home")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-[60px] py-1.5 transition-all active:scale-95",
                activeTab === "home" ? "text-blue-600" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <Home
                size={24}
                strokeWidth={activeTab === "home" ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            {/* Finance Tab */}
            <button
              onClick={() => setActiveTab("finance")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-[60px] py-1.5 transition-all active:scale-95",
                activeTab === "finance" ? "text-blue-600" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <CreditCard
                size={24}
                strokeWidth={activeTab === "finance" ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold">Keuangan</span>
            </button>

            {/* Center Squircle Plus Button - Fully Inside Card, No Border */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-[52px] h-[42px] bg-blue-600 hover:bg-blue-700 active:scale-90 transition-all rounded-[14px] flex items-center justify-center text-white shadow-[0_5px_12px_rgba(37,99,235,0.2)] flex-shrink-0"
            >
              <Plus size={30} strokeWidth={2} />
            </button>

            {/* Activity Tab */}
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-[60px] py-1.5 transition-all active:scale-95",
                activeTab === "activity" ? "text-blue-600" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <CalendarIcon
                size={24}
                strokeWidth={activeTab === "activity" ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold">Aktivitas</span>
            </button>

            {/* Obrolan (Chat) Tab */}
            <button
              onClick={() => setActiveTab("team")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-[60px] py-1.5 relative transition-all active:scale-95",
                activeTab === "team" ? "text-blue-600" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <div className="relative">
                <MessageSquare
                  size={24}
                  strokeWidth={activeTab === "team" ? 2.5 : 2}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 border border-white rounded-full animate-pulse"></span>
              </div>
              <span className="text-[10px] font-semibold">Obrolan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
