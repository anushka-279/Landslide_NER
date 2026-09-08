import { useMemo, useState, type ChangeEvent } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  FileText,
  ImagePlus,
  Info,
  LayoutDashboard,
  Layers,
  Map,
  MapPin,
  Menu,
  Navigation,
  Mountain,
  OctagonAlert,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  RefreshCw,
  Route,
  Send,
  ShieldCheck,
  Smartphone,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { villages, rainfallTrend, alerts, reports, riskMeta } from "@/mockData";

const navItems = [
  { id: "map", label: "Risk map", icon: Map },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "reports", label: "Citizen reports", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
] as const;

type View = (typeof navItems)[number]["id"];
type RiskLevel = keyof typeof riskMeta;

function RiskBadge({ level }: { level: string }) {
  const meta = riskMeta[level as RiskLevel] || riskMeta.moderate;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}

function ViewHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <span className="h-px w-5 bg-primary" /> {eyebrow}
        </div>
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.04em] text-slate-800 sm:text-[30px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4b85c] text-[#174d57] shadow-sm">
        <Mountain size={22} strokeWidth={2.4} />
        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#174d57]" />
      </div>
      <div>
        <p className="font-display text-sm font-extrabold leading-tight tracking-[-0.02em] text-black">Dima Hasao</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black">District Control Room</p>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, collapsed, setCollapsed }: { view: View; setView: (view: View) => void; collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  return (
    <aside className={`hidden shrink-0 flex-col bg-[#124b56] text-white transition-all duration-200 lg:flex ${collapsed ? "w-[78px]" : "w-[248px]"}`}>
      <div className={`flex h-[88px] items-center border-b border-white/10 px-5 ${collapsed ? "justify-center px-3" : ""}`}>
        {collapsed ? <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4b85c] text-[#174d57]"><Mountain size={22} /></div> : <Logo />}
      </div>
      <div className="flex-1 px-3 py-6">
        {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100/50">Monitoring</p>}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${active ? "bg-white text-[#124b56] shadow-sm" : "text-teal-50/75 hover:bg-white/10 hover:text-white"} ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && <ChevronRight className="ml-auto" size={15} />}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="mt-9 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white"><span className="h-2 w-2 rounded-full bg-emerald-400" /> System operational</div>
            <p className="text-[11px] leading-relaxed text-teal-100/60">Mock monitoring feed is active for 7 locations across the district.</p>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 p-3">
        <button onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-teal-100/60 hover:bg-white/10 hover:text-white">
          {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /> Collapse menu</>}
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <div className="border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
      <div className="flex gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => setView(item.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${view === item.id ? "bg-[#e7f2f2] text-primary" : "text-slate-500"}`}><Icon size={15} />{item.label}</button>;
        })}
      </div>
    </div>
  );
}

function TopBar({ view, setView }: { view: View; setView: (view: View) => void }) {
  const activeLabel = navItems.find((item) => item.id === view)?.label;
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7 lg:px-9">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f2f2] text-primary lg:hidden"><Menu size={18} /></div>
        <div className="lg:hidden"><Logo /></div>
        <div className="hidden lg:block"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Control room / {activeLabel}</p><p className="mt-1 text-xs text-slate-500">Monday, 24 June 2024 · 09:00 AM IST</p></div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <button onClick={() => setView("alerts")} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-primary"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#cf5f4a] ring-2 ring-white" /></button>
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />
        <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dceced] text-xs font-extrabold text-primary">DM</div><div className="hidden text-left sm:block"><p className="text-xs font-bold text-slate-700">District Monitor</p><p className="text-[10px] text-slate-400">Admin account</p></div></div>
      </div>
    </header>
  );
}

function SummaryCard({ icon: Icon, label, value, note, tone = "teal" }: { icon: LucideIcon; label: string; value: string | number; note: string; tone?: string }) {
  const tones: Record<string, string> = { teal: "bg-[#e7f2f2] text-primary", orange: "bg-[#fff0e6] text-[#d56b26]", red: "bg-[#fce8e8] text-[#c5484d]", blue: "bg-[#eaf0fa] text-[#43699b]" };
  return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 font-display text-[27px] font-extrabold tracking-[-0.04em] text-slate-800">{value}</p></div><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}><Icon size={18} /></div></div><p className="mt-3 text-[11px] text-slate-400">{note}</p></div>;
}

