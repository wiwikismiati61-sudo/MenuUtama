/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download, 
  Upload, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Globe,
  Shield,
  Book,
  Users,
  Activity,
  FileText,
  Calendar,
  MessageSquare,
  Briefcase,
  Search,
  Zap,
  Copy,
  ClipboardList,
  FileCheck,
  Award,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppLink {
  id: string;
  title: string;
  url: string;
  displayMode: 'iframe' | 'new_tab';
  color: string;
  icon: string;
}

const ICON_MAP: Record<string, any> = {
  Globe, Shield, Book, Users, Activity, FileText, Calendar, MessageSquare, Briefcase, Zap, Search, ClipboardList, FileCheck, Award, LayoutDashboard
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const APP_COLORS = [
  'from-blue-600 to-blue-800', // Biru
  'from-slate-800 to-black', // Hitam
  'from-slate-300 to-slate-100', // Putih (slightly darker for contrast)
  'from-red-600 to-red-800', // Merah
  'from-pink-500 to-pink-700', // Pink
  'from-emerald-600 to-emerald-800', // Hijau
  'from-amber-700 to-amber-900', // Coklat
];

const EXTERNAL_APPS: any[] = [];

// GANTI LINK DI BAWAH INI DENGAN LINK GAMBAR ANDA YANG SUDAH DIUPLOAD KE INTERNET (misal: imgbb.com, imgur.com, dll)
const KILAS_IMAGE_URL = "https://wsrv.nl/?url=i.ibb.co.com/3yssw38v/Gemini-Generated-Image-gporzagporzagpor.png";
const PETA_IMAGE_URL = "https://wsrv.nl/?url=i.ibb.co.com/VWYCc9Cc/Gemini-Generated-Image-a54l2ma54l2ma54l.png";
const KORELASI_IMAGE_URL = "https://wsrv.nl/?url=i.ibb.co/5wM2Bd4/gambar-3.jpg";

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [links, setLinks] = useState<AppLink[]>([]);
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showKilas, setShowKilas] = useState(true);
  const [showPeta, setShowPeta] = useState(false);
  const [showSpip, setShowSpip] = useState(false);
  const [showKorelasiProgram, setShowKorelasiProgram] = useState(false);
  const [showKorelasi, setShowKorelasi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration for old data
        const migrated = parsed.map((l: any, idx: number) => ({
          ...l,
          displayMode: l.displayMode || 'iframe',
          color: l.color || APP_COLORS[idx % APP_COLORS.length],
          icon: l.icon || 'Globe'
        }));
        setLinks(migrated);
      } catch (e) {
        console.error('Failed to parse links', e);
      }
    } else {
      // Default links
      const defaults: AppLink[] = [
        { id: '1', title: 'Google Search', url: 'https://www.google.com/search?igu=1', displayMode: 'iframe', color: APP_COLORS[0], icon: 'Search' },
        { id: '2', title: 'Wikipedia', url: 'https://en.wikipedia.org', displayMode: 'iframe', color: APP_COLORS[2], icon: 'Book' },
        { id: '3', title: 'AI Studio', url: 'https://aistudio.google.com', displayMode: 'new_tab', color: APP_COLORS[4], icon: 'Zap' },
      ];
      setLinks(defaults);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    if (activeLinkId) {
      const link = links.find(l => l.id === activeLinkId);
      if (link?.displayMode === 'iframe') {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [activeLinkId, links]);

  const activeLink = links.find(l => l.id === activeLinkId);

  const handleLinkClick = (link: AppLink) => {
    setShowKilas(false);
    setShowPeta(false);
    setShowSpip(false);
    setShowKorelasiProgram(false);
    setShowKorelasi(false);
    if (link.displayMode === 'new_tab') {
      window.open(link.url, '_blank');
      setActiveLinkId(link.id); // Still set as active to show selection
    } else {
      setActiveLinkId(link.id);
    }
  };

  const removeLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    if (activeLinkId === id) {
      setActiveLinkId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const backupData = () => {
    const dataStr = JSON.stringify(links, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'dashboard_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setLinks(json);
          if (json.length > 0) setActiveLinkId(json[0].id);
        }
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const copyAppLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasEntered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col items-center p-6 relative font-sans overflow-y-auto overflow-x-hidden">
        {/* Decorative elements */}
        <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-300/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-300/30 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full py-20"
        >
          {/* Header Section */}
          <motion.div 
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-white/60 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] flex items-center justify-center p-4 mb-8 border border-white/50 backdrop-blur-2xl"
          >
            <img 
              src="https://iili.io/KDFk4fI.png" 
              alt="Logo SIAP SPANJU" 
              className="w-full h-full object-contain drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-7xl font-black text-slate-800 tracking-tight mb-4 font-display"
          >
            SIAP SPANJU
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-xl font-bold text-slate-600 uppercase tracking-[0.2em] mb-8"
          >
            Sistem Integrasi Aplikasi Pembinaan Siswa
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 text-base md:text-lg max-w-3xl mb-12 leading-relaxed font-medium"
          >
            Platform terpadu untuk mempermudah pendataan, pemantauan, dan tindak lanjut permasalahan siswa di SMP Negeri 7 Pasuruan.
          </motion.p>

          {/* Combined Info Sections */}
          <div className="space-y-8 w-full">
            {/* 1. Kilas Aplikasi Section */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div className="p-2 md:p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl hover:bg-white/80 transition-all duration-300 flex flex-col items-center justify-center">
                <img 
                  src={KILAS_IMAGE_URL} 
                  alt="Kilas Aplikasi SIAP SPANJU" 
                  className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                />
              </div>
            </motion.div>

            {/* 2. 8 Program Prioritas Section */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div className="p-2 md:p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl flex flex-col items-center justify-center">
                <img 
                  src={PETA_IMAGE_URL} 
                  alt="8 Program Prioritas SMPN 7 Pasuruan" 
                  className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                />
              </div>
            </motion.div>

            {/* 3. 15 Indikator SPIP Section */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                {["https://wsrv.nl/?url=i.ibb.co.com/YFn0zsDJ/Gemini-Generated-Image-ncurlcncurlcncur.png", "https://wsrv.nl/?url=i.ibb.co.com/k2vVysT8/Gemini-Generated-Image-qg440qqg440qqg44.png", "https://wsrv.nl/?url=i.ibb.co.com/ZpFWcqq1/Gemini-Generated-Image-dqdjpdqdjpdqdjpd.png"].map((url, i) => (
                  <div key={i} className="p-4 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl flex flex-col items-center justify-center">
                    <img 
                      src={url} 
                      alt={`15 Indikator SPIP Anti Korupsi - Bagian ${i+1}`} 
                      className="w-full h-auto rounded-xl shadow-sm object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 4. Korelasi Program & SPIP Section */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div className="p-2 md:p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl flex flex-col items-center justify-center">
                <img 
                  src="https://wsrv.nl/?url=i.ibb.co.com/99vdYcf5/Gemini-Generated-Image-kbsmjdkbsmjdkbsm.png" 
                  alt="Korelasi 8 Program Prioritas, 15 Indikator SPIP dengan 9 Aplikasi SIAP SPANJU" 
                  className="w-full max-w-4xl h-auto rounded-2xl shadow-md object-contain"
                />
              </div>
            </motion.div>

            {/* 5. Korelasi SRA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div className="p-2 md:p-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl flex flex-col items-center justify-center">
                <img 
                  src={KORELASI_IMAGE_URL} 
                  alt="Korelasi Integrasi SIAP SPANJU dengan SRA" 
                  className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                />
              </div>
            </motion.div>
          </div>

          {/* Final Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setHasEntered(true);
              setIsSidebarOpen(true);
              setShowKilas(false);
              window.open('https://siap-spanju.vercel.app/', '_blank');
            }}
            className="group relative px-12 py-5 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full font-bold text-xl shadow-[0_10px_40px_-10px_rgba(236,72,153,0.5)] border border-white/50 overflow-hidden mt-8 mb-20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative flex items-center gap-3">
              Buka Menu Aplikasi
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 font-sans overflow-hidden text-slate-800">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (isMobile ? 'calc(100% - 2rem)' : 280) : 0,
          opacity: isSidebarOpen ? 1 : 0,
          x: isMobile && !isSidebarOpen ? '-100%' : 0,
          margin: isMobile ? '1rem' : '0.75rem',
        }}
        className="bg-white/60 backdrop-blur-2xl border-r border-white/50 flex flex-col z-50 fixed md:relative h-[calc(100vh-2rem)] md:h-auto overflow-hidden rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] md:shadow-none"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/50 min-w-[280px]">
          <motion.h1 
            className="flex flex-col gap-0.5 font-display"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-pink-100 rotate-3 overflow-hidden p-1">
                <img 
                  src="https://iili.io/KDFk4fI.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800">SIAP SPANJU</span>
            </div>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em] leading-none ml-10">Sistem Integrasi Aplikasi Pembinaan Siswa</span>
          </motion.h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-white/50 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide min-w-[280px]">
          {/* Kilas Menu */}
          <button
            onClick={() => {
              setShowKilas(true);
              setShowSpip(false);
              setShowPeta(false);
              setShowKorelasiProgram(false);
              setShowKorelasi(false);
              setActiveLinkId(null);
            }}
            className={`
              w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
              ${showKilas 
                ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                : 'hover:bg-white/50 text-slate-600'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 ${showKilas ? 'scale-110 rotate-3 shadow-pink-500/50' : ''}`}>
              <Book size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black tracking-tight truncate text-[20px] uppercase ${showKilas ? 'text-slate-800' : 'text-slate-600'}`}>
                Kilas Aplikasi SIAP SPANJU
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Referensi Dasar</p>
            </div>
          </button>

          {/* Peta Integrasi Menu */}
          <button
            onClick={() => {
              setShowPeta(true);
              setShowSpip(false);
              setShowKilas(false);
              setShowKorelasiProgram(false);
              setShowKorelasi(false);
              setActiveLinkId(null);
            }}
            className={`
              w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
              ${showPeta 
                ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                : 'hover:bg-white/50 text-slate-600'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 ${showPeta ? 'scale-110 rotate-3 shadow-blue-500/50' : ''}`}>
              <LayoutDashboard size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black tracking-tight truncate text-[20px] uppercase ${showPeta ? 'text-slate-800' : 'text-slate-600'}`}>
                8 Program Prioritas
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">SMPN 7 Pasuruan</p>
            </div>
          </button>

          {/* SPIP Menu */}
          <button
            onClick={() => {
              setShowSpip(true);
              setShowPeta(false);
              setShowKorelasiProgram(false);
              setShowKorelasi(false);
              setShowKilas(false);
              setActiveLinkId(null);
            }}
            className={`
              w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
              ${showSpip 
                ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                : 'hover:bg-white/50 text-slate-600'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 ${showSpip ? 'scale-110 rotate-3 shadow-purple-500/50' : ''}`}>
              <Shield size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black tracking-tight truncate text-[20px] uppercase ${showSpip ? 'text-slate-800' : 'text-slate-600'}`}>
                15 Indikator SPIP
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Anti Korupsi</p>
            </div>
          </button>

          {/* Korelasi Program & SPIP Menu */}
          <button
            onClick={() => {
              setShowKorelasiProgram(true);
              setShowSpip(false);
              setShowPeta(false);
              setShowKorelasi(false);
              setShowKilas(false);
              setActiveLinkId(null);
            }}
            className={`
              w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
              ${showKorelasiProgram 
                ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                : 'hover:bg-white/50 text-slate-600'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 ${showKorelasiProgram ? 'scale-110 rotate-3 shadow-orange-500/50' : ''}`}>
              <ClipboardList size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black tracking-tight truncate text-[20px] uppercase ${showKorelasiProgram ? 'text-slate-800' : 'text-slate-600'}`}>
                Korelasi Program
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">SPIP & SIAP SPANJU</p>
            </div>
          </button>

          {/* Korelasi SRA Menu */}
          <button
            onClick={() => {
              setShowKorelasi(true);
              setShowKorelasiProgram(false);
              setShowSpip(false);
              setShowPeta(false);
              setShowKilas(false);
              setActiveLinkId(null);
            }}
            className={`
              w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
              ${showKorelasi 
                ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                : 'hover:bg-white/50 text-slate-600'
              }
            `}
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 ${showKorelasi ? 'scale-110 rotate-3 shadow-emerald-500/50' : ''}`}>
              <Activity size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-black tracking-tight truncate text-[20px] uppercase ${showKorelasi ? 'text-slate-800' : 'text-slate-600'}`}>
                Korelasi SRA
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sekolah Ramah Anak</p>
            </div>
          </button>

          {EXTERNAL_APPS.map((app) => {
            const Icon = ICON_MAP[app.icon] || Globe;
            return (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-white/50 text-slate-600 group"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-pink-500/50`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black tracking-tight truncate text-[20px] uppercase text-slate-600 group-hover:text-slate-800 transition-colors">
                    {app.title}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Aplikasi Eksternal</p>
                </div>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </a>
            );
          })}

          <div className="h-px bg-black/5 mx-2" />

          <div className="space-y-2 pt-1">
            {links.map((link) => {
              const IconComponent = ICON_MAP[link.icon] || Globe;
              return (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => handleLinkClick(link)}
                    className={`
                      w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-300
                      ${activeLinkId === link.id 
                        ? `bg-white/80 shadow-sm translate-y-[-1px] ring-1 ring-white/50` 
                        : 'hover:bg-white/50 text-slate-600'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${link.color || 'from-pink-400 to-blue-500'} flex items-center justify-center text-white shadow-sm shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-black tracking-tight truncate text-sm ${activeLinkId === link.id ? 'text-slate-800' : 'text-slate-600'}`}>
                        {link.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full ${activeLinkId === link.id ? 'bg-pink-100 text-pink-600' : 'bg-slate-200/50 text-slate-500'}`}>
                          {link.displayMode === 'iframe' ? 'Dashboard' : 'Direct'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Quick External Link Icon */}
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded-lg shadow-sm"
                      title="Open in new tab"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </button>
                  
                  <button
                    onClick={(e) => removeLink(link.id, e)}
                    className="absolute -right-1.5 -top-1.5 opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:text-white bg-white hover:bg-rose-500 rounded-lg shadow-lg border border-slate-100 transition-all z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.aside>

      {/* Floating Trigger for Hidden Sidebar */}
      {!isSidebarOpen && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-6 top-6 z-30 p-4 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-2xl text-slate-600 hover:scale-110 hover:text-pink-500 transition-all active:scale-90 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center"
        >
          <Menu size={24} />
        </motion.button>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative p-1.5 md:p-3 md:pl-0">
        <AnimatePresence mode="wait">
          {showPeta ? (
            <motion.div
              key="peta-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto shadow-2xl border border-white/50 p-6 md:p-12 scrollbar-hide"
            >
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl" />
                  <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-pink-100/50 mx-auto rotate-6 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  custom={0}
                  className="p-4 md:p-8 bg-white/80 rounded-[2.5rem] border border-white/50 shadow-xl shadow-blue-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center relative group z-10">
                  
                  <img 
                    src={PETA_IMAGE_URL} 
                    alt="8 Program Prioritas SMPN 7 Pasuruan" 
                    className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : showSpip ? (
            <motion.div
              key="spip-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto shadow-2xl border border-white/50 p-6 md:p-12 scrollbar-hide"
            >
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl" />
                  <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-purple-100/50 mx-auto rotate-6 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8 relative z-10 max-w-4xl mx-auto w-full">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    custom={0}
                    className="p-4 bg-white/80 rounded-[2rem] border border-white/50 shadow-xl shadow-purple-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center group"
                  >
                    <img 
                      src="https://wsrv.nl/?url=i.ibb.co.com/YFn0zsDJ/Gemini-Generated-Image-ncurlcncurlcncur.png" 
                      alt="15 Indikator SPIP Anti Korupsi - Bagian 1" 
                      className="w-full h-auto rounded-xl shadow-sm object-contain"
                    />
                  </motion.div>
                  
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    custom={1}
                    className="p-4 bg-white/80 rounded-[2rem] border border-white/50 shadow-xl shadow-purple-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center group"
                  >
                    <img 
                      src="https://wsrv.nl/?url=i.ibb.co.com/k2vVysT8/Gemini-Generated-Image-qg440qqg440qqg44.png" 
                      alt="15 Indikator SPIP Anti Korupsi - Bagian 2" 
                      className="w-full h-auto rounded-xl shadow-sm object-contain"
                    />
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    custom={2}
                    className="p-4 bg-white/80 rounded-[2rem] border border-white/50 shadow-xl shadow-purple-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center group"
                  >
                    <img 
                      src="https://wsrv.nl/?url=i.ibb.co.com/ZpFWcqq1/Gemini-Generated-Image-dqdjpdqdjpdqdjpd.png" 
                      alt="15 Indikator SPIP Anti Korupsi - Bagian 3" 
                      className="w-full h-auto rounded-xl shadow-sm object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : showKorelasiProgram ? (
            <motion.div
              key="korelasi-program-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto shadow-2xl border border-white/50 p-6 md:p-12 scrollbar-hide"
            >
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl" />
                  <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-orange-100/50 mx-auto rotate-6 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  custom={0}
                  className="p-4 md:p-8 bg-white/80 rounded-[2.5rem] border border-white/50 shadow-xl shadow-orange-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center relative group z-10">
                  
                  <img 
                    src="https://wsrv.nl/?url=i.ibb.co.com/99vdYcf5/Gemini-Generated-Image-kbsmjdkbsmjdkbsm.png" 
                    alt="Korelasi 8 Program Prioritas, 15 Indikator SPIP dengan 9 Aplikasi SIAP SPANJU" 
                    className="w-full max-w-4xl h-auto rounded-2xl shadow-md object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : showKorelasi ? (
            <motion.div
              key="korelasi-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto shadow-2xl border border-white/50 p-6 md:p-12 scrollbar-hide"
            >
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-300/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-teal-300/30 rounded-full blur-3xl" />
                  <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-emerald-100/50 mx-auto rotate-6 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  custom={0}
                  className="p-4 md:p-8 bg-white/80 rounded-[2.5rem] border border-white/50 shadow-xl shadow-emerald-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center relative group z-10">
                  
                  <img 
                    src={KORELASI_IMAGE_URL} 
                    alt="Korelasi Integrasi SIAP SPANJU dengan SRA" 
                    className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                  />
                </motion.div>

                <div className="text-center pt-8">
                  <button 
                    onClick={() => {
                      window.open('https://siap-spanju.vercel.app/', '_blank');
                    }}
                    className="px-10 py-4 bg-white/80 text-slate-800 rounded-2xl font-black shadow-xl hover:scale-105 hover:bg-white transition-all border border-white/80"
                  >
                    Buka Menu Aplikasi
                  </button>
                </div>
              </div>
            </motion.div>
          ) : showKilas ? (
            <motion.div
              key="kilas-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto shadow-2xl border border-white/50 p-6 md:p-12 scrollbar-hide"
            >
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                  <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl" />
                  <div className="w-24 h-24 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-pink-100/50 mx-auto rotate-6 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  custom={0}
                  className="p-4 md:p-8 bg-white/80 rounded-[2.5rem] border border-white/50 shadow-xl shadow-pink-100/30 hover:bg-white transition-all duration-300 hover:border-white/80 hover:-translate-y-1 flex flex-col items-center justify-center relative group">
                  
                  <img 
                    src={KILAS_IMAGE_URL} 
                    alt="Kilas Aplikasi SIAP SPANJU" 
                    className="w-full max-w-3xl h-auto rounded-2xl shadow-md object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : activeLink ? (
            <motion.div 
              key={activeLink.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="flex-1 flex flex-col bg-white/60 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] border border-white/50"
            >
              {/* Toolbar */}
              <div className="h-16 bg-white/40 border-b border-white/50 flex items-center justify-between px-4 md:px-8 z-10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeLink.color || 'from-pink-400 to-blue-400'} flex items-center justify-center text-white shadow-sm`}>
                    {(() => {
                      const IconComponent = ICON_MAP[activeLink.icon] || Globe;
                      return <IconComponent size={20} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none mb-0.5 font-display">{activeLink.title}</h2>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase opacity-70">
                      {activeLink.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 1000);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-all shadow-sm border border-slate-200/50"
                  >
                    <Settings size={18} />
                  </button>
                  <a 
                    href={activeLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-5 py-2.5 bg-gradient-to-r ${activeLink.color || 'from-pink-500 to-blue-500'} text-white rounded-xl hover:brightness-110 transition-all flex items-center gap-2 text-xs font-black shadow-xl shadow-pink-100/50 tracking-widest uppercase`}
                  >
                    <ExternalLink size={16} />
                    <span>Buka Penuh</span>
                  </a>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-white/40 m-2 md:m-4 rounded-[1.5rem] md:rounded-[2rem] shadow-inner overflow-hidden border border-white/50 relative group">
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-[4px] border-pink-100 border-t-pink-500 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={24} className="text-pink-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-800 tracking-tighter">Menyiapkan Aplikasi</p>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sinkronisasi data...</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={activeLink.url}
                  className="w-full h-full border-none"
                  title={activeLink.title}
                  sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-storage-access-by-user-activation"
                />

                {/* Fallback Message */}
                <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-black">
                  <div className="w-24 h-24 bg-white/10 border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center mb-6 rotate-3">
                    {(() => {
                      const IconComponent = ICON_MAP[activeLink.icon] || Globe;
                      return <IconComponent size={48} className="text-indigo-500" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Situs Memblokir Tampilan</h3>
                  <p className="text-slate-400 max-w-md mb-8 text-base font-medium leading-relaxed">
                    Beberapa situs web memiliki kebijakan keamanan yang melarang mereka dibuka di dalam dashboard.
                  </p>
                  <a 
                    href={activeLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-8 py-4 bg-gradient-to-r ${activeLink.color} text-white rounded-xl font-black text-base shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3`}
                  >
                    <ExternalLink size={20} />
                    BUKA DI TAB BARU
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/80 flex items-center justify-center shadow-xl shadow-pink-100/50 mx-auto rotate-3 overflow-hidden p-2 mb-6 border border-white/80 backdrop-blur-md">
                    <img 
                      src="https://iili.io/KDFk4fI.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-display mb-4">Pilih Aplikasi</h2>
                  <p className="text-slate-500 text-lg font-medium">Silakan pilih aplikasi yang ingin Anda buka dari daftar di bawah ini.</p>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {EXTERNAL_APPS.map((app, index) => {
                    const Icon = ICON_MAP[app.icon] || Globe;
                    return (
                      <motion.a
                        key={app.id}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl shadow-slate-200/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center gap-4"
                      >
                        <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          <Icon size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{app.title}</h3>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aplikasi Eksternal</p>
                        </div>
                        <div className="mt-2 px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-slate-600 text-sm font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <ExternalLink size={16} />
                          Buka Aplikasi
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
