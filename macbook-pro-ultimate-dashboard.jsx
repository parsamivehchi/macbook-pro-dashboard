import { useState, useMemo, useCallback } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ZAxis, ReferenceLine
} from "recharts";

/* ═══════════════════════════════════════════════════════════════
   THEME: "Obsidian Editorial" — premium dark, editorial typography
   ═══════════════════════════════════════════════════════════════ */
const G = { M2:"#F59E0B", M3:"#06B6D4", M4:"#A78BFA", M5:"#3B82F6" };
const TR = { Base:"#94A3B8", Pro:"#2DD4BF", Max:"#FB923C" };
const T = {
  bg:"#08080D", card:"#111118", card2:"#16161F", border:"#1E1E2A", border2:"#2A2A3A",
  text:"#EAEAF0", sub:"#8888A0", muted:"#555570", accent:"#3B82F6",
  green:"#34D399", red:"#F87171", amber:"#FBBF24", surface:"#0E0E15",
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const CHIPS=[
  {id:"m2pro-10-16-16",gen:"M2",tier:"Pro",chip:"M2 Pro 10C",cpu:10,gpu:16,ram:16,bw:200,g6s:2650,g6m:12347,g6g:74900,l7:38,l14:13.5,tops:15.8,msrp:1999,st:750,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m2pro-10-16-32",gen:"M2",tier:"Pro",chip:"M2 Pro 10C",cpu:10,gpu:16,ram:32,bw:200,g6s:2650,g6m:12347,g6g:74900,l7:38,l14:13.5,tops:15.8,msrp:2199,st:950,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m2pro-12-19-16",gen:"M2",tier:"Pro",chip:"M2 Pro 12C",cpu:12,gpu:19,ram:16,bw:200,g6s:2656,g6m:14447,g6g:83210,l7:39,l14:13.5,tops:15.8,msrp:2499,st:1050,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m2max-30-32",gen:"M2",tier:"Max",chip:"M2 Max 30G",cpu:12,gpu:30,ram:32,bw:400,g6s:2720,g6m:14600,g6g:110000,l7:61,l14:24,tops:15.8,msrp:3099,st:1500,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m2max-38-32",gen:"M2",tier:"Max",chip:"M2 Max 38G",cpu:12,gpu:38,ram:32,bw:400,g6s:2740,g6m:14700,g6g:134000,l7:66,l14:25,tops:15.8,msrp:3299,st:1600,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m2max-38-64",gen:"M2",tier:"Max",chip:"M2 Max 38G",cpu:12,gpu:38,ram:64,bw:400,g6s:2740,g6m:14700,g6g:134000,l7:66,l14:25,tops:15.8,msrp:3699,st:1900,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:500,yr:2023},
  {id:"m3-8-10-8",gen:"M3",tier:"Base",chip:"M3",cpu:8,gpu:10,ram:8,bw:100,g6s:3076,g6m:12000,g6g:46370,l7:21,l14:null,tops:18,msrp:1599,st:750,bat:22,ssd:5200,tb:"TB3",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3-8-10-16",gen:"M3",tier:"Base",chip:"M3",cpu:8,gpu:10,ram:16,bw:100,g6s:3076,g6m:12000,g6g:46370,l7:21,l14:null,tops:18,msrp:1799,st:900,bat:22,ssd:5200,tb:"TB3",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3-8-10-24",gen:"M3",tier:"Base",chip:"M3",cpu:8,gpu:10,ram:24,bw:100,g6s:3076,g6m:12000,g6g:46370,l7:21,l14:9,tops:18,msrp:1999,st:1100,bat:22,ssd:5200,tb:"TB3",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3pro-11-14-18",gen:"M3",tier:"Pro",chip:"M3 Pro 11C",cpu:11,gpu:14,ram:18,bw:150,g6s:3089,g6m:14029,g6g:74425,l7:31,l14:10,tops:18,msrp:1999,st:1050,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3pro-12-18-18",gen:"M3",tier:"Pro",chip:"M3 Pro 12C",cpu:12,gpu:18,ram:18,bw:150,g6s:3100,g6m:14600,g6g:74425,l7:31,l14:10,tops:18,msrp:2399,st:1400,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3pro-12-18-36",gen:"M3",tier:"Pro",chip:"M3 Pro 12C",cpu:12,gpu:18,ram:36,bw:150,g6s:3100,g6m:14600,g6g:74425,l7:31,l14:10,tops:18,msrp:2599,st:1600,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3max-14-30-36",gen:"M3",tier:"Max",chip:"M3 Max 30G",cpu:14,gpu:30,ram:36,bw:300,g6s:3107,g6m:18935,g6g:110000,l7:57,l14:20,tops:18,msrp:3199,st:2200,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m3max-16-40-48",gen:"M3",tier:"Max",chip:"M3 Max 40G",cpu:16,gpu:40,ram:48,bw:400,g6s:3102,g6m:21100,g6g:143827,l7:66,l14:25,tops:18,msrp:3599,st:2600,bat:18,ssd:5200,tb:"TB4",wifi:"6E",cam:"1080p",nit:600,yr:2023},
  {id:"m4-10-10-16",gen:"M4",tier:"Base",chip:"M4",cpu:10,gpu:10,ram:16,bw:120,g6s:3754,g6m:14900,g6g:58000,l7:24,l14:null,tops:38,msrp:1599,st:1300,bat:24,ssd:5100,tb:"TB4",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4-10-10-24",gen:"M4",tier:"Base",chip:"M4",cpu:10,gpu:10,ram:24,bw:120,g6s:3754,g6m:14900,g6g:58000,l7:24,l14:10,tops:38,msrp:1799,st:1500,bat:24,ssd:5100,tb:"TB4",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4pro-12-16-24",gen:"M4",tier:"Pro",chip:"M4 Pro 12C",cpu:12,gpu:16,ram:24,bw:273,g6s:3853,g6m:19950,g6g:97000,l7:50,l14:17,tops:38,msrp:1999,st:1799,bat:22,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4pro-14-20-24",gen:"M4",tier:"Pro",chip:"M4 Pro 14C",cpu:14,gpu:20,ram:24,bw:273,g6s:3851,g6m:22500,g6g:120000,l7:51,l14:18,tops:38,msrp:2399,st:2149,bat:22,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4pro-14-20-48",gen:"M4",tier:"Pro",chip:"M4 Pro 14C",cpu:14,gpu:20,ram:48,bw:273,g6s:3851,g6m:22500,g6g:120000,l7:51,l14:18,tops:38,msrp:2799,st:2500,bat:22,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4max-14-32-36",gen:"M4",tier:"Max",chip:"M4 Max 32G",cpu:14,gpu:32,ram:36,bw:410,g6s:3867,g6m:23150,g6g:150000,l7:70,l14:24,tops:38,msrp:3199,st:2999,bat:18,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4max-16-40-48",gen:"M4",tier:"Max",chip:"M4 Max 40G",cpu:16,gpu:40,ram:48,bw:546,g6s:3884,g6m:25649,g6g:186690,l7:83,l14:29,tops:38,msrp:3499,st:3200,bat:18,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m4max-16-40-64",gen:"M4",tier:"Max",chip:"M4 Max 40G",cpu:16,gpu:40,ram:64,bw:546,g6s:3884,g6m:25649,g6g:186690,l7:83,l14:29,tops:38,msrp:4399,st:4000,bat:18,ssd:5100,tb:"TB5",wifi:"6E",cam:"12MP",nit:1000,yr:2024},
  {id:"m5-10-10-16",gen:"M5",tier:"Base",chip:"M5",cpu:10,gpu:10,ram:16,bw:153,g6s:4226,g6m:17453,g6g:74000,l7:30,l14:null,tops:38,msrp:1699,st:1549,bat:24,ssd:6725,tb:"TB4",wifi:"6E",cam:"12MP",nit:1000,yr:2025},
  {id:"m5-10-10-24",gen:"M5",tier:"Base",chip:"M5",cpu:10,gpu:10,ram:24,bw:153,g6s:4226,g6m:17453,g6g:74000,l7:30,l14:12,tops:38,msrp:1899,st:1799,bat:24,ssd:6725,tb:"TB4",wifi:"6E",cam:"12MP",nit:1000,yr:2025},
  {id:"m5pro-15-16-24",gen:"M5",tier:"Pro",chip:"M5 Pro 15C",cpu:15,gpu:16,ram:24,bw:307,g6s:4289,g6m:26000,g6g:140000,l7:57,l14:22,tops:38,msrp:2199,st:2149,bat:22,ssd:14500,tb:"TB5",wifi:"7",cam:"12MP",nit:1000,yr:2026},
  {id:"m5pro-18-20-24",gen:"M5",tier:"Pro",chip:"M5 Pro 18C",cpu:18,gpu:20,ram:24,bw:307,g6s:4289,g6m:28534,g6g:160000,l7:57,l14:22,tops:38,msrp:2799,st:2749,bat:22,ssd:14500,tb:"TB5",wifi:"7",cam:"12MP",nit:1000,yr:2026},
  {id:"m5pro-18-20-64",gen:"M5",tier:"Pro",chip:"M5 Pro 18C",cpu:18,gpu:20,ram:64,bw:307,g6s:4289,g6m:28534,g6g:160000,l7:57,l14:22,tops:38,msrp:3399,st:3349,bat:22,ssd:14500,tb:"TB5",wifi:"7",cam:"12MP",nit:1000,yr:2026},
  {id:"m5max-18-32-36",gen:"M5",tier:"Max",chip:"M5 Max 32G",cpu:18,gpu:32,ram:36,bw:460,g6s:4300,g6m:29000,g6g:200000,l7:79,l14:30,tops:38,msrp:3599,st:3549,bat:20,ssd:14500,tb:"TB5",wifi:"7",cam:"12MP",nit:1000,yr:2026},
  {id:"m5max-18-40-48",gen:"M5",tier:"Max",chip:"M5 Max 40G",cpu:18,gpu:40,ram:48,bw:614,g6s:4300,g6m:29400,g6g:225000,l7:98,l14:36,tops:38,msrp:4099,st:4049,bat:20,ssd:14500,tb:"TB5",wifi:"7",cam:"12MP",nit:1000,yr:2026},
];

const GENS=["M2","M3","M4","M5"], TIERS=["Base","Pro","Max"];
const fmt=n=>n==null?"—":n.toLocaleString();
const fD=n=>n==null?"—":`$${n.toLocaleString()}`;
const label=c=>`${c.chip} ${c.ram}GB`;

const LLM_MODELS=[
  {name:"Llama 3.1 8B",param:8,q4gb:4.5,minRam:12},
  {name:"Qwen2.5 14B",param:14,q4gb:8.5,minRam:18},
  {name:"DeepSeek-R1 27B",param:27,q4gb:17,minRam:24},
  {name:"Qwen2.5 32B",param:32,q4gb:19,minRam:28},
  {name:"Llama 3.1 70B",param:70,q4gb:40,minRam:48},
];

const USE_CASES=[
  {id:"coding",name:"Daily Coding & IDE",icon:"⌨️",weights:{g6s:3,g6m:1,bat:2,ssd:2,l7:0}},
  {id:"llm",name:"Local LLM Inference",icon:"🧠",weights:{g6s:0,g6m:0,bat:0,ssd:0,l7:5,bw:3,ram:2}},
  {id:"gpu",name:"GPU Rendering / ML",icon:"🎨",weights:{g6s:0,g6m:1,bat:0,ssd:1,g6g:5}},
  {id:"portable",name:"Battery Warrior",icon:"🔋",weights:{g6s:2,g6m:0,bat:5,ssd:1,l7:0}},
  {id:"allround",name:"Best All-Rounder",icon:"⚡",weights:{g6s:2,g6m:2,bat:1,ssd:1,l7:2,g6g:1}},
  {id:"value",name:"Budget Champion",icon:"💰",weights:{g6s:1,g6m:1,bat:1,ssd:0,l7:1},invertPrice:true},
];

/* score a chip for a use case */
function scoreUseCase(c, uc) {
  const w=uc.weights, maxes={g6s:4300,g6m:29400,bat:24,ssd:14500,l7:98,bw:614,ram:128,g6g:225000};
  let s=0,tw=0;
  Object.entries(w).forEach(([k,v])=>{
    if(!v)return; tw+=v;
    const val=c[k]||0, mx=maxes[k]||1;
    s+=v*(val/mx);
  });
  if(uc.invertPrice) { s = tw>0 ? (s/tw) * (1 - c.st/7500) * 2 : 0; }
  else { s = tw>0 ? s/tw : 0; }
  return Math.round(s*100);
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const Pill=({l,active,color,onClick,small})=>(
  <button onClick={onClick} style={{
    padding:small?"4px 10px":"6px 14px",borderRadius:99,border:`1px solid ${active?color:T.border}`,
    background:active?color+"18":"transparent",color:active?color:T.muted,
    fontSize:small?10:11,fontWeight:600,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap",
  }}>{l}</button>
);

const ChipSelect=({value,onChange,multi,exclude})=>{
  const opts=CHIPS.filter(c=>!exclude?.includes(c.id));
  return(
    <select value={value||""} onChange={e=>onChange(e.target.value)} style={{
      background:T.card2,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",
      color:T.text,fontSize:13,fontFamily:"'Manrope',sans-serif",cursor:"pointer",minWidth:200,
    }}>
      <option value="">Select a chip...</option>
      {GENS.map(g=>(
        <optgroup key={g} label={g} style={{color:G[g]}}>
          {opts.filter(c=>c.gen===g).map(c=>(
            <option key={c.id} value={c.id}>{label(c)} — {fD(c.st)}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

const DeltaBar=({label:lb,a,b,unit="",higherBetter=true})=>{
  if(a==null||b==null)return null;
  const pct=b!==0?Math.round(((a-b)/b)*100):0;
  const aWins=higherBetter?a>=b:a<=b;
  return(
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
        <span style={{color:T.sub,fontWeight:600}}>{lb}</span>
        <span style={{
          color:pct===0?T.muted:aWins?T.green:T.red,fontWeight:700,
          fontFamily:"'IBM Plex Mono',monospace",fontSize:11,
        }}>{pct>0?"+":""}{pct}%</span>
      </div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          <div style={{height:8,background:T.surface,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:99,background:aWins?T.green:T.red,width:`${Math.min(100,a/Math.max(a,b)*100)}%`,transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <div style={{height:8,background:T.surface,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:99,background:!aWins?T.green:T.red,width:`${Math.min(100,b/Math.max(a,b)*100)}%`,transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
        </div>
        <div style={{minWidth:70,textAlign:"right",fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>
          <div style={{color:aWins?T.green:T.text}}>{fmt(a)}{unit}</div>
          <div style={{color:!aWins?T.green:T.text}}>{fmt(b)}{unit}</div>
        </div>
      </div>
    </div>
  );
};

const Spark=({values,color,w=60,h=20})=>{
  if(!values?.length)return null;
  const mn=Math.min(...values),mx=Math.max(...values),rng=mx-mn||1;
  const pts=values.map((v,i)=>`${(i/(values.length-1))*w},${h-((v-mn)/rng)*h}`).join(" ");
  return <svg width={w} height={h} style={{display:"block"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
};

const TT=({active,payload})=>{
  if(!active||!payload?.length)return null;
  const d=payload[0]?.payload;
  if(!d)return null;
  return(
    <div style={{background:"#1a1a2e",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 16px",fontSize:12,color:T.text,maxWidth:260,boxShadow:"0 12px 40px rgba(0,0,0,.6)"}}>
      <div style={{fontWeight:700,marginBottom:4}}>{d.chip||d.name} {d.ram?`${d.ram}GB`:""}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:6,alignItems:"center",color:T.sub}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:p.color,flexShrink:0}}/>
          {p.name}: <strong style={{color:T.text}}>{typeof p.value==="number"?p.value.toLocaleString():p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState("h2h");
  const [gf,setGf]=useState(new Set(GENS));
  const [tf,setTf]=useState(new Set(TIERS));
  const [sortK,setSortK]=useState("st");
  const [sortD,setSortD]=useState("asc");
  const [sel,setSel]=useState(new Set());
  // H2H
  const [h2h,setH2h]=useState(["m4pro-14-20-24","m5pro-18-20-24"]);
  // Use case
  const [uc,setUc]=useState("llm");
  // Budget
  const [budget,setBudget]=useState(3000);

  const tgGen=g=>{const n=new Set(gf);n.has(g)?n.delete(g):n.add(g);setGf(n);};
  const tgTier=t=>{const n=new Set(tf);n.has(t)?n.delete(t):n.add(t);setTf(n);};
  const tgSel=id=>{const n=new Set(sel);n.has(id)?n.delete(id):n.add(id);setSel(n);};

  const filtered=useMemo(()=>CHIPS.filter(c=>gf.has(c.gen)&&tf.has(c.tier)),[gf,tf]);
  const sorted=useMemo(()=>[...filtered].sort((a,b)=>{
    const av=a[sortK],bv=b[sortK];
    if(av==null&&bv==null)return 0;if(av==null)return 1;if(bv==null)return-1;
    return sortD==="asc"?av-bv:bv-av;
  }),[filtered,sortK,sortD]);

  const doSort=k=>{if(sortK===k)setSortD(d=>d==="asc"?"desc":"asc");else{setSortK(k);setSortD("asc");}};

  const h2hChips=h2h.map(id=>CHIPS.find(c=>c.id===id)).filter(Boolean);

  const pages=[
    {id:"h2h",label:"Head-to-Head",icon:"⚔️"},
    {id:"table",label:"Data Table",icon:"📊"},
    {id:"llmcalc",label:"LLM Calculator",icon:"🧠"},
    {id:"usecase",label:"Use Case Ranker",icon:"🎯"},
    {id:"features",label:"Features Matrix",icon:"🔲"},
    {id:"tco",label:"Cost Analysis",icon:"💵"},
    {id:"perf",label:"Perf / Dollar",icon:"📈"},
    {id:"scatter",label:"LLM × BW",icon:"🔬"},
    {id:"budget",label:"Budget Picker",icon:"💰"},
  ];

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:${T.bg}}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
    ::selection{background:${T.accent}44}
    @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    .su{animation:slideUp .45s ease both}
    input[type=range]{-webkit-appearance:none;background:${T.border};height:4px;border-radius:99px;outline:none}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${T.accent};cursor:pointer;border:2px solid ${T.bg}}
    select option{background:${T.card};color:${T.text}}
  `;

  return(
    <div style={{fontFamily:"'Manrope',sans-serif",background:T.bg,minHeight:"100vh",color:T.text}}>
      <style>{css}</style>

      {/* ─── HEADER ─── */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"36px 28px 24px",textAlign:"center",background:`linear-gradient(180deg,${T.bg} 0%,#0D0D14 100%)`}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:T.accent,marginBottom:10}}>MacBook Pro 14" Observatory</div>
        <h1 style={{fontSize:"clamp(22px,4vw,38px)",fontWeight:800,margin:0,letterSpacing:"-0.04em",background:`linear-gradient(135deg,${G.M2},${G.M3},${G.M4},${G.M5})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          Every Configuration. Compared.
        </h1>
        <p style={{color:T.sub,fontSize:13,marginTop:8}}>{CHIPS.length} configs · M2 Pro through M5 Max · $593 to $7,299</p>
      </div>

      {/* ─── NAV + FILTERS ─── */}
      <div style={{position:"sticky",top:0,zIndex:50,background:`${T.bg}E8`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"8px 16px",display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,overflowX:"auto",flex:"1 1 auto",padding:"4px 0"}}>
            {pages.map(p=>(
              <button key={p.id} onClick={()=>setPage(p.id)} style={{
                padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                whiteSpace:"nowrap",transition:"all .15s",display:"flex",alignItems:"center",gap:5,
                background:page===p.id?T.accent:"transparent",color:page===p.id?"#fff":T.muted,
              }}><span style={{fontSize:13}}>{p.icon}</span>{p.label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexShrink:0}}>
            {GENS.map(g=><Pill key={g} l={g} active={gf.has(g)} color={G[g]} onClick={()=>tgGen(g)} small/>)}
            <span style={{width:1,height:20,background:T.border,margin:"0 2px"}}/>
            {TIERS.map(t=><Pill key={t} l={t} active={tf.has(t)} color={TR[t]} onClick={()=>tgTier(t)} small/>)}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"28px 16px"}}>

        {/* ═══ HEAD-TO-HEAD ═══ */}
        {page==="h2h"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",letterSpacing:"-0.03em"}}>⚔️ Head-to-Head Comparator</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 20px"}}>Select 2 chips for a full breakdown with radar overlay, animated delta bars, and verdict.</p>
            <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:G[h2hChips[0]?.gen]||T.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".08em"}}>Chip A</div>
                <ChipSelect value={h2h[0]} onChange={v=>setH2h([v,h2h[1]])} exclude={[h2h[1]]}/>
              </div>
              <span style={{fontSize:24,color:T.muted,alignSelf:"flex-end",paddingBottom:6}}>vs</span>
              <div>
                <div style={{fontSize:10,color:G[h2hChips[1]?.gen]||T.muted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".08em"}}>Chip B</div>
                <ChipSelect value={h2h[1]} onChange={v=>setH2h([h2h[0],v])} exclude={[h2h[0]]}/>
              </div>
            </div>

            {h2hChips.length===2&&(()=>{
              const [a,b]=h2hChips;
              const radarDims=[
                {dim:"Single-Core",k:"g6s",max:4300},{dim:"Multi-Core",k:"g6m",max:29400},
                {dim:"GPU Metal",k:"g6g",max:225000},{dim:"Bandwidth",k:"bw",max:614},
                {dim:"LLM 7B",k:"l7",max:98},{dim:"Battery",k:"bat",max:24},
                {dim:"SSD",k:"ssd",max:14500},{dim:"AI TOPS",k:"tops",max:38},
              ];
              const rData=radarDims.map(d=>({
                dim:d.dim,a:Math.round((a[d.k]||0)/d.max*100),b:Math.round((b[d.k]||0)/d.max*100),
              }));
              const aWins=radarDims.filter(d=>(a[d.k]||0)>(b[d.k]||0)).length;
              const bWins=radarDims.filter(d=>(b[d.k]||0)>(a[d.k]||0)).length;
              return(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  {/* Radar */}
                  <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 8px 8px"}}>
                    <div style={{textAlign:"center",fontSize:13,fontWeight:700,marginBottom:4}}>Performance Radar</div>
                    <ResponsiveContainer width="100%" height={340}>
                      <RadarChart data={rData}>
                        <PolarGrid stroke={T.border}/>
                        <PolarAngleAxis dataKey="dim" tick={{fontSize:10,fill:T.sub}}/>
                        <PolarRadiusAxis angle={90} domain={[0,100]} tick={false} axisLine={false}/>
                        <Radar name={label(a)} dataKey="a" stroke={G[a.gen]} fill={G[a.gen]} fillOpacity={.15} strokeWidth={2}/>
                        <Radar name={label(b)} dataKey="b" stroke={G[b.gen]} fill={G[b.gen]} fillOpacity={.15} strokeWidth={2}/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Delta bars */}
                  <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:24}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                      <span style={{fontSize:13,fontWeight:700}}>Metric Deltas</span>
                      <span style={{fontSize:12,color:T.sub}}>
                        <span style={{color:G[a.gen],fontWeight:700}}>{label(a)}</span> vs <span style={{color:G[b.gen],fontWeight:700}}>{label(b)}</span>
                      </span>
                    </div>
                    <DeltaBar label="GB6 Single-Core" a={a.g6s} b={b.g6s}/>
                    <DeltaBar label="GB6 Multi-Core" a={a.g6m} b={b.g6m}/>
                    <DeltaBar label="Metal GPU" a={a.g6g} b={b.g6g}/>
                    <DeltaBar label="Memory BW" a={a.bw} b={b.bw} unit=" GB/s"/>
                    <DeltaBar label="LLM 7B tok/s" a={a.l7} b={b.l7}/>
                    <DeltaBar label="LLM 14B tok/s" a={a.l14} b={b.l14}/>
                    <DeltaBar label="Battery" a={a.bat} b={b.bat} unit="h"/>
                    <DeltaBar label="SSD Speed" a={a.ssd} b={b.ssd} unit=" MB/s"/>
                    <DeltaBar label="Street Price" a={a.st} b={b.st} higherBetter={false}/>
                  </div>
                  {/* Verdict */}
                  <div style={{gridColumn:"1/-1",background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:28}}>
                    <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".1em",color:T.muted,marginBottom:8}}>Verdict</div>
                        <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",marginBottom:12}}>
                          <span style={{color:G[a.gen]}}>{label(a)}</span> wins <span style={{color:T.accent,fontFamily:"'IBM Plex Mono',monospace"}}>{aWins}</span>
                          <span style={{color:T.muted,margin:"0 8px"}}>/</span>
                          <span style={{color:G[b.gen]}}>{label(b)}</span> wins <span style={{color:T.accent,fontFamily:"'IBM Plex Mono',monospace"}}>{bWins}</span>
                        </div>
                        <p style={{fontSize:13,color:T.sub,lineHeight:1.7,margin:0}}>
                          {a.l7>b.l7?`${label(a)} is ${Math.round((a.l7/b.l7-1)*100)}% faster at LLM inference.`:`${label(b)} is ${Math.round((b.l7/a.l7-1)*100)}% faster at LLM inference.`}
                          {" "}{a.g6s>b.g6s?`${label(a)} has ${Math.round((a.g6s/b.g6s-1)*100)}% better single-core CPU.`:`${label(b)} has ${Math.round((b.g6s/a.g6s-1)*100)}% better single-core CPU.`}
                          {" "}{a.st<b.st?`At ${fD(a.st)} vs ${fD(b.st)}, ${label(a)} saves you ${fD(b.st-a.st)}.`:`At ${fD(b.st)} vs ${fD(a.st)}, ${label(b)} saves you ${fD(a.st-b.st)}.`}
                        </p>
                      </div>
                      <div style={{display:"flex",gap:12}}>
                        {[a,b].map(c=>(
                          <div key={c.id} style={{padding:"16px 20px",background:T.surface,borderRadius:12,border:`1px solid ${G[c.gen]}30`,minWidth:140,textAlign:"center"}}>
                            <div style={{fontSize:11,color:G[c.gen],fontWeight:700}}>{c.chip}</div>
                            <div style={{fontSize:11,color:T.muted}}>{c.ram}GB · {c.bw} GB/s</div>
                            <div style={{fontSize:22,fontWeight:800,color:T.green,fontFamily:"'IBM Plex Mono',monospace",marginTop:6}}>{fD(c.st)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ DATA TABLE ═══ */}
        {page==="table"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>📊 Complete Specs Table</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 20px"}}>{sorted.length} configs. Click headers to sort. Sparklines show generational trends.</p>
            <div style={{overflowX:"auto",borderRadius:14,border:`1px solid ${T.border}`,background:T.card}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>
                <thead>
                  <tr>{[
                    {k:"chip",l:"Chip",w:130},{k:"ram",l:"RAM",w:48},{k:"bw",l:"BW",w:60},
                    {k:"g6s",l:"SC",w:56},{k:"g6m",l:"MC",w:62},{k:"g6g",l:"GPU",w:62},
                    {k:"l7",l:"7B",w:48},{k:"l14",l:"14B",w:48},{k:"tops",l:"TOPS",w:48},
                    {k:"msrp",l:"MSRP",w:62},{k:"st",l:"Street",w:62},{k:"bat",l:"Bat",w:36},
                    {k:"ssd",l:"SSD",w:58},{k:"tb",l:"TB",w:40},{k:"wifi",l:"WiFi",w:36},
                  ].map(c=>(
                    <th key={c.k} onClick={()=>doSort(c.k)} style={{
                      padding:"10px 8px",textAlign:c.k==="chip"?"left":"right",borderBottom:`1px solid ${T.border}`,
                      color:sortK===c.k?T.accent:T.muted,fontSize:9,fontWeight:700,letterSpacing:".05em",
                      textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",minWidth:c.w,
                    }}>{c.l}{sortK===c.k&&<span style={{marginLeft:2}}>{sortD==="asc"?"▲":"▼"}</span>}</th>
                  ))}</tr>
                </thead>
                <tbody>{sorted.map((c,i)=>(
                  <tr key={c.id} style={{background:i%2?T.surface+"60":"transparent",transition:"background .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.card2}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2?T.surface+"60":"transparent"}>
                    <td style={{padding:"8px",borderBottom:`1px solid ${T.border}06`,fontWeight:600,color:G[c.gen],display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:G[c.gen],flexShrink:0}}/>
                      {c.chip}<span style={{fontSize:9,color:TR[c.tier],fontWeight:700,background:TR[c.tier]+"15",padding:"1px 5px",borderRadius:3}}>{c.ram}</span>
                    </td>
                    {[
                      {v:`${c.ram}`,c:T.text},{v:`${c.bw}`,c:T.text},{v:fmt(c.g6s),c:T.text},{v:fmt(c.g6m),c:T.text},
                      {v:fmt(c.g6g),c:T.text},{v:c.l7||"—",c:c.l7?T.green:T.muted},{v:c.l14||"—",c:c.l14?T.green:T.muted},
                      {v:c.tops,c:T.text},{v:fD(c.msrp),c:T.muted},{v:fD(c.st),c:T.green},
                      {v:`${c.bat}h`,c:T.text},{v:fmt(c.ssd),c:T.text},{v:c.tb.replace("TB",""),c:c.tb==="TB5"?T.accent:T.muted},
                      {v:c.wifi,c:c.wifi==="7"?T.accent:T.muted},
                    ].map((cell,ci)=>(
                      <td key={ci} style={{padding:"8px",textAlign:"right",borderBottom:`1px solid ${T.border}06`,color:cell.c,fontWeight:cell.c===T.green||cell.c===T.accent?600:400}}>{cell.v}</td>
                    ))}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ LLM CALCULATOR ═══ */}
        {page==="llmcalc"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>🧠 LLM Model Fit Calculator</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 24px"}}>See which LLM models fit on each chip, with estimated performance and RAM headroom.</p>
            <div style={{overflowX:"auto"}}>
              <div style={{display:"grid",gridTemplateColumns:`160px repeat(${filtered.length},minmax(90px,1fr))`,gap:1,background:T.border,borderRadius:14,overflow:"hidden",fontSize:11}}>
                <div style={{padding:10,background:T.surface,fontWeight:700,color:T.muted,fontSize:9,textTransform:"uppercase",letterSpacing:".06em"}}>Model</div>
                {filtered.map(c=>(
                  <div key={c.id} style={{padding:"8px 6px",background:T.surface,textAlign:"center",fontWeight:700,color:G[c.gen],fontSize:10,lineHeight:1.3}}>
                    {c.chip}<br/><span style={{color:T.muted,fontWeight:500}}>{c.ram}GB</span>
                  </div>
                ))}
                {LLM_MODELS.map(m=>[
                  <div key={`l-${m.name}`} style={{padding:"10px",background:T.card,fontWeight:600,color:T.text,display:"flex",flexDirection:"column",gap:2}}>
                    <span>{m.name}</span>
                    <span style={{fontSize:9,color:T.muted}}>Q4: {m.q4gb}GB · min {m.minRam}GB</span>
                  </div>,
                  ...filtered.map(c=>{
                    const fits=c.ram>=m.minRam;
                    const headroom=c.ram-m.q4gb-6;
                    const estTok=fits?(c.bw/m.q4gb*0.85).toFixed(0):null;
                    return(
                      <div key={`${c.id}-${m.name}`} style={{
                        padding:"8px 6px",background:fits?(headroom>8?T.green+"10":headroom>0?T.amber+"10":T.red+"08"):T.card,
                        textAlign:"center",fontFamily:"'IBM Plex Mono',monospace",
                      }}>
                        {fits?(
                          <>
                            <div style={{fontSize:14,fontWeight:700,color:headroom>8?T.green:headroom>0?T.amber:T.red}}>{estTok}</div>
                            <div style={{fontSize:8,color:T.muted}}>tok/s est</div>
                            <div style={{fontSize:8,color:headroom>4?T.sub:T.red}}>{headroom>0?`+${headroom}GB`:headroom===0?"Tight":`${headroom}GB`}</div>
                          </>
                        ):(
                          <div style={{fontSize:16,color:T.muted}}>✕</div>
                        )}
                      </div>
                    );
                  })
                ])}
              </div>
            </div>
            <div style={{marginTop:16,padding:16,background:T.surface,borderRadius:12,border:`1px solid ${T.border}`,fontSize:12,color:T.sub,lineHeight:1.7}}>
              <strong style={{color:T.text}}>How to read:</strong> Green = comfortable fit with good headroom. Amber = fits but tight. Red = barely fits. ✕ = model won't load. tok/s estimates use (bandwidth / model_size × 0.85) heuristic. Real MLX performance is typically higher.
            </div>
          </div>
        )}

        {/* ═══ USE CASE RANKER ═══ */}
        {page==="usecase"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>🎯 Use Case Ranker</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 20px"}}>Select your primary workflow. Chips are ranked by weighted score.</p>
            <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
              {USE_CASES.map(u=>(
                <button key={u.id} onClick={()=>setUc(u.id)} style={{
                  padding:"10px 18px",borderRadius:10,border:`1px solid ${uc===u.id?T.accent:T.border}`,
                  background:uc===u.id?T.accent+"15":T.card,color:uc===u.id?T.accent:T.sub,
                  fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s",display:"flex",gap:8,alignItems:"center",
                }}>
                  <span style={{fontSize:18}}>{u.icon}</span>{u.name}
                </button>
              ))}
            </div>
            {(()=>{
              const ucObj=USE_CASES.find(u=>u.id===uc);
              const ranked=[...filtered].map(c=>({...c,score:scoreUseCase(c,ucObj)})).sort((a,b)=>b.score-a.score);
              const topScore=ranked[0]?.score||1;
              return(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {ranked.slice(0,12).map((c,i)=>(
                    <div key={c.id} style={{
                      display:"grid",gridTemplateColumns:"36px 1fr 80px 70px",gap:12,alignItems:"center",
                      padding:"14px 20px",background:i===0?T.accent+"10":T.card,
                      borderRadius:12,border:`1px solid ${i===0?T.accent+"40":T.border}`,
                    }}>
                      <div style={{
                        width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                        background:i<3?[T.accent,T.green+"80",T.amber+"80"][i]:T.surface,
                        fontSize:12,fontWeight:800,color:i<3?"#fff":T.muted,
                      }}>{i+1}</div>
                      <div>
                        <div style={{fontWeight:700,color:G[c.gen],fontSize:14}}>{c.chip} · {c.ram}GB</div>
                        <div style={{fontSize:11,color:T.sub,marginTop:2}}>{c.bw} GB/s · {c.l7||"—"} tok/s · {c.bat}h battery</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:T.accent}}>{c.score}</div>
                        <div style={{fontSize:9,color:T.muted}}>/ 100</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:15,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:T.green}}>{fD(c.st)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ FEATURES MATRIX ═══ */}
        {page==="features"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>🔲 Features Heatmap Matrix</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 24px"}}>Color intensity = relative performance. Darker = better. Scroll horizontally for all configs.</p>
            {(()=>{
              const metrics=[
                {k:"g6s",l:"GB6 Single",max:4300},{k:"g6m",l:"GB6 Multi",max:29400},{k:"g6g",l:"GPU Metal",max:225000},
                {k:"bw",l:"Bandwidth",max:614},{k:"l7",l:"7B tok/s",max:98},{k:"l14",l:"14B tok/s",max:36},
                {k:"tops",l:"AI TOPS",max:38},{k:"bat",l:"Battery",max:24},{k:"ssd",l:"SSD Speed",max:14500},
                {k:"nit",l:"Brightness",max:1000},{k:"ram",l:"RAM",max:128},
              ];
              return(
                <div style={{overflowX:"auto"}}>
                  <div style={{display:"grid",gridTemplateColumns:`100px repeat(${filtered.length},minmax(72px,1fr))`,gap:1,background:T.border,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:8,background:T.surface,fontSize:9,fontWeight:700,color:T.muted}}/>
                    {filtered.map(c=>(
                      <div key={c.id} style={{padding:"6px 4px",background:T.surface,textAlign:"center",fontSize:9,fontWeight:700,color:G[c.gen],lineHeight:1.3}}>
                        {c.chip}<br/><span style={{color:T.muted}}>{c.ram}G</span>
                      </div>
                    ))}
                    {metrics.map(m=>[
                      <div key={`l-${m.k}`} style={{padding:"8px",background:T.card,fontSize:10,fontWeight:600,color:T.sub,display:"flex",alignItems:"center"}}>{m.l}</div>,
                      ...filtered.map(c=>{
                        const v=c[m.k];
                        const intensity=v!=null?v/m.max:0;
                        const hue=intensity>.7?200:intensity>.4?180:220;
                        return(
                          <div key={`${c.id}-${m.k}`} style={{
                            padding:"6px 4px",textAlign:"center",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fontWeight:500,
                            background:`hsla(${hue},70%,50%,${intensity*0.2})`,color:v!=null?`hsla(${hue},60%,${50+intensity*30}%,1)`:T.muted,
                          }}>{v!=null?fmt(v):"—"}</div>
                        );
                      })
                    ])}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ TCO ═══ */}
        {page==="tco"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>💵 Total Cost of Ownership</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 24px"}}>Depreciation analysis, cost per year of ownership, and projected resale values.</p>
            <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"20px 12px 12px"}}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sorted.map(c=>{
                  const age=2026-c.yr;
                  const depPct=c.msrp>0?Math.round((1-c.st/c.msrp)*100):0;
                  const costPerYr=age>0?Math.round((c.msrp-c.st)/age):0;
                  return{name:`${c.chip} ${c.ram}G`,dep:depPct,costYr:costPerYr,gen:c.gen,st:c.st,msrp:c.msrp};
                })} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                  <XAxis dataKey="name" tick={{fontSize:8,fill:T.muted}} angle={-50} textAnchor="end" height={90} axisLine={false} tickLine={false} interval={0}/>
                  <YAxis yAxisId="pct" orientation="left" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false} label={{value:"Depreciation %",angle:-90,position:"insideLeft",style:{fontSize:10,fill:T.sub}}}/>
                  <YAxis yAxisId="cost" orientation="right" tick={{fontSize:10,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`} label={{value:"Cost/yr",angle:90,position:"insideRight",style:{fontSize:10,fill:T.sub}}}/>
                  <RTooltip content={<TT/>} cursor={{fill:"rgba(255,255,255,.03)"}}/>
                  <Bar yAxisId="pct" dataKey="dep" name="Depreciation %" radius={[4,4,0,0]} opacity={.6}>
                    {sorted.map((c,i)=><Cell key={i} fill={G[c.gen]}/>)}
                  </Bar>
                  <Bar yAxisId="cost" dataKey="costYr" name="Cost/Year ($)" radius={[4,4,0,0]}>
                    {sorted.map((c,i)=><Cell key={i} fill={G[c.gen]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Best cost/year cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginTop:20}}>
              {[...CHIPS].map(c=>{
                const age=2026-c.yr;
                return{...c,costYr:age>0?Math.round((c.msrp-c.st)/age):0,dep:Math.round((1-c.st/c.msrp)*100),age};
              }).filter(c=>c.age>0).sort((a,b)=>b.dep-a.dep).slice(0,4).map(c=>(
                <div key={c.id} style={{background:T.card,borderRadius:12,border:`1px solid ${T.border}`,padding:18}}>
                  <div style={{fontSize:11,color:G[c.gen],fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>{c.chip} {c.ram}GB</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:8}}>
                    <div>
                      <span style={{fontSize:28,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:T.green}}>{c.dep}%</span>
                      <span style={{fontSize:11,color:T.muted,marginLeft:4}}>depreciated</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,color:T.amber,fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>{fD(c.costYr)}/yr</div>
                      <div style={{fontSize:10,color:T.muted}}>{fD(c.msrp)} → {fD(c.st)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PERF/DOLLAR ═══ */}
        {page==="perf"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>📈 Performance Density</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 24px"}}>Performance per dollar across key metrics. Bigger bubble = more RAM.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {xk:"st",xl:"Street Price ($)",yk:"l7",yl:"7B LLM tok/s",title:"LLM tok/s per Dollar"},
                {xk:"st",xl:"Street Price ($)",yk:"g6m",yl:"GB6 Multi-Core",title:"CPU Multi per Dollar"},
              ].map((cfg,ci)=>(
                <div key={ci} style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"20px 12px 8px"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:8,paddingLeft:12}}>{cfg.title}</div>
                  <ResponsiveContainer width="100%" height={340}>
                    <ScatterChart margin={{top:10,right:20,bottom:20,left:10}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                      <XAxis type="number" dataKey={cfg.xk} tick={{fontSize:10,fill:T.muted}} axisLine={{stroke:T.border}} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}
                        label={{value:cfg.xl,position:"bottom",style:{fontSize:10,fill:T.sub}}}/>
                      <YAxis type="number" dataKey={cfg.yk} tick={{fontSize:10,fill:T.muted}} axisLine={{stroke:T.border}} tickLine={false}
                        label={{value:cfg.yl,angle:-90,position:"insideLeft",style:{fontSize:10,fill:T.sub}}}/>
                      <ZAxis type="number" dataKey="ram" range={[40,300]}/>
                      <RTooltip content={<TT/>} cursor={{strokeDasharray:"3 3",stroke:T.muted}}/>
                      {GENS.filter(g=>gf.has(g)).map(g=>(
                        <Scatter key={g} name={g} data={filtered.filter(c=>c.gen===g&&c[cfg.yk])} fill={G[g]} fillOpacity={.8}/>
                      ))}
                      <Legend wrapperStyle={{fontSize:11}}/>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
            {/* Top value per $1K */}
            <div style={{marginTop:20}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Best LLM Performance per $1,000 Spent</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[...CHIPS].filter(c=>c.l7).map(c=>({...c,tokPerK:Math.round(c.l7/(c.st/1000)*10)/10})).sort((a,b)=>b.tokPerK-a.tokPerK).slice(0,6).map((c,i)=>(
                  <div key={c.id} style={{
                    padding:"14px 18px",background:T.card,borderRadius:12,border:`1px solid ${i===0?T.green+"50":T.border}`,
                    minWidth:180,flex:"1 1 180px",
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{fontSize:12,fontWeight:700,color:G[c.gen]}}>{c.chip} {c.ram}GB</div>
                      <div style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:i===0?T.green+"20":T.surface,color:i===0?T.green:T.muted,fontWeight:700}}>#{i+1}</div>
                    </div>
                    <div style={{fontSize:24,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:T.accent,marginTop:6}}>{c.tokPerK}</div>
                    <div style={{fontSize:10,color:T.muted}}>tok/s per $1K · {c.l7} tok/s @ {fD(c.st)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ LLM × BANDWIDTH SCATTER ═══ */}
        {page==="scatter"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>🔬 LLM Speed vs. Memory Bandwidth</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 24px"}}>The near-linear relationship proves bandwidth is the bottleneck for local LLM inference.</p>
            <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"24px 12px 12px"}}>
              <ResponsiveContainer width="100%" height={460}>
                <ScatterChart margin={{top:10,right:30,bottom:24,left:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                  <XAxis type="number" dataKey="bw" tick={{fontSize:11,fill:T.muted}} axisLine={{stroke:T.border}} tickLine={false}
                    label={{value:"Memory Bandwidth (GB/s)",position:"bottom",offset:4,style:{fontSize:12,fill:T.sub}}}/>
                  <YAxis type="number" dataKey="l7" tick={{fontSize:11,fill:T.muted}} axisLine={{stroke:T.border}} tickLine={false}
                    label={{value:"7B Q4 tok/s",angle:-90,position:"insideLeft",style:{fontSize:12,fill:T.sub}}}/>
                  <ZAxis type="number" dataKey="ram" range={[50,350]}/>
                  <RTooltip content={<TT/>} cursor={{strokeDasharray:"3 3",stroke:T.muted}}/>
                  <ReferenceLine y={30} yAxisId={0} stroke={T.amber} strokeDasharray="5 5" label={{value:"Usable threshold (30 tok/s)",position:"right",style:{fontSize:10,fill:T.amber}}}/>
                  {GENS.filter(g=>gf.has(g)).map(g=>(
                    <Scatter key={g} name={g} data={filtered.filter(c=>c.gen===g&&c.l7)} fill={G[g]} fillOpacity={.85}/>
                  ))}
                  <Legend wrapperStyle={{fontSize:12}}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ═══ BUDGET PICKER ═══ */}
        {page==="budget"&&(
          <div className="su">
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>💰 Budget Recommender</h2>
            <p style={{color:T.sub,fontSize:13,margin:"0 0 20px"}}>Set your budget. Top picks ranked by LLM performance.</p>
            <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:24,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:10}}>
                <span style={{fontSize:13,color:T.sub,fontWeight:600}}>Max Budget:</span>
                <span style={{fontSize:36,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:T.green}}>${budget.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={7500} step={50} value={budget} onChange={e=>setBudget(+e.target.value)} style={{width:"100%"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:4}}>
                <span>$500</span><span>$2,000</span><span>$3,500</span><span>$5,000</span><span>$7,500</span>
              </div>
            </div>
            {(()=>{
              const picks=[...CHIPS].filter(c=>c.st<=budget).sort((a,b)=>(b.l7||0)-(a.l7||0)).slice(0,8);
              return picks.length>0?(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {picks.map((c,i)=>(
                    <div key={c.id} style={{
                      display:"grid",gridTemplateColumns:"36px 1fr repeat(4,80px)",gap:8,alignItems:"center",
                      padding:"14px 20px",background:i===0?T.accent+"10":T.card,
                      borderRadius:12,border:`1px solid ${i===0?T.accent+"40":T.border}`,
                    }}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:i===0?T.accent:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i===0?"#fff":T.muted}}>#{i+1}</div>
                      <div>
                        <div style={{fontWeight:700,color:G[c.gen],fontSize:14}}>{c.chip} · {c.ram}GB</div>
                        <div style={{fontSize:10,color:T.sub}}>{c.bw} GB/s · {c.tb} · WiFi {c.wifi}</div>
                      </div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{c.l7||"—"}</div><div style={{fontSize:9,color:T.muted}}>7B tok/s</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{fmt(c.g6s)}</div><div style={{fontSize:9,color:T.muted}}>SC</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>{fmt(c.g6m)}</div><div style={{fontSize:9,color:T.muted}}>MC</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:T.green}}>{fD(c.st)}</div><div style={{fontSize:9,color:T.muted,textDecoration:"line-through"}}>{fD(c.msrp)}</div></div>
                    </div>
                  ))}
                </div>
              ):<div style={{textAlign:"center",padding:60,color:T.muted}}>No configs under {fD(budget)}</div>;
            })()}
          </div>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{padding:"24px 16px",textAlign:"center",borderTop:`1px solid ${T.border}`,fontSize:10,color:T.muted,lineHeight:1.6}}>
        Data: Geekbench Browser, Apple Tech Specs, LocalScore, Macworld, Swappa, Amazon, RefurbMe. March 2026 USD.<br/>
        LLM estimates: llama.cpp Q4 quantization. MLX is ~25% faster. Street = used/renewed market.
      </div>
    </div>
  );
}