function MapGraphic({ selectedId, onSelect, mapMode, onModeChange, zoom, onZoom }: { selectedId: string; onSelect: (id: string) => void; mapMode: "risk" | "terrain"; onModeChange: (mode: "risk" | "terrain") => void; zoom: number; onZoom: (value: number) => void }) {
  const zoneShapes = [
    { level: "severe", label: "Jatinga corridor", path: "M51 19 C62 16, 72 20, 76 29 C72 37, 65 39, 57 34 C52 30, 48 25, 51 19 Z" },
    { level: "high", label: "NH-27 watch", path: "M16 38 C26 31, 40 34, 49 40 C48 48, 40 53, 29 50 C21 48, 16 45, 16 38 Z" },
    { level: "moderate", label: "Central watch", path: "M42 50 C52 44, 64 46, 72 54 C70 62, 59 66, 49 62 C43 59, 40 55, 42 50 Z" },
  ];
  return <div className="map-shell relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-[#c8ddd9] bg-[#eef7f4] sm:min-h-[500px]">
    <div className="absolute left-4 top-4 z-10 rounded-lg border border-[#c5ddd8] bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#557b7d] shadow-sm">Dima Hasao District <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">· Assam</span></div>
    <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2">
      <div className="flex items-center gap-1 rounded-lg border border-[#c5ddd8] bg-white/90 p-1 shadow-sm">
        <button onClick={() => onModeChange("risk")} className={`map-mode ${mapMode === "risk" ? "map-mode-active" : ""}`}><AlertCircle size={11} /> Risk zones</button>
        <button onClick={() => onModeChange("terrain")} className={`map-mode ${mapMode === "terrain" ? "map-mode-active" : ""}`}><Layers size={11} /> Terrain</button>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-[#c5ddd8] bg-white/90 p-1 shadow-sm">
        <button onClick={() => onZoom(Math.min(1.14, zoom + 0.06))} className="map-control" aria-label="Zoom in">+</button>
        <span className="px-1 text-[10px] font-bold text-slate-400">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoom(Math.max(0.9, zoom - 0.06))} className="map-control" aria-label="Zoom out">−</button>
        <button onClick={() => onZoom(1)} className="map-control" aria-label="Reset zoom"><Navigation size={12} /></button>
      </div>
    </div>
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-md bg-white/80 px-2.5 py-1.5 text-[10px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-[#6eb4c2]" /> Major roads & drainage</div>
    <div className="map-zone-guide absolute bottom-4 right-4 z-10 hidden rounded-lg border border-white/70 bg-white/85 p-2.5 shadow-sm sm:block"><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Zone guide</p><div className="flex gap-2.5 text-[10px] font-semibold text-slate-500"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Severe zone</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" />High zone</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Watch zone</span></div></div>
    <div className="map-viewport" style={{ "--map-scale": zoom } as React.CSSProperties}>
      <svg viewBox="0 0 100 100" className={`map-terrain ${mapMode === "terrain" ? "map-terrain-mode" : ""}`} role="img" aria-label="Interactive risk zone map of Dima Hasao district">
        <defs><filter id="mapShadow"><feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#5d8c88" floodOpacity=".12" /></filter><linearGradient id="terrainFill" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#d9ebe2" /><stop offset="0.52" stopColor="#c1ddd2" /><stop offset="1" stopColor="#a5c7bd" /></linearGradient></defs>
        <path d="M31 8 C39 3, 52 7, 59 12 C68 10, 78 17, 84 25 C88 34, 83 42, 90 51 C87 60, 91 69, 83 77 C73 82, 69 91, 57 90 C48 96, 39 88, 30 91 C20 87, 16 77, 11 70 C13 59, 7 53, 12 44 C10 34, 17 28, 20 20 C24 17, 24 11, 31 8 Z" fill={mapMode === "terrain" ? "url(#terrainFill)" : "#d9ebe2"} stroke="#75a9a0" strokeWidth="1.4" filter="url(#mapShadow)" />
        {zoneShapes.map((zone) => { const meta = riskMeta[zone.level as RiskLevel]; return <g key={zone.level} className={`risk-zone risk-zone-${zone.level}`}><path d={zone.path} fill={meta.color} fillOpacity={mapMode === "risk" ? 0.15 : 0.06} stroke={meta.color} strokeOpacity={mapMode === "risk" ? 0.45 : 0.2} strokeWidth="0.7" /><text x={zone.level === "severe" ? 61 : zone.level === "high" ? 28 : 53} y={zone.level === "severe" ? 27 : zone.level === "high" ? 42 : 56} fontSize="2.25" fontWeight="700" fill={meta.color} textAnchor="middle">{zone.label}</text></g>; })}
        <path className="map-contour" d="M21 28 C35 21, 43 28, 56 21 S76 25, 81 34" /><path className="map-contour" d="M16 48 C27 39, 36 48, 45 42 S66 43, 84 48" /><path className="map-contour" d="M18 66 C31 57, 39 68, 53 59 S72 63, 86 57" /><path className="map-contour" d="M29 82 C38 71, 50 83, 61 72 S77 78, 81 70" />
        <path className="map-river" d="M49 11 C47 25, 54 31, 47 41 C41 52, 51 57, 47 67 C43 76, 52 81, 57 90" /><path className="map-river" d="M75 22 C67 30, 72 40, 65 48 C59 55, 66 65, 62 74" />
        <path className="map-road" d="M12 56 C29 49, 34 56, 47 48 S70 42, 88 52" /><path className="map-road" d="M30 12 C40 26, 39 37, 47 48 S56 69, 57 89" /><path className="map-road" d="M18 72 C35 70, 43 70, 59 73 S76 70, 84 62" />
        {villages.map((village) => { const meta = riskMeta[village.riskLevel]; const active = village.id === selectedId; const urgent = village.riskLevel === "high" || village.riskLevel === "severe"; return <g key={village.id} className={`map-marker ${active ? "active" : ""}`} onClick={() => onSelect(village.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(village.id); }} tabIndex={0} role="button" aria-label={`View ${village.name}, ${meta.label} risk`}>{urgent && <circle className="zone-pulse" cx={village.coordinates.x} cy={village.coordinates.y} r="4.6" stroke={meta.color} />}{active && <circle cx={village.coordinates.x} cy={village.coordinates.y} r="5.6" fill="none" stroke={meta.color} strokeWidth="0.7" strokeDasharray="1 1" /> }<circle cx={village.coordinates.x} cy={village.coordinates.y} r={active ? 4.8 : 4} fill="white" stroke={meta.color} strokeWidth="1.5" /><circle cx={village.coordinates.x} cy={village.coordinates.y} r={active ? 2.8 : 2.2} fill={meta.color} /><text x={village.coordinates.x + 4.5} y={village.coordinates.y + 1.3} fontSize="3.1" fontWeight="700" fill="#315d61">{village.shortName}</text></g>; })}
      </svg>
    </div>
  </div>;
}

function MapView() {
  const [selectedId, setSelectedId] = useState("jatinga");
  const [mapMode, setMapMode] = useState<"risk" | "terrain">("risk");
  const [zoom, setZoom] = useState(1);
  const selected = villages.find((village) => village.id === selectedId) || villages[0];
  return <>
    <ViewHeader eyebrow="Live risk monitoring" title="Risk map" description="A district-wide view of rainfall, slope conditions, and current landslide risk." action={<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500"><RefreshCw size={14} className="text-primary" /> Updated 4 min ago</div>} />
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4"><SummaryCard icon={Users} label="Villages monitored" value="07" note="Across Dima Hasao" /><SummaryCard icon={OctagonAlert} label="High / severe risk" value="03" note="Requires attention" tone="red" /><SummaryCard icon={Route} label="Roads affected" value="03" note="1 blocked · 2 restricted" tone="orange" /><SummaryCard icon={Bell} label="Alerts sent" value="12" note="Since 06:00 AM" tone="blue" /></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_315px]">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-panel sm:p-4"><div className="mb-3 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold text-slate-700"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e7f2f2] text-primary"><MapPin size={13} /></span> Current location risk</div><p className="mt-1 pl-8 text-[10px] text-slate-400">Click a marker to inspect its zone and latest conditions</p></div><div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Low</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Moderate</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" />High</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Severe</span></div></div><MapGraphic selectedId={selectedId} onSelect={setSelectedId} mapMode={mapMode} onModeChange={setMapMode} zoom={zoom} onZoom={setZoom} /></div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Selected location</p><h2 className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em] text-slate-800">{selected.name}</h2></div><RiskBadge level={selected.riskLevel} /></div><div className="mb-5 rounded-xl bg-[#f4f8f7] p-4"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold text-slate-500">Current risk score</p><p className="mt-1 font-display text-4xl font-extrabold tracking-[-0.06em]" style={{ color: riskMeta[selected.riskLevel].color }}>{selected.riskScore}<span className="ml-1 text-sm font-semibold text-slate-400">/ 100</span></p></div><Activity size={22} className="mb-1 text-slate-300" /></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: `${selected.riskScore}%`, backgroundColor: riskMeta[selected.riskLevel].color }} /></div></div><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-slate-100 p-3"><CloudRain size={15} className="mb-2 text-[#5898a0]" /><p className="text-[10px] font-semibold text-slate-400">Rainfall / 24h</p><p className="mt-1 font-display text-lg font-extrabold text-slate-700">{selected.rainfall24h}<span className="ml-1 text-[10px] font-medium text-slate-400">mm</span></p></div><div className="rounded-lg border border-slate-100 p-3"><Mountain size={15} className="mb-2 text-[#5898a0]" /><p className="text-[10px] font-semibold text-slate-400">Slope angle</p><p className="mt-1 font-display text-lg font-extrabold text-slate-700">{selected.slopeAngle}<span className="ml-1 text-[10px] font-medium text-slate-400">degrees</span></p></div></div><div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#f1e6c6] bg-[#fffbef] p-3 text-xs leading-relaxed text-[#806b32]"><Info size={15} className="mt-0.5 shrink-0" /><p><span className="font-bold">Why this level?</span> {selected.explanation}</p></div><div className="mt-5 border-t border-slate-100 pt-4"><div className="flex items-center justify-between text-xs"><span className="text-slate-400">Rainfall last 7 days</span><span className="font-bold text-slate-700">{selected.rainfall7d} mm</span></div><div className="mt-3 flex items-center justify-between text-xs"><span className="text-slate-400">Road status</span><span className={`font-bold ${selected.roadStatus === "Blocked" ? "text-[#c5484d]" : selected.roadStatus === "Restricted" ? "text-[#d56b26]" : "text-[#27856a]"}`}>{selected.roadStatus}</span></div><p className="mt-3 text-[10px] text-slate-400">Last updated today at {selected.updated}</p></div></div>
    </div>
  </>;
}

function OverviewView() {
  return <><ViewHeader eyebrow="District overview" title="Situation overview" description="A quick read of monitored villages, road access, and rainfall patterns." action={<button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0f414a]"><RefreshCw size={14} /> Refresh data</button>} /><div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4"><SummaryCard icon={Users} label="Total villages" value="07" note="100% reporting" /><SummaryCard icon={OctagonAlert} label="High / severe risk" value="03" note="+1 since yesterday" tone="red" /><SummaryCard icon={Route} label="Roads blocked" value="01" note="2 routes restricted" tone="orange" /><SummaryCard icon={Send} label="Active alerts" value="04" note="12 sent today" tone="blue" /></div><div className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-panel"><div className="mb-4 flex items-start justify-between"><div><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Rainfall trend</h2><p className="mt-1 text-xs text-slate-400">District average · last 7 days</p></div><div className="rounded-lg bg-[#e7f2f2] px-3 py-2 text-right"><p className="text-[10px] font-semibold text-slate-400">Today</p><p className="font-display text-lg font-extrabold text-primary">68 mm</p></div></div><div className="h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={rainfallTrend} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}><defs><linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4d9ca4" stopOpacity={0.24} /><stop offset="100%" stopColor="#4d9ca4" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e9eff0" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#91a0a4", fontSize: 10 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#91a0a4", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #dbe7e7", fontSize: 12 }} formatter={(value) => [`${value} mm`, "Rainfall"]} /><Area type="monotone" dataKey="rainfall" stroke="#32838d" strokeWidth={2.5} fill="url(#rainFill)" dot={{ r: 3, fill: "#32838d", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer></div></div><div className="rounded-xl border border-slate-200 bg-white shadow-panel"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Village status</h2><p className="mt-1 text-xs text-slate-400">Latest field and sensor updates</p></div><span className="text-xs font-semibold text-primary">7 locations</span></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"><th className="px-5 py-3">Village</th><th className="px-5 py-3">Risk level</th><th className="px-5 py-3">Road status</th><th className="px-5 py-3">Rainfall / 24h</th><th className="px-5 py-3">Last updated</th></tr></thead><tbody>{villages.map((village) => <tr key={village.id} className="border-b border-slate-50 last:border-0"><td className="px-5 py-3.5 text-xs font-bold text-slate-700">{village.name}</td><td className="px-5 py-3.5"><RiskBadge level={village.riskLevel} /></td><td className="px-5 py-3.5 text-xs font-semibold"><span className={village.roadStatus === "Blocked" ? "text-[#c5484d]" : village.roadStatus === "Restricted" ? "text-[#d56b26]" : "text-[#27856a]"}>{village.roadStatus}</span></td><td className="px-5 py-3.5 text-xs text-slate-500">{village.rainfall24h} mm</td><td className="px-5 py-3.5 text-xs text-slate-400">Today, {village.updated}</td></tr>)}</tbody></table></div></div></>;
}

function ReportsView() {
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) setPhotoPreview(URL.createObjectURL(file)); };
  return <><ViewHeader eyebrow="Community reporting" title="Citizen reports" description="Capture observations from residents and field teams to support local response." action={<div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 4 reports this week</div>} /><div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(330px,.9fr)]"><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel sm:p-6"><div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f2f2] text-primary"><FileText size={18} /></div><div><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Submit a new report</h2><p className="text-xs text-slate-400">Reports are reviewed by the district control room.</p></div></div><div className="space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Location</span><select required className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"><option value="">Select a village</option>{villages.map((village) => <option key={village.id}>{village.name}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Report type</span><select required className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"><option value="">What did you observe?</option><option>Crack in road</option><option>Slope movement</option><option>Blocked road</option><option>Other</option></select></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Short description</span><textarea required rows={4} placeholder="Describe what you saw and when..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/10" /></label><div><span className="mb-1.5 block text-xs font-bold text-slate-600">Photo evidence <span className="font-normal text-slate-400">(optional)</span></span><label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#a7c8c6] bg-[#f8fcfb] p-3 transition hover:bg-[#f0f8f6]"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">{photoPreview ? <img src={photoPreview} alt="Report preview" className="h-full w-full rounded-lg object-cover" /> : <ImagePlus size={18} />}</div><div><p className="text-xs font-bold text-slate-600">{photoPreview ? "Photo attached" : "Attach a photo"}</p><p className="mt-0.5 text-[10px] text-slate-400">JPG or PNG, up to 10 MB</p></div><Upload size={15} className="ml-auto text-slate-400" /><input type="file" accept="image/png,image/jpeg" onChange={handlePhoto} className="hidden" /></label></div></div><button type="submit" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-[#0f414a]"><Send size={16} /> Submit report</button>{submitted && <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#e8f6ee] p-3 text-xs font-semibold text-[#27856a]"><CheckCircle2 size={15} /> Report saved for review. Thank you for helping keep the district safe.</div>}</form><div className="rounded-xl border border-slate-200 bg-white shadow-panel"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Recent submissions</h2><p className="mt-1 text-xs text-slate-400">Community reports from the last 7 days</p></div><div className="divide-y divide-slate-100">{reports.map((report) => <div key={report.id} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-700">{report.village}</p><p className="mt-1 text-xs text-slate-500">{report.type}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${report.status === "Verified" ? "bg-[#e5f4ef] text-[#27856a]" : "bg-[#fff5d9] text-[#a87c1b]"}`}>{report.status}</span></div><div className="mt-3 flex items-center justify-between text-[10px] text-slate-400"><span>{report.id}</span><span>{report.timestamp}</span></div></div>)}</div></div></div></>;
}

