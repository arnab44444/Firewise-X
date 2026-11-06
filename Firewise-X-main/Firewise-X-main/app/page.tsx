"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ALL_TESTS,
  HERO_RUNS,
  EVIDENCE_CARDS,
  BassTest,
  HeroRun,
  EvidenceCard,
} from "./data";

export default function FirewiseXApp() {
  const [currentRoute, setCurrentRoute] = useState<string>("/");

  // Mission Control state
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(true);

  // 129 Tests Explorer state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPi, setSelectedPi] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDanger, setSelectedDanger] = useState<string>("ALL");
  const [selectedRestrictor, setSelectedRestrictor] = useState<string>("ALL");
  const [inspectedTest, setInspectedTest] = useState<BassTest | null>(null);

  // Flame Studio state
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(
    "/videos/BASS_GMT50_SAMPLE_147_TEST_B1.mp4"
  );
  const [threshold, setThreshold] = useState<number>(140);
  const [cvMetrics, setCvMetrics] = useState<{
    area: number;
    len: number;
    wid: number;
    per: number;
    cx: number;
    cy: number;
    status: string;
  } | null>(null);
  const [isSampling, setIsSampling] = useState<boolean>(false);
  const [sampledAreaCurve, setSampledAreaCurve] = useState<number[]>([]);

  // Sensor Analytics state
  const [sensorRunIndex, setSensorRunIndex] = useState<number>(0);
  const [sensorChannel, setSensorChannel] = useState<"co_ppm" | "o2" | "co2" | "airflow_cms">("co_ppm");
  const [zThreshold, setZThreshold] = useState<number>(3.0);
  const [activeAlgorithm, setActiveAlgorithm] = useState<"robust_z" | "fixed_threshold">("robust_z");

  // Compare state
  const [compareA, setCompareA] = useState<number>(0); // B1
  const [compareB, setCompareB] = useState<number>(1); // M5

  // Evidence state
  const [evidenceFilter, setEvidenceFilter] = useState<string>("ALL");
  const [evidenceSearch, setEvidenceSearch] = useState<string>("");

  // Canvas Refs
  const flameVideoRef = useRef<HTMLVideoElement | null>(null);
  const flameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const areaChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mcChartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sensorChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hash-based client routing
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace("#", "") || "/";
      setCurrentRoute(h);
      window.scrollTo(0, 0);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = `#${path}`;
  };

  const currentHero = HERO_RUNS[selectedHeroIndex] || HERO_RUNS[0];
  const currentSensorRun = HERO_RUNS[sensorRunIndex] || HERO_RUNS[0];

  // Draw Mission Control Chart
  useEffect(() => {
    if (currentRoute !== "/mc" || !mcChartCanvasRef.current) return;
    const cv = mcChartCanvasRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = (cv.width = cv.clientWidth * 2);
    const H = (cv.height = 280);
    ctx.clearRect(0, 0, W, H);

    const telemetry = currentHero.telemetry;
    const times = telemetry.time_s;
    const n = times.length;
    if (n < 2) return;

    // Grid
    ctx.strokeStyle = "#1b2848";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = 30 + (i * (H - 60)) / 4;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(W - 20, y);
      ctx.stroke();
    }

    const drawLine = (data: number[], color: string, minVal: number, maxVal: number) => {
      if (maxVal === minVal) maxVal += 1;
      const getX = (idx: number) => 60 + (idx / (n - 1)) * (W - 80);
      const getY = (val: number) => H - 30 - ((val - minVal) / (maxVal - minVal)) * (H - 60);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = color;
      data.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const maxCo = Math.max(...telemetry.co_ppm, 10);
    drawLine(telemetry.co_ppm, "#f39c12", 0, maxCo);

    const minO2 = Math.min(...telemetry.o2) - 0.5;
    const maxO2 = Math.max(...telemetry.o2) + 0.5;
    drawLine(telemetry.o2, "#4fd1e8", minO2, maxO2);

    // Anomaly markers
    currentHero.anomalies.forEach((a) => {
      const idx = times.indexOf(a.time_s);
      if (idx !== -1) {
        const x = 60 + (idx / (n - 1)) * (W - 80);
        ctx.strokeStyle = "#e74c3c";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, H - 30);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(`⚡ ${a.type}`, x + 5, 45);
      }
    });

    ctx.fillStyle = "#98a6c3";
    ctx.font = "18px sans-serif";
    ctx.fillText(`CO (0 - ${maxCo.toFixed(0)} ppm)`, 60, 22);
    ctx.fillText(`O₂ (${minO2.toFixed(1)}% - ${maxO2.toFixed(1)}%)`, W - 220, 22);
    ctx.fillText("Time (s)", W / 2 - 30, H - 6);
  }, [currentRoute, selectedHeroIndex, currentHero]);

  // Sensor Analytics Chart
  useEffect(() => {
    if (currentRoute !== "/sensor" || !sensorChartCanvasRef.current) return;
    const cv = sensorChartCanvasRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = (cv.width = cv.clientWidth * 2);
    const H = (cv.height = 240);
    ctx.clearRect(0, 0, W, H);

    const values = currentSensorRun.telemetry[sensorChannel];
    const times = currentSensorRun.telemetry.time_s;
    const n = values.length;
    if (n < 2) return;

    const minV = Math.min(...values);
    let maxV = Math.max(...values);
    if (maxV === minV) maxV += 1;

    const getX = (idx: number) => 60 + (idx / (n - 1)) * (W - 80);
    const getY = (val: number) => H - 30 - ((val - minV) / (maxV - minV)) * (H - 60);

    ctx.strokeStyle = "#1b2848";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = 30 + (i * (H - 60)) / 3;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(W - 20, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "#4fd1e8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = getX(i);
      const y = getY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const devs = values.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
    const mad = devs[Math.floor(devs.length / 2)] || 1e-6;

    const mean = values.reduce((p, c) => p + c, 0) / n;
    const sd = Math.sqrt(values.reduce((p, c) => p + Math.pow(c - mean, 2), 0) / n) || 1e-6;

    values.forEach((v, i) => {
      let isFlagged = false;
      if (activeAlgorithm === "robust_z") {
        const robustZ = Math.abs((0.6745 * (v - median)) / mad);
        if (robustZ >= zThreshold) isFlagged = true;
      } else {
        const stdZ = Math.abs((v - mean) / sd);
        if (stdZ >= zThreshold) isFlagged = true;
      }

      if (isFlagged) {
        const x = getX(i);
        const y = getY(v);
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.fillStyle = "#98a6c3";
    ctx.font = "18px sans-serif";
    ctx.fillText(`${minV.toFixed(1)}`, 10, H - 25);
    ctx.fillText(`${maxV.toFixed(1)}`, 10, 30);
  }, [currentRoute, currentSensorRun, sensorChannel, zThreshold, activeAlgorithm]);

  // Video Frame CV Processing function
  const processCurrentFrame = () => {
    const video = flameVideoRef.current;
    const canvas = flameCanvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const scale = Math.min(1, 480 / w);
    const cw = (canvas.width = Math.floor(w * scale));
    const ch = (canvas.height = Math.floor(h * scale));

    ctx.drawImage(video, 0, 0, cw, ch);
    const imgData = ctx.getImageData(0, 0, cw, ch);
    const data = imgData.data;

    let area = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = cw;
    let maxX = 0;
    let minY = ch;
    let maxY = 0;
    const mask = new Uint8Array(cw * ch);

    for (let i = 0; i < mask.length; i++) {
      const idx = i * 4;
      const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
      if (luma > threshold) {
        mask[i] = 1;
        area++;
        const px = i % cw;
        const py = Math.floor(i / cw);
        sumX += px;
        sumY += py;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
    }

    let per = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i]) {
        const px = i % cw;
        if (!mask[i - 1] || !mask[i + 1] || !mask[i - cw] || !mask[i + cw] || px === 0 || px === cw - 1) {
          per++;
        }
      }
    }

    for (let i = 0; i < mask.length; i++) {
      if (mask[i]) {
        const idx = i * 4;
        data[idx] = 245;
        data[idx + 1] = 166;
        data[idx + 2] = 35;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    if (area > 5) {
      const cx = sumX / area;
      const cy = sumY / area;
      const len = maxX - minX + 1;
      const wid = maxY - minY + 1;

      ctx.strokeStyle = "#4fd1e8";
      ctx.lineWidth = 2;
      ctx.strokeRect(minX, minY, len, wid);

      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      setCvMetrics({
        area,
        len,
        wid,
        per,
        cx: Math.round(cx),
        cy: Math.round(cy),
        status: "Active Luminous Flame",
      });
    } else {
      setCvMetrics({
        area: 0,
        len: 0,
        wid: 0,
        per: 0,
        cx: 0,
        cy: 0,
        status: "Extinguished / Quenched",
      });
    }
  };

  // Sample 20 frames across video duration
  const sampleVideoFrames = async () => {
    const video = flameVideoRef.current;
    if (!video || !video.duration) return;
    setIsSampling(true);
    const duration = video.duration;
    const areas: number[] = [];

    const originalTime = video.currentTime;
    for (let i = 0; i < 20; i++) {
      const targetTime = (duration * i) / 19;
      video.currentTime = targetTime;
      await new Promise((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve(true);
        };
        video.addEventListener("seeked", onSeeked);
      });
      processCurrentFrame();
      const canvas = flameCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let a = 0;
          for (let p = 0; p < imgData.length; p += 4) {
            const luma = 0.2126 * imgData[p] + 0.7152 * imgData[p + 1] + 0.0722 * imgData[p + 2];
            if (luma > threshold) a++;
          }
          areas.push(a);
        }
      }
    }
    video.currentTime = originalTime;
    setSampledAreaCurve(areas);
    setIsSampling(false);

    if (areaChartCanvasRef.current) {
      const cv = areaChartCanvasRef.current;
      const ctx = cv.getContext("2d");
      if (ctx) {
        const W = (cv.width = cv.clientWidth * 2);
        const H = (cv.height = 180);
        ctx.clearRect(0, 0, W, H);

        const maxA = Math.max(...areas, 100);
        ctx.strokeStyle = "#f39c12";
        ctx.lineWidth = 3;
        ctx.beginPath();
        areas.forEach((val, idx) => {
          const x = 40 + (idx / 19) * (W - 60);
          const y = H - 25 - (val / maxA) * (H - 50);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = "#f39c12";
        areas.forEach((val, idx) => {
          const x = 40 + (idx / 19) * (W - 60);
          const y = H - 25 - (val / maxA) * (H - 50);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = "#98a6c3";
        ctx.font = "18px sans-serif";
        ctx.fillText(`Max Area: ${maxA} px²`, 40, 20);
        ctx.fillText("Time (0s → Duration)", W / 2 - 60, H - 5);
      }
    }
  };

  // Filtered 129 Tests
  const filteredTests = useMemo(() => {
    return ALL_TESTS.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        t.test_id.toLowerCase().includes(q) ||
        t.fuel.toLowerCase().includes(q) ||
        t.pi.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      const matchPi = selectedPi === "ALL" || t.pi === selectedPi;
      const matchCat = selectedCategory === "ALL" || t.category === selectedCategory;
      const matchDanger = selectedDanger === "ALL" || t.danger_level === selectedDanger;
      const matchRestr =
        selectedRestrictor === "ALL" ||
        (t.flow_restrictor !== null && String(t.flow_restrictor) === selectedRestrictor);

      return matchQuery && matchPi && matchCat && matchDanger && matchRestr;
    });
  }, [searchQuery, selectedPi, selectedCategory, selectedDanger, selectedRestrictor]);

  const uniquePis = useMemo(() => {
    return Array.from(new Set(ALL_TESTS.map((t) => t.pi)));
  }, []);

  const filteredEvidence = useMemo(() => {
    return EVIDENCE_CARDS.filter((e) => {
      const matchCat = evidenceFilter === "ALL" || e.category === evidenceFilter;
      const q = evidenceSearch.toLowerCase();
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.authors.toLowerCase().includes(q) ||
        e.key_finding.toLowerCase().includes(q) ||
        e.supports.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [evidenceFilter, evidenceSearch]);

  const exportTelemetryCsv = () => {
    const t = currentHero.telemetry;
    let csv = "time_s,oxygen_pct,co2_pct,co_ppm,airflow_cms\n";
    for (let i = 0; i < t.time_s.length; i++) {
      csv += `${t.time_s[i]},${t.o2[i]},${t.co2[i]},${t.co_ppm[i]},${t.airflow_cms[i]}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NASA_BASS_II_${currentHero.test_id}_Telemetry.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Fallback inline stylesheet to guarantee pixel-perfect UI */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root{box-sizing:border-box;--bg:#0a1224;--card:#111c36;--bd:#223256;--tx:#e8edf7;--mu:#98a6c3;--cy:#4fd1e8;--am:#f5b041;--ok:#6ee7a0;--danger:#e74c3c;color-scheme:dark}
        html{scroll-padding-top:env(safe-area-inset-top,0px)}*{box-sizing:border-box}
        body{margin:0;background:linear-gradient(160deg,#0a1224,#0d1b3a 60%,#0a1224);color:var(--tx);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;min-height:100vh}
        a{color:var(--cy);text-decoration:none}a:hover{text-decoration:underline}
        nav{position:sticky;top:0;z-index:50;display:flex;gap:4px;flex-wrap:wrap;align-items:center;padding:10px 16px;background:#0a1224ee;border-bottom:1px solid var(--bd);backdrop-filter:blur(8px)}
        nav b{margin-right:auto;letter-spacing:.08em;color:var(--cy);font-size:1.15rem}
        nav a,button,select,input{font:inherit}
        nav a{color:var(--mu);text-decoration:none;padding:6px 12px;border-radius:8px;font-size:0.9rem;cursor:pointer}
        nav a.on,nav a:hover{color:var(--tx);background:var(--card);border:1px solid var(--bd)}
        main{max-width:1140px;margin:auto;padding:20px 16px}
        h1{font-size:2rem;margin:.2em 0 .4em;color:#fff}h2{font-size:1.3rem;margin:.3em 0 .6em;color:#fff}h3{margin:.2em 0 .5em;font-size:1.05rem;color:#fff}
        .g{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
        .c{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:16px;box-shadow:0 0 20px #4fd1e808}
        .mu{color:var(--mu);font-size:.85rem}
        button,.btn{background:var(--cy);color:#04101f;border:0;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-size:0.9rem}
        button:hover,.btn:hover{opacity:.9;text-decoration:none}
        button.s{background:transparent;color:var(--tx);border:1px solid var(--bd)}
        button.s:hover{background:#142345}
        button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--am);outline-offset:2px}
        select,input[type=text],input[type=search],input[type=range]{background:#070d19;color:var(--tx);border:1px solid var(--bd);border-radius:8px;padding:8px 12px}
        .tag{border:1px solid var(--bd);border-radius:99px;padding:2px 10px;font-size:.75rem;color:var(--cy);background:#142345;margin-right:6px;display:inline-block;font-weight:600}
        .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:10px 0}
        canvas{width:100%;background:#070d19;border-radius:8px;border:1px solid var(--bd)}
        .hero{padding:32px 0 24px}.hero p{max-width:720px;color:#b5c7e8;font-size:1.05rem;line-height:1.6}
        table{width:100%;border-collapse:collapse;font-size:.88rem}
        td,th{border-bottom:1px solid var(--bd);padding:8px 10px;text-align:left;vertical-align:middle}
        th{color:var(--mu);font-weight:600;text-transform:uppercase;font-size:.78rem;background:#091224}
        tr:hover td{background:#14234550}
        .ok{color:var(--ok)}.warn{color:var(--am)}.danger{color:var(--danger);font-weight:bold}.na{color:var(--mu);font-style:italic}
        .wrap{overflow-x:auto}
        footer{color:var(--mu);font-size:.85rem;padding:32px 16px;max-width:1140px;margin:40px auto 0;border-top:1px solid var(--bd);text-align:center}
      `}} />

      {/* Navigation */}
      <nav aria-label="Main Navigation">
        <b>🔥 FIREWISE-X</b>
        <span className="tag" style={{ border: "1px solid #1b437c" }}>NASA PSI-25 · BASS-II</span>
        <a onClick={() => navigateTo("/")} className={currentRoute === "/" ? "on" : ""}>Home</a>
        <a onClick={() => navigateTo("/mc")} className={currentRoute === "/mc" ? "on" : ""}>Mission Control</a>
        <a onClick={() => navigateTo("/exp")} className={currentRoute === "/exp" ? "on" : ""}>129 Tests Explorer</a>
        <a onClick={() => navigateTo("/flame")} className={currentRoute === "/flame" ? "on" : ""}>Flame Studio (CV)</a>
        <a onClick={() => navigateTo("/sensor")} className={currentRoute === "/sensor" ? "on" : ""}>Sensors & Anomaly</a>
        <a onClick={() => navigateTo("/evid")} className={currentRoute === "/evid" ? "on" : ""}>Evidence Engine</a>
        <a onClick={() => navigateTo("/cmp")} className={currentRoute === "/cmp" ? "on" : ""}>Compare Runs</a>
      </nav>

      {/* Main Container */}
      <main>
        {/* ========================================================= */}
        {/* TAB 1: HOME PAGE */}
        {/* ========================================================= */}
        {currentRoute === "/" && (
          <div>
            <section className="hero">
              <span className="tag" style={{ background: "#1b3668", color: "#4fd1e8" }}>
                🛰️ Real NASA ISS Flight Data Connected
              </span>
              <h1>Understand the Flame.<br /><span style={{ color: "var(--cy)" }}>Follow the Evidence.</span></h1>
              <p>
                In freefall, flames lose buoyancy, becoming rounded, slow, and deceptive. 
                NASA’s BASS-II experiment on the International Space Station proved that under low ventilation, 
                plastics and fabrics burn with lethal incomplete combustion, generating toxic carbon monoxide peaks up to 950 ppm.
                FIREWISE-X brings 129 spaceflight combustion tests, computer vision flame tracking, and peer-reviewed NASA literature into one traceable research engine.
              </p>
              <div className="row">
                <button onClick={() => navigateTo("/mc")}>🚀 Launch Mission Control</button>
                <button className="s" onClick={() => navigateTo("/exp")}>📊 Explore 129 Flight Tests</button>
                <button className="s" onClick={() => navigateTo("/flame")}>🎥 Analyze ISS Video (CV)</button>
              </div>
            </section>

            {/* Quick Stats Grid */}
            <div className="g" style={{ marginTop: "20px" }}>
              <div className="c" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--cy)" }}>129</div>
                <div className="mu">Flight Tests</div>
              </div>
              <div className="c" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ok)" }}>6</div>
                <div className="mu">Principal Investigators</div>
              </div>
              <div className="c" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--am)" }}>950 ppm</div>
                <div className="mu">Peak Toxic CO Spike</div>
              </div>
              <div className="c" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#9b59b6" }}>2</div>
                <div className="mu">ISS Flight Videos Loaded</div>
              </div>
              <div className="c" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--danger)" }}>6</div>
                <div className="mu">NTRS Publications Linked</div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="g" style={{ marginTop: "20px" }}>
              <div className="c">
                <h3>🔬 Full Flight Data Provenance</h3>
                <p className="mu">
                  No mock or synthetic generators. Directly ingests 129 tests from NASA PSI-25 (DOI: 10.60555/4qc4-de67) spanning PMMA films, thick slabs, rods, and Nomex fabrics.
                </p>
              </div>
              <div className="c">
                <h3>📐 Explainable Classical CV</h3>
                <p className="mu">
                  Frame-by-frame luminance segmentation tracks flame front coordinates, area growth in pixels, and quenching limits with honest boundary disclosures.
                </p>
              </div>
              <div className="c">
                <h3>📚 Evidence-Grounded Insights</h3>
                <p className="mu">
                  Every anomalous telemetry window maps directly to published NASA Technical Memorandums and peer-reviewed papers with exact page locators and limitation boundaries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MISSION CONTROL */}
        {/* ========================================================= */}
        {currentRoute === "/mc" && (
          <div>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: "16px" }}>
              <div className="row">
                <h1 style={{ margin: 0 }}>Mission Control</h1>
                <select
                  value={selectedHeroIndex}
                  onChange={(e) => setSelectedHeroIndex(Number(e.target.value))}
                  aria-label="Select Hero Run"
                >
                  {HERO_RUNS.map((run, idx) => (
                    <option key={run.id} value={idx}>
                      {run.test_id} — {run.title.split("—")[1] || run.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <button className="s" onClick={() => setShowHowToUse(!showHowToUse)}>
                  {showHowToUse ? "Hide Instructions" : "How to Use"}
                </button>
                <button onClick={exportTelemetryCsv}>📥 Export Run CSV</button>
                <button className="s" onClick={() => window.print()}>🖨️ Print Report</button>
              </div>
            </div>

            {showHowToUse && (
              <div className="c" style={{ marginBottom: "16px", borderColor: "var(--cy)" }}>
                <p className="mu" style={{ margin: 0 }}>
                  <b style={{ color: "#fff" }}>Workflow Guide:</b> 1) Select a featured NASA flight run from the dropdown. 2) Inspect the telemetry time-series below (Orange line: CO ppm, Cyan line: O₂ %, Red dashes: event anomalies). 3) Read the evidence-grounded interpretation derived from NASA/TM-20210011385. 4) Verify the linked peer-reviewed publication below.
                </p>
              </div>
            )}

            <div className="g" style={{ gridTemplateColumns: "1fr 2fr", marginBottom: "20px" }}>
              {/* Left Column: Metadata */}
              <div className="c">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="tag">Test ID: {currentHero.test_id}</span>
                  <span className="mu">GMT Day: {currentHero.gmt}</span>
                </div>
                <h2>{currentHero.title}</h2>
                <table>
                  <tbody>
                    <tr><td className="mu">Investigator</td><td><b>{currentHero.pi}</b></td></tr>
                    <tr><td className="mu">Material</td><td>{currentHero.material}</td></tr>
                    <tr><td className="mu">Thickness</td><td>{currentHero.thickness_mm} mm</td></tr>
                    <tr><td className="mu">Airflow</td><td>{currentHero.air_speed_nominal}</td></tr>
                    <tr><td className="mu">Initial O₂</td><td>{currentHero.initial_o2}%</td></tr>
                    <tr><td className="mu">Final O₂</td><td>{currentHero.final_o2}%</td></tr>
                    <tr><td className="mu">Peak CO</td><td><b className="warn">{currentHero.final_co_ppm} ppm</b></td></tr>
                  </tbody>
                </table>
                {currentHero.has_video && (
                  <div style={{ marginTop: "14px" }}>
                    <button
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => {
                        if (currentHero.video_url) setSelectedVideoUrl(currentHero.video_url);
                        navigateTo("/flame");
                      }}
                    >
                      🎥 Open ISS Video in Flame Studio
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Telemetry & Outcome */}
              <div className="c">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>ISS Sensor Telemetry (Time-Series)</h3>
                  <div className="row" style={{ fontSize: "0.85rem" }}>
                    <span className="warn">● Carbon Monoxide (ppm)</span>
                    <span style={{ color: "var(--cy)" }}>● Oxygen (%)</span>
                  </div>
                </div>
                <div style={{ margin: "12px 0" }}>
                  <canvas ref={mcChartCanvasRef}></canvas>
                </div>
                <div className="c" style={{ background: "#070d19" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="mu" style={{ fontWeight: "bold" }}>NASA Ground Truth Observation:</span>
                    <span className={currentHero.co_danger.includes("Critical") ? "danger" : "ok"}>
                      {currentHero.co_danger}
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>{currentHero.outcome}</p>
                </div>
              </div>
            </div>

            {/* Evidence Cards */}
            <h3>Supporting NASA Publications & Evidence Cards</h3>
            <div className="g">
              {EVIDENCE_CARDS.filter((card) => currentHero.evidence_ids.includes(card.id)).map((card) => (
                <div key={card.id} className="c">
                  <span className="tag">{card.category}</span>
                  <h4 style={{ margin: "8px 0 4px", color: "#fff" }}>{card.title}</h4>
                  <div className="mu">{card.authors} ({card.year})</div>
                  <p style={{ fontSize: "0.88rem" }}><b>Key Finding:</b> {card.key_finding}</p>
                  <p className="ok" style={{ fontSize: "0.85rem" }}><b>Supports:</b> {card.supports}</p>
                  <p className="warn" style={{ fontSize: "0.85rem" }}><b>Honest Limits:</b> {card.limitations}</p>
                  <div style={{ marginTop: "10px", borderTop: "1px solid var(--bd)", paddingTop: "8px" }}>
                    <a href={card.url} target="_blank" rel="noopener noreferrer">
                      Read NASA Paper (DOI: {card.doi}) ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: 129 TESTS EXPLORER */}
        {/* ========================================================= */}
        {currentRoute === "/exp" && (
          <div>
            <div className="c" style={{ marginBottom: "16px" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ margin: 0 }}>NASA BASS-II 129 Flight Tests Explorer</h1>
                  <div className="mu">Official Physical Sciences Informatics (PSI-25) flight test catalog</div>
                </div>
                <span className="tag">Showing {filteredTests.length} of {ALL_TESTS.length} tests</span>
              </div>

              <div className="row" style={{ marginTop: "14px" }}>
                <input
                  type="search"
                  placeholder="Search test ID, material, PI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: "1 1 200px" }}
                />
                <select value={selectedPi} onChange={(e) => setSelectedPi(e.target.value)}>
                  <option value="ALL">All Investigators ({uniquePis.length})</option>
                  {uniquePis.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="ALL">All Material Types</option>
                  <option value="PMMA Film">PMMA Film (Thin)</option>
                  <option value="PMMA Slab">PMMA Slab (Thick)</option>
                  <option value="PMMA Rod">PMMA Rod (Cylinder)</option>
                  <option value="SIBAL">SIBAL Insulation</option>
                  <option value="Nomex Fabric">Nomex Space Fabric</option>
                  <option value="Wax Candle">Wax Candle</option>
                </select>
                <select value={selectedDanger} onChange={(e) => setSelectedDanger(e.target.value)}>
                  <option value="ALL">All Toxicity Levels</option>
                  <option value="Low (<50 ppm)">Low (&lt;50 ppm CO)</option>
                  <option value="Moderate (50-200 ppm)">Moderate (50-200 ppm)</option>
                  <option value="High (200-500 ppm)">High (200-500 ppm)</option>
                  <option value="Critical (500+ ppm)">Critical (500+ ppm CO)</option>
                </select>
                <select value={selectedRestrictor} onChange={(e) => setSelectedRestrictor(e.target.value)}>
                  <option value="ALL">All Flow Restrictors</option>
                  <option value="0">0 (Unrestricted Flow)</option>
                  <option value="1">1 (Medium Restriction)</option>
                  <option value="2">2 (Max Restriction / Low Flow)</option>
                </select>
              </div>
            </div>

            <div className="c wrap">
              <table>
                <thead>
                  <tr>
                    <th>Test ID</th>
                    <th>Investigator</th>
                    <th>Material & Dimensions</th>
                    <th>Restrictor</th>
                    <th>O₂ Initial → Final</th>
                    <th>CO₂ Prod.</th>
                    <th>Peak CO</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.slice(0, 50).map((t) => (
                    <tr key={t.id}>
                      <td><b style={{ color: "var(--cy)" }}>{t.test_id}</b></td>
                      <td>{t.pi}</td>
                      <td>
                        <b>{t.category}</b> {t.thickness_mm !== null && <span className="mu">({t.thickness_mm} mm)</span>}
                        <div className="mu" style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.fuel}</div>
                      </td>
                      <td>{t.flow_restrictor !== null ? `Flow ${t.flow_restrictor}` : "—"}</td>
                      <td>
                        {t.o2_initial !== null ? `${t.o2_initial}%` : "—"} → {t.o2_final !== null ? `${t.o2_final}%` : "—"}
                        {t.o2_consumed !== null && t.o2_consumed > 0 && <span className="ok" style={{ marginLeft: "4px" }}>(-{t.o2_consumed}%)</span>}
                      </td>
                      <td>{t.co2_produced !== null ? `+${t.co2_produced}%` : "—"}</td>
                      <td>
                        {t.co_final !== null ? (
                          <span className={t.danger_level.includes("Critical") ? "danger" : t.danger_level.includes("High") ? "warn" : "ok"}>
                            {t.co_final} ppm
                          </span>
                        ) : "—"}
                      </td>
                      <td>
                        <button className="s" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => setInspectedTest(t)}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTests.length > 50 && (
                <div style={{ textAlign: "center", padding: "12px", color: "var(--mu)" }}>
                  Showing first 50 results. Use filters to narrow down.
                </div>
              )}
            </div>

            {/* Modal */}
            {inspectedTest && (
              <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div className="c" style={{ maxWidth: "560px", width: "100%", border: "1px solid var(--cy)" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <h2>Test {inspectedTest.test_id} Detailed Telemetry</h2>
                    <button className="s" onClick={() => setInspectedTest(null)}>✕</button>
                  </div>
                  <table>
                    <tbody>
                      <tr><td className="mu">Investigator</td><td><b>{inspectedTest.pi}</b></td></tr>
                      <tr><td className="mu">Date / GMT</td><td>{inspectedTest.date} (GMT {inspectedTest.gmt})</td></tr>
                      <tr><td className="mu">Fuel Material</td><td>{inspectedTest.fuel}</td></tr>
                      <tr><td className="mu">O₂ Depletion</td><td className="ok">{inspectedTest.o2_initial}% → {inspectedTest.o2_final}%</td></tr>
                      <tr><td className="mu">Peak CO</td><td className="warn"><b>{inspectedTest.co_initial} → {inspectedTest.co_final} ppm</b></td></tr>
                      <tr><td className="mu">Airflow / Fan</td><td>{inspectedTest.air_display || inspectedTest.fan_display || "Not recorded"}</td></tr>
                      <tr><td className="mu">Frames Recorded</td><td>{inspectedTest.frames ? `${inspectedTest.frames} frames` : "Continuous Video"}</td></tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: "14px", textAlign: "right" }}>
                    <button onClick={() => setInspectedTest(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FLAME ANALYSIS STUDIO (CV) */}
        {/* ========================================================= */}
        {currentRoute === "/flame" && (
          <div>
            <div className="c" style={{ marginBottom: "16px" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ margin: 0 }}>Flame Analysis Studio — Classical Computer Vision</h1>
                  <div className="mu">Frame-by-frame luminance threshold segmentation and morphological feature extraction</div>
                </div>
                <select value={selectedVideoUrl} onChange={(e) => setSelectedVideoUrl(e.target.value)}>
                  <option value="/videos/BASS_GMT50_SAMPLE_147_TEST_B1.mp4">Test B1: 100 µm PMMA Film (Rapid Extinction)</option>
                  <option value="/videos/BASS_GMT190_SAMPLE_146_TEST_T22.mp4">Test T22: 1 cm SIBAL Fabric (Opposed Spread)</option>
                </select>
              </div>

              <div className="c" style={{ background: "#070d19", margin: "14px 0" }}>
                <p className="mu" style={{ margin: 0 }}>
                  <b style={{ color: "#fff" }}>Methodology:</b> Real-time Classical Rec.709 Luma segmentation (<code>L = 0.2126R + 0.7152G + 0.0722B</code>). Luminous flame pixels exceeding threshold are highlighted in gold; bounding box and centroid (●) are tracked dynamically. <b className="warn">Boundary:</b> 2D projected pixel area does not represent 3D heat release without spatial calibration.
                </p>
              </div>

              <div className="row">
                <label className="row">
                  <b>Luminance Threshold:</b>
                  <input
                    type="range"
                    min="40"
                    max="220"
                    value={threshold}
                    onChange={(e) => { setThreshold(Number(e.target.value)); processCurrentFrame(); }}
                  />
                  <b style={{ color: "var(--cy)" }}>{threshold}</b>
                </label>
                <button onClick={sampleVideoFrames} disabled={isSampling}>
                  {isSampling ? "Sampling 20 Frames..." : "📊 Sample 20 Frames → Flame Area vs Time"}
                </button>
              </div>
            </div>

            <div className="g" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {/* Video Player */}
              <div className="c">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>ISS Flight Camera Feed (Raw MP4)</h3>
                  <span className="ok">● Scrub / Play Active</span>
                </div>
                <video
                  ref={flameVideoRef}
                  src={selectedVideoUrl}
                  controls
                  crossOrigin="anonymous"
                  onTimeUpdate={processCurrentFrame}
                  onSeeked={processCurrentFrame}
                  onLoadedData={processCurrentFrame}
                  style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
                />
                <p className="mu">Pause or scrub the video above. The computer vision pipeline on the right immediately analyzes the current video frame.</p>
              </div>

              {/* CV Canvas */}
              <div className="c">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>Segmented Flame & Morphological Bounds</h3>
                  <span style={{ color: "var(--cy)", fontWeight: "bold" }}>{cvMetrics?.status || "Ready"}</span>
                </div>
                <canvas ref={flameCanvasRef} style={{ marginTop: "10px" }}></canvas>
                {cvMetrics && (
                  <div className="g" style={{ marginTop: "10px", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
                    <div className="c" style={{ padding: "8px" }}>
                      <div className="mu">Luminous Area</div>
                      <div className="warn" style={{ fontWeight: "bold" }}>{cvMetrics.area} px²</div>
                    </div>
                    <div className="c" style={{ padding: "8px" }}>
                      <div className="mu">Length × Width</div>
                      <div style={{ fontWeight: "bold" }}>{cvMetrics.len} × {cvMetrics.wid}</div>
                    </div>
                    <div className="c" style={{ padding: "8px" }}>
                      <div className="mu">Perimeter</div>
                      <div style={{ fontWeight: "bold" }}>{cvMetrics.per} px</div>
                    </div>
                    <div className="c" style={{ padding: "8px" }}>
                      <div className="mu">Centroid (X,Y)</div>
                      <div style={{ color: "var(--cy)", fontWeight: "bold" }}>({cvMetrics.cx}, {cvMetrics.cy})</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {sampledAreaCurve.length > 0 && (
              <div className="c" style={{ marginTop: "16px" }}>
                <h3>Extracted Flame Area History Across Flight Video (20 Temporal Points)</h3>
                <canvas ref={areaChartCanvasRef}></canvas>
                <p className="mu">Shows luminous flame expansion, stabilization, and quenching curve as forced flow diminishes in the microgravity duct.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SENSOR ANALYTICS */}
        {/* ========================================================= */}
        {currentRoute === "/sensor" && (
          <div>
            <div className="c" style={{ marginBottom: "16px" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ margin: 0 }}>Sensor Analytics & Anomaly Detection</h1>
                  <div className="mu">Compare Robust Rolling Z-score (Median/MAD) against Fixed Threshold Baselines</div>
                </div>
                <div className="row">
                  <select value={sensorRunIndex} onChange={(e) => setSensorRunIndex(Number(e.target.value))}>
                    {HERO_RUNS.map((r, i) => (<option key={r.id} value={i}>{r.test_id}: {r.category}</option>))}
                  </select>
                  <select value={sensorChannel} onChange={(e) => setSensorChannel(e.target.value as any)}>
                    <option value="co_ppm">Carbon Monoxide (ppm)</option>
                    <option value="o2">Oxygen (% vol)</option>
                    <option value="co2">Carbon Dioxide (% vol)</option>
                    <option value="airflow_cms">Airflow Speed (cm/s)</option>
                  </select>
                </div>
              </div>

              <div className="g" style={{ marginTop: "14px" }}>
                <div
                  className="c"
                  style={{ cursor: "pointer", borderColor: activeAlgorithm === "robust_z" ? "var(--cy)" : "var(--bd)" }}
                  onClick={() => setActiveAlgorithm("robust_z")}
                >
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <b>1. Proposed: Robust Rolling Z-Score (Median & MAD)</b>
                    {activeAlgorithm === "robust_z" && <span className="tag">ACTIVE</span>}
                  </div>
                  <p className="mu">
                    Computes modified Z-score: <code>Z = 0.6745 · (x − median) / MAD</code>. Resilient against extreme 950 ppm sensor spikes that distort mean and standard deviation.
                  </p>
                </div>

                <div
                  className="c"
                  style={{ cursor: "pointer", borderColor: activeAlgorithm === "fixed_threshold" ? "var(--cy)" : "var(--bd)" }}
                  onClick={() => setActiveAlgorithm("fixed_threshold")}
                >
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <b>2. Baseline: Standard Deviation Threshold</b>
                    {activeAlgorithm === "fixed_threshold" && <span className="tag">ACTIVE</span>}
                  </div>
                  <p className="mu">
                    Computes standard Z-score: <code>Z = (x − mean) / SD</code>. Standard approach; susceptible to masking anomalies during prolonged smoldering events.
                  </p>
                </div>
              </div>

              <div className="row" style={{ marginTop: "12px" }}>
                <label className="row">
                  <b>Sensitivity Threshold (|Z| &gt; {zThreshold}):</b>
                  <input
                    type="range"
                    min="1.5"
                    max="6.0"
                    step="0.5"
                    value={zThreshold}
                    onChange={(e) => setZThreshold(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="c">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ margin: 0 }}>
                  Detected Anomaly Flags (<span className="danger">● Red Dots</span>) on Channel: {sensorChannel.toUpperCase()}
                </h3>
                <span className="mu">Method: {activeAlgorithm === "robust_z" ? "Robust Z (Median/MAD)" : "Standard Z (Mean/SD)"}</span>
              </div>
              <div style={{ margin: "14px 0" }}>
                <canvas ref={sensorChartCanvasRef}></canvas>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: EVIDENCE ENGINE */}
        {/* ========================================================= */}
        {currentRoute === "/evid" && (
          <div>
            <div className="c" style={{ marginBottom: "16px" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ margin: 0 }}>NASA Evidence & Literature Engine</h1>
                  <div className="mu">Peer-reviewed citations and technical reports backing BASS-II microgravity fire research</div>
                </div>
                <div className="row">
                  <input
                    type="search"
                    placeholder="Search literature..."
                    value={evidenceSearch}
                    onChange={(e) => setEvidenceSearch(e.target.value)}
                  />
                  <select value={evidenceFilter} onChange={(e) => setEvidenceFilter(e.target.value)}>
                    <option value="ALL">All Categories</option>
                    <option value="Extinction Boundary">Extinction Boundary</option>
                    <option value="Rod Flammability & Toxicity">Rod Flammability & Toxicity</option>
                    <option value="Mission Safety Report">Mission Safety Report</option>
                    <option value="Combustion Regimes">Combustion Regimes</option>
                    <option value="Fabric & Insulation Safety">Fabric & Insulation Safety</option>
                    <option value="Intermediate Thickness Fuel">Intermediate Thickness Fuel</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="g" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {filteredEvidence.map((card) => (
                <div key={card.id} className="c" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="tag">{card.category}</span>
                      <span className="mu">{card.year}</span>
                    </div>
                    <h3 style={{ margin: "8px 0 4px" }}>{card.title}</h3>
                    <div className="mu"><b>Authors:</b> {card.authors}</div>
                    <div className="mu"><b>Journal/Citation:</b> {card.journal}</div>
                    <div className="c" style={{ background: "#070d19", margin: "12px 0 8px" }}>
                      <p style={{ margin: "0 0 6px" }}><b>Key Finding:</b> {card.key_finding}</p>
                      <p className="ok" style={{ margin: "0 0 6px" }}><b>Supports:</b> {card.supports}</p>
                      <p className="warn" style={{ margin: 0 }}><b>Honest Limitations:</b> {card.limitations}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid var(--bd)", paddingTop: "10px", marginTop: "10px" }}>
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: "0.82rem", padding: "6px 12px" }}>
                      Open Publication (DOI: {card.doi}) ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: COMPARE EXPERIMENTS */}
        {/* ========================================================= */}
        {currentRoute === "/cmp" && (
          <div>
            <div className="c" style={{ marginBottom: "16px" }}>
              <h1 style={{ margin: 0 }}>Compare Flight Experiments</h1>
              <div className="mu">Side-by-side comparative analysis of fuel geometries, oxygen levels, and toxic combustion signatures</div>
              <div className="row" style={{ marginTop: "14px" }}>
                <label className="row">
                  <b style={{ color: "var(--cy)" }}>Run A:</b>
                  <select value={compareA} onChange={(e) => setCompareA(Number(e.target.value))}>
                    {HERO_RUNS.map((r, i) => (<option key={r.id} value={i}>{r.test_id}: {r.category}</option>))}
                  </select>
                </label>
                <label className="row">
                  <b className="warn">Run B:</b>
                  <select value={compareB} onChange={(e) => setCompareB(Number(e.target.value))}>
                    {HERO_RUNS.map((r, i) => (<option key={r.id} value={i}>{r.test_id}: {r.category}</option>))}
                  </select>
                </label>
              </div>
            </div>

            <div className="c wrap">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th style={{ color: "var(--cy)" }}>Run A: {HERO_RUNS[compareA].test_id} ({HERO_RUNS[compareA].category})</th>
                    <th className="warn">Run B: {HERO_RUNS[compareB].test_id} ({HERO_RUNS[compareB].category})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="mu">Investigator</td><td><b>{HERO_RUNS[compareA].pi}</b></td><td><b>{HERO_RUNS[compareB].pi}</b></td></tr>
                  <tr><td className="mu">Material Detail</td><td>{HERO_RUNS[compareA].material}</td><td>{HERO_RUNS[compareB].material}</td></tr>
                  <tr><td className="mu">Thickness (mm)</td><td>{HERO_RUNS[compareA].thickness_mm} mm</td><td>{HERO_RUNS[compareB].thickness_mm} mm</td></tr>
                  <tr><td className="mu">Initial O₂ Level</td><td>{HERO_RUNS[compareA].initial_o2}%</td><td>{HERO_RUNS[compareB].initial_o2}%</td></tr>
                  <tr>
                    <td className="mu">O₂ Depletion</td>
                    <td className="ok">
                      {HERO_RUNS[compareA].initial_o2 - HERO_RUNS[compareA].final_o2 > 0
                        ? `-${(HERO_RUNS[compareA].initial_o2 - HERO_RUNS[compareA].final_o2).toFixed(2)}%`
                        : "0%"}
                    </td>
                    <td className="ok">
                      {HERO_RUNS[compareB].initial_o2 - HERO_RUNS[compareB].final_o2 > 0
                        ? `-${(HERO_RUNS[compareB].initial_o2 - HERO_RUNS[compareB].final_o2).toFixed(2)}%`
                        : "0%"}
                    </td>
                  </tr>
                  <tr>
                    <td className="mu">Peak Carbon Monoxide</td>
                    <td><b className="warn" style={{ fontSize: "1.05rem" }}>{HERO_RUNS[compareA].final_co_ppm} ppm</b></td>
                    <td><b className="warn" style={{ fontSize: "1.05rem" }}>{HERO_RUNS[compareB].final_co_ppm} ppm</b></td>
                  </tr>
                  <tr>
                    <td className="mu">Toxicity Danger Level</td>
                    <td><span className="tag">{HERO_RUNS[compareA].co_danger}</span></td>
                    <td><span className="tag">{HERO_RUNS[compareB].co_danger}</span></td>
                  </tr>
                  <tr>
                    <td className="mu">Documented Outcome</td>
                    <td>{HERO_RUNS[compareA].outcome}</td>
                    <td>{HERO_RUNS[compareB].outcome}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <b>FIREWISE-X</b> · Developed for the NASA International Space Apps Challenge 2026.<br />
        Data Sources: NASA Physical Sciences Informatics (PSI-25, DOI: 10.60555/4qc4-de67) · NASA Technical Reports Server (NTRS).
      </footer>
    </>
  );
}