function AlertsView() {
  const [language, setLanguage] = useState("English");
  const [offline, setOffline] = useState(false);
  const sampleText = language === "Assamese" ? "ভূমিস্খলনৰ উচ্চ আশংকাৰ বাবে এই পথ এৰাই চলক।" : language === "Hindi" ? "भारी बारिश के कारण भूस्खलन का खतरा अधिक है। यात्रा से बचें।" : "High landslide risk due to heavy rainfall. Avoid travel until further notice.";
  return <><ViewHeader eyebrow="Public safety communications" title="Alert centre" description="Review sent advisories and prepare clear, multilingual messages for communities." action={<button onClick={() => setOffline(!offline)} className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-bold transition ${offline ? "border-[#e5c66e] bg-[#fff8df] text-[#92701d]" : "border-slate-200 bg-white text-slate-600"}`}><span className={`h-2 w-2 rounded-full ${offline ? "bg-[#d7a92c]" : "bg-slate-300"}`} /> Offline mode {offline ? "on" : "off"}</button>} />{offline && <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#eadcae] bg-[#fff9e7] p-4 text-[#806b32]"><Info size={18} className="mt-0.5 shrink-0" /><div><p className="text-sm font-bold">You’re viewing cached data</p><p className="mt-1 text-xs leading-relaxed">Last synced today at 08:56 AM. Reports will sync automatically when connection returns.</p></div><button onClick={() => setOffline(false)} className="ml-auto rounded p-1 hover:bg-[#f7edc8]"><X size={15} /></button></div>}<div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]"><div className="rounded-xl border border-slate-200 bg-white shadow-panel"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Sent alerts</h2><p className="mt-1 text-xs text-slate-400">Most recent public advisories</p></div><span className="rounded-full bg-[#e7f2f2] px-2.5 py-1 text-[10px] font-bold text-primary">12 total today</span></div><div className="divide-y divide-slate-100">{alerts.map((alert) => <div key={alert.id} className="p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${alert.riskLevel === "severe" ? "bg-[#fce8e8] text-[#c5484d]" : alert.riskLevel === "high" ? "bg-[#fff0e6] text-[#d56b26]" : "bg-[#fff5d9] text-[#a87c1b]"}`}><AlertCircle size={18} /></div><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-slate-700">{alert.village}</p><RiskBadge level={alert.riskLevel} /></div><p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500">{alert.message}</p></div></div><p className="shrink-0 text-[10px] text-slate-400 sm:pt-1">{alert.timestamp}</p></div><div className="mt-4 flex items-center gap-2 pl-12 text-[10px] font-semibold text-slate-400"><span>Delivered via</span>{alert.channels.map((channel) => <span key={channel} className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-slate-500">{channel === "SMS" ? <Phone size={11} /> : <Smartphone size={11} />}{channel}</span>)}</div></div>)}</div></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel"><div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7f2f2] text-primary"><Bell size={18} /></div><div><h2 className="font-display text-base font-extrabold tracking-[-0.03em] text-slate-800">Language preview</h2><p className="text-xs text-slate-400">Preview a translated advisory</p></div></div><div className="mb-4 flex rounded-lg bg-slate-100 p-1">{["English", "Assamese", "Hindi"].map((item) => <button key={item} onClick={() => setLanguage(item)} className={`flex-1 rounded-md px-2 py-2 text-[10px] font-bold transition ${language === item ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}>{item}</button>)}</div><div className="rounded-lg border border-[#d7e8e5] bg-[#f5fbfa] p-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{language} sample</p><p className="text-sm font-semibold leading-relaxed text-slate-700">{sampleText}</p></div><div className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-slate-400"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" /> Translations are reviewed before sending to residents.</div></div></div></>;
}

export default function Index() {
  const [view, setView] = useState<View>("map");
  const [collapsed, setCollapsed] = useState(false);
  const content = useMemo(() => ({ map: <MapView />, overview: <OverviewView />, reports: <ReportsView />, alerts: <AlertsView /> })[view], [view]);
  return <div className="flex min-h-screen bg-[#f6f9fa]"><Sidebar view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} /><div className="flex min-w-0 flex-1 flex-col"><TopBar view={view} setView={setView} /><MobileNav view={view} setView={setView} /><main className="app-grid flex-1 overflow-auto px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9"><div className="mx-auto max-w-[1440px]">{content}</div></main><footer className="hidden border-t border-slate-200 bg-white px-9 py-3 text-[10px] text-slate-400 lg:block"><div className="mx-auto flex max-w-[1440px] items-center justify-between"><span>District Disaster Management Authority · Dima Hasao, Assam</span><span>Prototype dashboard · Mock data for demonstration</span></div></footer></div></div>;
}
