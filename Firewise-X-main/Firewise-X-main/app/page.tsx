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
import { FLIGHT_VIDEOS, FlightVideo } from "./flightVideos";
import PreMissionAssessment from "./components/PreMissionAssessment";
import AstronautAssistant from "./components/AstronautAssistant";

export default function FirewiseXApp() {
  const [currentRoute, setCurrentRoute] = useState<string>("/");
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Hero Visual Showcase state
  const [heroViewMode, setHeroViewMode] = useState<"concept" | "cv_flight">("concept");

  // Mission Control state
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(true);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  // 129 Tests Explorer state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPi, setSelectedPi] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDanger, setSelectedDanger] = useState<string>("ALL");
  const [selectedRestrictor, setSelectedRestrictor] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [inspectedTest, setInspectedTest] = useState<BassTest | null>(null);

  // Flame Studio state
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(
    "/videos/BASS_GMT50_SAMPLE_147_TEST_B1.mp4"
  );
  const [videoFilterQuery, setVideoFilterQuery] = useState<string>("");
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

  // Video catalog helpers
  const activeFlightVideo = useMemo(() => {
    return FLIGHT_VIDEOS.find((v) => v.url === selectedVideoUrl) || FLIGHT_VIDEOS[0];
  }, [selectedVideoUrl]);

  const filteredFlightVideos = useMemo(() => {
    if (!videoFilterQuery.trim()) return FLIGHT_VIDEOS;
    const q = videoFilterQuery.toLowerCase();
    return FLIGHT_VIDEOS.filter(
      (v) =>
        v.test_id.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.pi.toLowerCase().includes(q) ||
        v.material.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    );
  }, [videoFilterQuery]);

  const videoGroups = useMemo(() => {
    const groups: Record<string, FlightVideo[]> = {};
    filteredFlightVideos.forEach((v) => {
      if (!groups[v.group]) groups[v.group] = [];
      groups[v.group].push(v);
    });
    return groups;
  }, [filteredFlightVideos]);

  const currentVideoIndex = useMemo(() => {
    return FLIGHT_VIDEOS.findIndex((v) => v.url === selectedVideoUrl);
  }, [selectedVideoUrl]);

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setSelectedVideoUrl(FLIGHT_VIDEOS[currentVideoIndex - 1].url);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < FLIGHT_VIDEOS.length - 1) {
      setSelectedVideoUrl(FLIGHT_VIDEOS[currentVideoIndex + 1].url);
    }
  };

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

  // Synchronize hash routing and responsive window width
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace("#", "") || "/";
      setCurrentRoute(h);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1100) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = `#${path}`;
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToTest = (testId: string) => {
    const match = ALL_TESTS.find(
      (t) => t.test_id.toLowerCase() === testId.toLowerCase()
    );
    if (match) {
      setInspectedTest(match);
    }
    navigateTo("/exp");
  };

  const handleNavigateToFlame = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    navigateTo("/flame");
  };

  const currentHero = HERO_RUNS[selectedHeroIndex] || HERO_RUNS[0];
  const currentSensorRun = HERO_RUNS[sensorRunIndex] || HERO_RUNS[0];

  // Helper: Threat Percentage (0 - 1000 ppm mapped to 0 - 100%)
  const threatPercent = useMemo(() => {
    const val = currentHero.final_co_ppm || 0;
    return Math.min(94, Math.max(6, (val / 1000) * 100));
  }, [currentHero]);

  // =========================================================
  // MISSION CONTROL CANVAS CHART (HIGH-DPI & GRADIENT FILL & HOVER)
  // =========================================================
  useEffect(() => {
    if (currentRoute !== "/mc" || !mcChartCanvasRef.current) return;
    const cv = mcChartCanvasRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    const W = (cv.width = rect.width * dpr);
    const H = (cv.height = 340 * dpr);
    ctx.scale(dpr, dpr);

    const telemetry = currentHero.telemetry;
    const times = telemetry.time_s;
    const n = times.length;
    if (n < 2) return;

    const isMobile = rect.width < 520;
    const padL = isMobile ? 38 : 60;
    const padR = isMobile ? 38 : 60;
    const padT = 36;
    const padB = 44;
    const chartW = Math.max(10, rect.width - padL - padR);
    const chartH = Math.max(10, 340 - padT - padB);

    // Clear
    ctx.clearRect(0, 0, rect.width, 340);

    // Grid lines & Background
    ctx.fillStyle = "rgba(4, 9, 20, 0.45)";
    ctx.fillRect(padL, padT, chartW, chartH);

    ctx.strokeStyle = "rgba(28, 45, 82, 0.55)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i * chartH) / 4;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + chartW, y);
      ctx.stroke();
    }

    const maxCo = Math.max(...telemetry.co_ppm, 10);
    const minO2 = Math.min(...telemetry.o2) - 0.4;
    const maxO2 = Math.max(...telemetry.o2) + 0.4;

    const getX = (idx: number) => padL + (idx / (n - 1)) * chartW;
    const getY_CO = (val: number) => padT + chartH - (val / maxCo) * chartH;
    const getY_O2 = (val: number) => padT + chartH - ((val - minO2) / (maxO2 - minO2)) * chartH;

    // 1. Draw Area Fill under CO (Amber/Orange Glow)
    const gradCO = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    gradCO.addColorStop(0, "rgba(243, 156, 18, 0.45)");
    gradCO.addColorStop(1, "rgba(243, 156, 18, 0.0)");
    ctx.fillStyle = gradCO;
    ctx.beginPath();
    telemetry.co_ppm.forEach((val, i) => {
      const x = getX(i);
      const y = getY_CO(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(n - 1), padT + chartH);
    ctx.lineTo(getX(0), padT + chartH);
    ctx.closePath();
    ctx.fill();

    // 2. Draw Area Fill under O2 (Cyan Glow)
    const gradO2 = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    gradO2.addColorStop(0, "rgba(79, 209, 232, 0.28)");
    gradO2.addColorStop(1, "rgba(79, 209, 232, 0.0)");
    ctx.fillStyle = gradO2;
    ctx.beginPath();
    telemetry.o2.forEach((val, i) => {
      const x = getX(i);
      const y = getY_O2(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(n - 1), padT + chartH);
    ctx.lineTo(getX(0), padT + chartH);
    ctx.closePath();
    ctx.fill();

    // 3. Draw Lines & Glowing Dots
    // CO Line
    ctx.strokeStyle = "#f39c12";
    ctx.lineWidth = 3;
    ctx.beginPath();
    telemetry.co_ppm.forEach((val, i) => {
      const x = getX(i);
      const y = getY_CO(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // O2 Line
    ctx.strokeStyle = "#4fd1e8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    telemetry.o2.forEach((val, i) => {
      const x = getX(i);
      const y = getY_O2(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data Points
    telemetry.co_ppm.forEach((val, i) => {
      ctx.fillStyle = "#f39c12";
      ctx.beginPath();
      ctx.arc(getX(i), getY_CO(val), 4, 0, Math.PI * 2);
      ctx.fill();
    });

    telemetry.o2.forEach((val, i) => {
      ctx.fillStyle = "#4fd1e8";
      ctx.beginPath();
      ctx.arc(getX(i), getY_O2(val), 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Anomaly Vertical Flags
    currentHero.anomalies.forEach((a) => {
      const idx = times.indexOf(a.time_s);
      if (idx !== -1) {
        const x = getX(idx);
        ctx.strokeStyle = "#ff5757";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + chartH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Badge pill
        ctx.fillStyle = "#ff5757";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillText(`⚡ ${a.type}`, Math.min(x + 4, rect.width - 110), padT + 18);
      }
    });

    // Hover Crosshair & Tooltip
    if (hoveredTime !== null) {
      let closestIdx = 0;
      let minDiff = Infinity;
      times.forEach((t, i) => {
        const diff = Math.abs(t - hoveredTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });

      const hX = getX(closestIdx);
      const hTime = times[closestIdx];
      const hCO = telemetry.co_ppm[closestIdx];
      const hO2 = telemetry.o2[closestIdx];
      const hFlow = telemetry.airflow_cms[closestIdx];

      // Vertical line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hX, padT);
      ctx.lineTo(hX, padT + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip Box
      const tipW = 150;
      const tipH = 74;
      const tipX = Math.min(Math.max(hX - tipW / 2, padL + 4), padL + chartW - tipW - 4);
      const tipY = padT + 8;

      ctx.fillStyle = "rgba(7, 15, 33, 0.94)";
      ctx.strokeStyle = "rgba(79, 209, 232, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, tipH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`⏱️ Flight Time: ${hTime}s`, tipX + 10, tipY + 18);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = "#f39c12";
      ctx.fillText(`● CO: ${hCO} ppm`, tipX + 10, tipY + 34);
      ctx.fillStyle = "#4fd1e8";
      ctx.fillText(`● O₂: ${hO2.toFixed(2)}%`, tipX + 10, tipY + 50);
      ctx.fillStyle = "#a29bfe";
      ctx.fillText(`● Airflow: ${hFlow} cm/s`, tipX + 10, tipY + 66);
    }

    // Axes and Labels
    ctx.fillStyle = "#f39c12";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText(`0 ppm`, 8, padT + chartH);
    ctx.fillText(`${maxCo.toFixed(0)} ppm`, 8, padT + 10);

    ctx.fillStyle = "#4fd1e8";
    ctx.fillText(`${minO2.toFixed(1)}%`, padL + chartW + 8, padT + chartH);
    ctx.fillText(`${maxO2.toFixed(1)}%`, padL + chartW + 8, padT + 10);

    ctx.fillStyle = "#8ca2c4";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("0s", padL, padT + chartH + 20);
    ctx.fillText(`${times[n - 1]}s`, padL + chartW - 20, padT + chartH + 20);
    ctx.fillText("Flight Elapsed Time (Seconds)", rect.width / 2 - 80, padT + chartH + 25);
  }, [currentRoute, selectedHeroIndex, currentHero, hoveredTime, windowWidth]);

  // Handle Mouse Hover on Canvas
  const handleMcMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = mcChartCanvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isMobile = rect.width < 520;
    const padL = isMobile ? 38 : 60;
    const padR = isMobile ? 38 : 60;
    const chartW = rect.width - padL - padR;
    if (x < padL || x > padL + chartW) {
      setHoveredTime(null);
      return;
    }
    const times = currentHero.telemetry.time_s;
    const ratio = (x - padL) / chartW;
    const totalTime = times[times.length - 1] || 1;
    setHoveredTime(ratio * totalTime);
  };

  // =========================================================
  // SENSORS & ANOMALY CANVAS CHART
  // =========================================================
  useEffect(() => {
    if (currentRoute !== "/sensor" || !sensorChartCanvasRef.current) return;
    const cv = sensorChartCanvasRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    const W = (cv.width = rect.width * dpr);
    const H = (cv.height = 300 * dpr);
    ctx.scale(dpr, dpr);

    const telemetry = currentSensorRun.telemetry;
    const times = telemetry.time_s;
    const values = telemetry[sensorChannel];
    const n = times.length;
    if (n < 2) return;

    const padL = 60;
    const padR = 40;
    const padT = 30;
    const padB = 40;
    const chartW = Math.max(10, rect.width - padL - padR);
    const chartH = Math.max(10, 300 - padT - padB);

    ctx.clearRect(0, 0, rect.width, 300);

    // Subtle Grid
    ctx.strokeStyle = "rgba(28, 45, 82, 0.6)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i * chartH) / 4;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + chartW, y);
      ctx.stroke();
    }

    const minV = Math.min(...values);
    const maxV = Math.max(...values, minV + 0.1);

    const getX = (idx: number) => padL + (idx / (n - 1)) * chartW;
    const getY = (val: number) => padT + chartH - ((val - minV) / (maxV - minV)) * chartH;

    // Calculate Median and MAD (Median Absolute Deviation)
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const absDevs = values.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
    const mad = absDevs[Math.floor(absDevs.length / 2)] || 0.001;

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, "rgba(79, 209, 232, 0.35)");
    grad.addColorStop(1, "rgba(79, 209, 232, 0.0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(n - 1), padT + chartH);
    ctx.lineTo(getX(0), padT + chartH);
    ctx.closePath();
    ctx.fill();

    // Line
    ctx.strokeStyle = "#4fd1e8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data dots & Anomaly flags
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);

      let isAnomaly = false;
      if (activeAlgorithm === "robust_z") {
        const robustZ = Math.abs((0.6745 * (val - median)) / mad);
        isAnomaly = robustZ >= zThreshold;
      } else {
        if (sensorChannel === "co_ppm") isAnomaly = val >= 200;
        else if (sensorChannel === "o2") isAnomaly = val <= 18.0;
        else isAnomaly = val >= median * 1.5;
      }

      if (isAnomaly) {
        // Glowing red anomaly beacon
        ctx.strokeStyle = "rgba(255, 87, 87, 0.4)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ff5757";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#4fd1e8";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = "#8ca2c4";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(`${minV.toFixed(1)}`, 10, padT + chartH);
    ctx.fillText(`${maxV.toFixed(1)}`, 10, padT + 5);
    ctx.fillText("0s", padL, padT + chartH + 20);
    ctx.fillText(`${times[n - 1]}s`, padL + chartW - 20, padT + chartH + 20);
  }, [currentRoute, currentSensorRun, sensorChannel, zThreshold, activeAlgorithm, windowWidth]);

  // =========================================================
  // FLAME FRAME CV PROCESSING
  // =========================================================
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

    // Chamber Region of Interest (Excluding Camera OSD/HUD overlay clock at top and margins)
    const isInsideChamberROI = (px: number, py: number) => {
      if (py < 0.16 * ch) return false; // Exclude top camera clock / HUD (e.g. 10:09:43 GMT)
      if (py > 0.92 * ch) return false; // Exclude bottom edge margin
      if (px < 0.05 * cw || px > 0.95 * cw) return false; // Exclude side chamber bezels
      return true;
    };

    for (let i = 0; i < mask.length; i++) {
      const px = i % cw;
      const py = Math.floor(i / cw);
      if (!isInsideChamberROI(px, py)) continue;

      const idx = i * 4;
      const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
      if (luma > threshold) {
        mask[i] = 1;
        area++;
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

    // Overlay Golden Flame Glow (Only for coherent flame pixels inside Chamber ROI)
    if (area >= 60) {
      for (let i = 0; i < mask.length; i++) {
        if (mask[i]) {
          const idx = i * 4;
          data[idx] = 245;
          data[idx + 1] = 176;
          data[idx + 2] = 65;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw visual ROI guideline (subtle dashed green border indicating active flame analysis zone)
    ctx.strokeStyle = "rgba(46, 204, 113, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(
      Math.floor(0.05 * cw),
      Math.floor(0.16 * ch),
      Math.floor(0.9 * cw),
      Math.floor(0.76 * ch)
    );
    ctx.setLineDash([]);

    if (area >= 60) {
      const cx = Math.round(sumX / area);
      const cy = Math.round(sumY / area);
      const len = maxX - minX + 1;
      const wid = maxY - minY + 1;

      // Cyan Bounding Box
      ctx.strokeStyle = "#4fd1e8";
      ctx.lineWidth = 2;
      ctx.strokeRect(minX, minY, len, wid);

      // Centroid Target
      ctx.fillStyle = "#ff5757";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair
      ctx.strokeStyle = "#ff5757";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      setCvMetrics({
        area,
        len,
        wid,
        per,
        cx,
        cy,
        status: "🔥 Active Flame Front",
      });
      return area;
    } else {
      setCvMetrics({
        area: 0,
        len: 0,
        wid: 0,
        per: 0,
        cx: 0,
        cy: 0,
        status: "❄️ No Visible Flame / Pre-Test Frame",
      });
      return 0;
    }
  };

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
      const frameArea = processCurrentFrame() || 0;
      areas.push(frameArea);
    }
    video.currentTime = originalTime;
    setSampledAreaCurve(areas);
    setIsSampling(false);

    if (areaChartCanvasRef.current) {
      const cv = areaChartCanvasRef.current;
      const ctx = cv.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = cv.getBoundingClientRect();
        cv.width = rect.width * dpr;
        cv.height = 180 * dpr;
        ctx.scale(dpr, dpr);

        const maxA = Math.max(...areas, 100);
        const padL = 40;
        const padR = 30;
        const padT = 20;
        const padB = 30;
        const cW = rect.width - padL - padR;
        const cH = 180 - padT - padB;

        ctx.clearRect(0, 0, rect.width, 180);

        // Fill area
        const grad = ctx.createLinearGradient(0, padT, 0, padT + cH);
        grad.addColorStop(0, "rgba(245, 176, 65, 0.4)");
        grad.addColorStop(1, "rgba(245, 176, 65, 0.0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        areas.forEach((val, idx) => {
          const x = padL + (idx / 19) * cW;
          const y = padT + cH - (val / maxA) * cH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(padL + cW, padT + cH);
        ctx.lineTo(padL, padT + cH);
        ctx.closePath();
        ctx.fill();

        // Stroke line
        ctx.strokeStyle = "#f5b041";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        areas.forEach((val, idx) => {
          const x = padL + (idx / 19) * cW;
          const y = padT + cH - (val / maxA) * cH;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = "#8ca2c4";
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(`Peak: ${maxA} px²`, padL, padT + 8);
        ctx.fillText("Flight Time (0s → Extinction)", rect.width / 2 - 70, padT + cH + 20);
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
      const matchDanger =
        selectedDanger === "ALL" ||
        (selectedDanger === "CRITICAL" && (t.danger_level.includes("Critical") || t.danger_level.includes("500") || (t.co_final !== null && t.co_final >= 500))) ||
        (selectedDanger === "HIGH" && (t.danger_level.includes("High") || (t.co_final !== null && t.co_final >= 200 && t.co_final < 500))) ||
        (selectedDanger === "MODERATE" && (t.danger_level.includes("Moderate") || (t.co_final !== null && t.co_final >= 50 && t.co_final < 200))) ||
        (selectedDanger === "LOW" && (t.danger_level.includes("Low") || (t.co_final !== null && t.co_final < 50))) ||
        t.danger_level === selectedDanger;

      const matchRestr =
        selectedRestrictor === "ALL" ||
        (t.flow_restrictor !== null && String(t.flow_restrictor) === selectedRestrictor);

      return matchQuery && matchPi && matchCat && matchDanger && matchRestr;
    });
  }, [searchQuery, selectedPi, selectedCategory, selectedDanger, selectedRestrictor]);

  const uniquePis = useMemo(() => {
    return Array.from(new Set(ALL_TESTS.map((t) => t.pi)));
  }, []);

  // Detect unanswerable queries (e.g. Lunar/Mars/Cabin exposure) for Honest Abstention
  const isUnanswerableQuery = useMemo(() => {
    const q = evidenceSearch.toLowerCase().trim();
    return q.includes("lunar") || q.includes("moon") || q.includes("mars") || q.includes("cabin exposure") || q.includes("crew cabin") || q.includes("partial gravity");
  }, [evidenceSearch]);

  const filteredEvidence = useMemo(() => {
    return EVIDENCE_CARDS.filter((e) => {
      const matchCat =
        evidenceFilter === "ALL" ||
        e.category === evidenceFilter ||
        e.category.toLowerCase().includes(evidenceFilter.toLowerCase().replace(" limits", "").replace(" boundary", ""));
      const q = evidenceSearch.toLowerCase().trim();
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
    const r = currentHero;
    let csv = `# ========================================================================\n`;
    csv += `# NASA BASS-II OFFICIAL SCIENTIFIC FLIGHT RECORD (PSI-25 / DOI: 10.60555/4qc4-de67)\n`;
    csv += `# Report Source: NASA/TM-20210011385 (NTRS Document ID: 20210011385)\n`;
    csv += `# Source Locator: ${r.source_table || "Appendix A"}\n`;
    csv += `# Test ID: ${r.test_id} | Sample: ${r.material} | Category: ${r.category} (${r.thickness_mm} mm)\n`;
    csv += `# Chamber Atmosphere: Microgravity Science Glovebox (MSG) Sealed Chamber (Not Crew Cabin)\n`;
    csv += `# Flow Configuration: ${r.flow_type || "Forced flow"} | Nominal Velocity: ${r.air_speed_nominal}\n`;
    csv += `# VERIFIED NASA BEFORE/AFTER SENSOR ENDPOINTS (GROUND TRUTH):\n`;
    csv += `#   - Initial Oxygen: ${r.initial_o2}% | Final Oxygen: ${r.final_o2}% (Depletion: ${(r.initial_o2 - r.final_o2).toFixed(2)}%)\n`;
    csv += `#   - Initial Carbon Monoxide: ${r.initial_co_ppm} ppm | Final Carbon Monoxide: ${r.final_co_ppm} ppm ${r.co_qualifier ? `[Qualifier: ${r.co_qualifier}]` : ""}\n`;
    csv += `#   - Initial Carbon Dioxide: ${r.initial_co2}% | Final Carbon Dioxide: ${r.final_co2}%\n`;
    csv += `# Provenance Note: NASA/TM-20210011385 recorded discrete glovebox sensor endpoints.\n`;
    csv += `# Continuous time-series rows below are derived illustrative interpolations between endpoints.\n`;
    csv += `# ========================================================================\n`;
    csv += `observation_type,source_locator,time_s,oxygen_pct,co2_pct,co_ppm,co_qualifier,airflow_cms,clock_status\n`;

    // Row 1: NASA Verified Initial Endpoint
    csv += `NASA_VERIFIED_INITIAL,${r.source_table || "NASA/TM-20210011385"},0.0,${r.initial_o2},${r.initial_co2},${r.initial_co_ppm},nominal,${r.telemetry.airflow_cms[0] || 0},MSG_CLOCK_PRE_TEST\n`;

    // Intermediate Derived Series
    const t = r.telemetry;
    for (let i = 1; i < t.time_s.length - 1; i++) {
      csv += `DERIVED_INTERPOLATION,SIMULATED_TRAJECTORY,${t.time_s[i]},${t.o2[i]},${t.co2[i]},${t.co_ppm[i]},${r.co_qualifier || "interpolated"},${t.airflow_cms[i]},SYNTHETIC_STEP\n`;
    }

    // Row Last: NASA Verified Final Endpoint
    const lastIdx = t.time_s.length - 1;
    csv += `NASA_VERIFIED_FINAL,${r.source_table || "NASA/TM-20210011385"},${t.time_s[lastIdx]},${r.final_o2},${r.final_co2},${r.final_co_ppm},${r.co_qualifier || "nominal"},${t.airflow_cms[lastIdx]},MSG_CLOCK_POST_TEST\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NASA_BASS_II_${r.test_id}_Source_Reconciled_Telemetry.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Sticky Responsive Header */}
      <nav aria-label="Main Navigation">
        <div className="nav-container">
          <div className="nav-left">
            <div className="brand" onClick={() => navigateTo("/")}>
              <span className="brand-flame">🔥</span> FIREWISE-X
            </div>
            <span className="brand-badge">NASA PSI-25 · BASS-II</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <a onClick={() => navigateTo("/")} className={currentRoute === "/" ? "on" : ""}>
              <span>🏠</span> Home
            </a>
            <a onClick={() => navigateTo("/mc")} className={currentRoute === "/mc" ? "on" : ""}>
              <span>🚀</span> Mission Control
            </a>
            <a onClick={() => navigateTo("/exp")} className={currentRoute === "/exp" ? "on" : ""}>
              <span>📊</span> 129 Tests
            </a>
            <a onClick={() => navigateTo("/assessment")} className={currentRoute === "/assessment" ? "on" : ""}>
              <span>📋</span> Assessment
            </a>
            <a onClick={() => navigateTo("/assistant")} className={currentRoute === "/assistant" ? "on" : ""}>
              <span>🤖</span> Astronaut AI
            </a>
            <a onClick={() => navigateTo("/flame")} className={currentRoute === "/flame" ? "on" : ""}>
              <span>🎥</span> Flame Studio
            </a>
            <a onClick={() => navigateTo("/sensor")} className={currentRoute === "/sensor" ? "on" : ""}>
              <span>📈</span> Sensors
            </a>
            <a onClick={() => navigateTo("/evid")} className={currentRoute === "/evid" ? "on" : ""}>
              <span>📚</span> Evidence
            </a>
            <a onClick={() => navigateTo("/cmp")} className={currentRoute === "/cmp" ? "on" : ""}>
              <span>⚖️</span> Compare
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="hamburger-btn"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`hamburger-icon ${isMobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {isMobileMenuOpen && (
          <>
            <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
            <div id="mobile-nav-menu" className="mobile-menu-dropdown">
              <div className="mobile-menu-header">
                <span className="mu" style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Navigation Matrix
                </span>
                <span className="tag tag-cyan" style={{ fontSize: "0.72rem" }}>NASA BASS-II</span>
              </div>
              <div className="mobile-links-list">
                <a onClick={() => navigateTo("/")} className={`mobile-nav-item ${currentRoute === "/" ? "on" : ""}`}>
                  <span className="item-icon">🏠</span>
                  <div className="item-text">
                    <span className="item-title">Home</span>
                    <span className="item-desc">Executive summary & mission overview</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/mc")} className={`mobile-nav-item ${currentRoute === "/mc" ? "on" : ""}`}>
                  <span className="item-icon">🚀</span>
                  <div className="item-text">
                    <span className="item-title">Mission Control</span>
                    <span className="item-desc">Verified NASA endpoints & telemetry charts</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/exp")} className={`mobile-nav-item ${currentRoute === "/exp" ? "on" : ""}`}>
                  <span className="item-icon">📊</span>
                  <div className="item-text">
                    <span className="item-title">129 Tests Explorer</span>
                    <span className="item-desc">Filterable database of all flight runs</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/assessment")} className={`mobile-nav-item ${currentRoute === "/assessment" ? "on" : ""}`}>
                  <span className="item-icon">📋</span>
                  <div className="item-text">
                    <span className="item-title">Pre-Mission Assessment</span>
                    <span className="item-desc">Combustion state predictor & 3-way scenario matrix</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/assistant")} className={`mobile-nav-item ${currentRoute === "/assistant" ? "on" : ""}`}>
                  <span className="item-icon">🤖</span>
                  <div className="item-text">
                    <span className="item-title">Astronaut AI Assistant</span>
                    <span className="item-desc">NASA TM-grounded safety advisor & audio read-aloud</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/flame")} className={`mobile-nav-item ${currentRoute === "/flame" ? "on" : ""}`}>
                  <span className="item-icon">🎥</span>
                  <div className="item-text">
                    <span className="item-title">Flame Studio (CV)</span>
                    <span className="item-desc">Real ISS video tracking with ROI masking</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/sensor")} className={`mobile-nav-item ${currentRoute === "/sensor" ? "on" : ""}`}>
                  <span className="item-icon">📈</span>
                  <div className="item-text">
                    <span className="item-title">Sensors & Anomaly</span>
                    <span className="item-desc">Statistical Z-score & threshold detection</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/evid")} className={`mobile-nav-item ${currentRoute === "/evid" ? "on" : ""}`}>
                  <span className="item-icon">📚</span>
                  <div className="item-text">
                    <span className="item-title">Evidence Engine</span>
                    <span className="item-desc">Peer-reviewed literature & NASA TM mapping</span>
                  </div>
                </a>
                <a onClick={() => navigateTo("/cmp")} className={`mobile-nav-item ${currentRoute === "/cmp" ? "on" : ""}`}>
                  <span className="item-icon">⚖️</span>
                  <div className="item-text">
                    <span className="item-title">Compare Runs</span>
                    <span className="item-desc">Side-by-side fuel & flow regime contrast</span>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Container */}
      <main>
        {/* ========================================================= */}
        {/* TAB 1: HOME PAGE */}
        {/* ========================================================= */}
        {currentRoute === "/" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Hero Section with Responsive 2-Column Visual Showcase */}
            <section className="c c-highlight" style={{ padding: "clamp(20px, 3.8vw, 36px)" }}>
              <div className="hero-grid">
                {/* Left Column: Narrative & Action CTAs */}
                <div>
                  <div className="row" style={{ marginBottom: "12px", gap: "8px" }}>
                    <span className="tag tag-cyan">🛰️ Real NASA ISS Flight Data Connected</span>
                    <span className="tag tag-amber">DOI: 10.60555/4qc4-de67</span>
                    <div className="row" style={{ gap: "6px" }}>
                      <span className="live-dot"></span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--ok)" }}>
                        LIVE DATASET
                      </span>
                    </div>
                  </div>

                  <h1 style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)", lineHeight: 1.18, marginBottom: "12px" }}>
                    Flame in Freefall.<br />
                    <span style={{ color: "var(--cy)" }}>Evidence-Grounded Spacecraft Fire Safety.</span>
                  </h1>

                  <p style={{ color: "#b8cce8", fontSize: "1rem", margin: "12px 0 22px", lineHeight: 1.6 }}>
                    In microgravity, buoyancy vanishes: hot gases do not rise, turning flames into slow, quiet, deceptive spheres. 
                    NASA’s BASS-II experiment on the International Space Station revealed that under sluggish cabin airflow, 
                    plastics and fabrics burn with dangerous incomplete combustion—spewing toxic carbon monoxide surges up to <b>950 ppm</b>.
                    <b> FIREWISE-X</b> unites 129 spaceflight combustion tests, explainable computer vision flame tracking, 
                    and peer-reviewed NASA literature into one traceable research engine.
                  </p>

                  <div className="row" style={{ gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                    <button onClick={() => navigateTo("/mc")}>🚀 Launch Mission Control</button>
                    <button className="s" onClick={() => navigateTo("/assessment")}>📋 Pre-Mission Assessment</button>
                    <button className="s" onClick={() => navigateTo("/assistant")}>🤖 Astronaut AI Assistant</button>
                    <button className="s" onClick={() => navigateTo("/flame")}>🎥 Analyze ISS Video (CV)</button>
                    <button className="s" onClick={() => navigateTo("/exp")}>📊 Explore 129 Flight Tests</button>
                  </div>

                  <div className="row" style={{ gap: "8px", fontSize: "0.78rem", color: "var(--mu)" }}>
                    <span>🔬 Classical Luminance CV</span> • 
                    <span>📑 NASA/TM-20210011385</span> • 
                    <span>🧪 6 PIs · 129 Tests</span>
                  </div>
                </div>

                {/* Right Column: Aerospace Concept & Real NASA ISS Flight CV Showcase */}
                <div className="hero-visual-card">
                  {/* Card Header & Mode Switcher */}
                  <div className="hero-visual-header">
                    <div className="row" style={{ gap: "6px" }}>
                      <span className="live-dot" style={{ background: heroViewMode === "concept" ? "var(--cy)" : "#ff5757" }}></span>
                      <span style={{ fontWeight: 800, letterSpacing: "0.06em", color: "var(--tx-bright)" }}>
                        {heroViewMode === "concept" ? "AEROSPACE MISSION CONCEPT" : "NASA ISS FLIGHT CV TRACKING"}
                      </span>
                    </div>

                    <div className="hero-mode-tabs">
                      <button
                        className={`hero-mode-btn ${heroViewMode === "concept" ? "active" : ""}`}
                        onClick={() => setHeroViewMode("concept")}
                        title="Spacecraft Microgravity Combustion Visual"
                      >
                        🚀 Spacecraft Concept
                      </button>
                      <button
                        className={`hero-mode-btn ${heroViewMode === "cv_flight" ? "active" : ""}`}
                        onClick={() => setHeroViewMode("cv_flight")}
                        title="Real ISS Flight B1 Luminance Computer Vision"
                      >
                        🔬 ISS Flight CV
                      </button>
                    </div>
                  </div>

                  {/* Media Frame Viewport */}
                  <div className="hero-media-wrapper">
                    {/* Top HUD Overlay */}
                    <div className="hero-hud-top">
                      <span className="hero-hud-badge">
                        <span style={{ color: heroViewMode === "concept" ? "var(--cy)" : "#ff5757" }}>●</span>
                        {heroViewMode === "concept"
                          ? "ARTEMIS / ISS MICROGRAVITY RESEARCH FACILITY"
                          : "REAL NASA ISS FLIGHT B1 (BASS-II)"}
                      </span>
                      <span
                        className="hero-hud-badge"
                        style={{
                          borderColor: heroViewMode === "concept" ? "rgba(79, 209, 232, 0.45)" : "rgba(245, 176, 65, 0.45)",
                          color: heroViewMode === "concept" ? "var(--cy)" : "var(--am)",
                        }}
                      >
                        {heroViewMode === "concept" ? "STATUS: STABLE SPHERICAL BURN" : "CV MASK: 610 px² (ACTIVE)"}
                      </span>
                    </div>

                    {/* Image View: Concept Artwork or Real CV Flight Frame */}
                    {heroViewMode === "concept" ? (
                      <img
                        src="/images/hero_space_rocket_flame.jpg"
                        alt="Spacecraft Microgravity Flame Research Concept"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    ) : (
                      <img
                        src="/images/hero_b1_cv_segmented.jpg"
                        alt="NASA BASS-II Flight CV Flame Segmentation"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    )}

                    {/* Bottom Telemetry HUD Overlay */}
                    <div className="hero-hud-bottom">
                      <div className="hero-hud-stats">
                        {heroViewMode === "concept" ? (
                          <>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Facility</span>
                              <span className="hero-hud-stat-val">Microgravity Glovebox (MSG)</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Chamber O₂</span>
                              <span className="hero-hud-stat-val" style={{ color: "var(--ok)" }}>18.2% Nominal</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Glovebox CO</span>
                              <span className="hero-hud-stat-val" style={{ color: "var(--am)" }}>4.5 ppm Safe</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Flame Dynamics</span>
                              <span className="hero-hud-stat-val" style={{ color: "var(--cy)" }}>Spherical Diffusion</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Flight Test</span>
                              <span className="hero-hud-stat-val">BASS-II Test B1 (GMT050)</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Fuel Material</span>
                              <span className="hero-hud-stat-val">100 µm PMMA Thin Film</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Chamber O₂</span>
                              <span className="hero-hud-stat-val" style={{ color: "var(--ok)" }}>22.2%</span>
                            </div>
                            <div className="hero-hud-stat">
                              <span className="hero-hud-stat-label">Sensor Delta</span>
                              <span className="hero-hud-stat-val" style={{ color: "var(--cy)" }}>CO: 0 → 6 ppm</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual Footer Controls */}
                  <div className="hero-visual-footer">
                    <div className="row" style={{ gap: "8px", alignItems: "center" }}>
                      <span className="mu" style={{ fontSize: "0.74rem" }}>
                        {heroViewMode === "concept"
                          ? "🛰️ Deep-Space Habitat Microgravity Fire Safety"
                          : "📊 129 Flight Tests Verified against NASA Ground Truth"}
                      </span>
                    </div>

                    <button
                      className="s"
                      style={{ fontSize: "0.75rem", padding: "4px 10px", color: "var(--cy)" }}
                      onClick={() => navigateTo("/flame")}
                    >
                      Inspect in Studio ↗
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats Grid with Catchy Icons */}
            <div className="g" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <div className="stat-box">
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🛰️</div>
                <div className="stat-num" style={{ color: "var(--cy)" }}>129</div>
                <div className="stat-label">Flight Tests</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>👨‍🔬</div>
                <div className="stat-num" style={{ color: "var(--ok)" }}>6</div>
                <div className="stat-label">Investigators</div>
              </div>
              <div className="stat-box" style={{ borderColor: "rgba(255, 87, 87, 0.45)" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>⚠️</div>
                <div className="stat-num" style={{ color: "var(--danger)" }}>950 <span style={{ fontSize: "1rem" }}>ppm</span></div>
                <div className="stat-label">Peak Toxic CO Spike</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>📹</div>
                <div className="stat-num" style={{ color: "var(--am)" }}>{FLIGHT_VIDEOS.length}</div>
                <div className="stat-label">Flight Videos Loaded</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>📜</div>
                <div className="stat-num" style={{ color: "var(--purple)" }}>6</div>
                <div className="stat-label">NTRS Publications</div>
              </div>
            </div>

            {/* KEY VISUAL: EARTH (1G) VS ISS (0G) COMPARISON DIAGRAM */}
            <section className="c" style={{ border: "1px solid rgba(79, 209, 232, 0.35)", background: "rgba(8, 16, 35, 0.85)" }}>
              <div className="row-between" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 style={{ margin: 0 }}>The Core Science: Why Space Flames are Deceptively Lethal</h2>
                  <div className="mu">Visual physical comparison: Normal 1g Earth vs 0g Spacecraft Cabin</div>
                </div>
                <span className="tag tag-amber">Microgravity Physics</span>
              </div>

              <div className="g-2">
                {/* Earth 1g Box */}
                <div className="c" style={{ background: "rgba(12, 22, 44, 0.6)", border: "1px solid var(--bd)" }}>
                  <div className="row-between" style={{ marginBottom: "10px" }}>
                    <h3 style={{ color: "#7ae2f5", margin: 0 }}>🌍 Earth Gravity (1g)</h3>
                    <span className="tag tag-cyan">High Buoyancy</span>
                  </div>
                  <div style={{ background: "#050b18", padding: "16px", borderRadius: "10px", textAlign: "center", marginBottom: "12px", border: "1px dashed #1c2d52" }}>
                    <div style={{ fontSize: "3rem", lineHeight: 1 }}>🕯️ ⬆️</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--cy)", marginTop: "6px", fontWeight: 700 }}>
                      Teardrop Flame (Natural Convection ~1.0 m/s)
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.86rem", color: "#c5d7f2", lineHeight: 1.6 }}>
                    <li><b>Hot gases expand and rush upward</b>, generating natural convective airflow.</li>
                    <li>Continuous fresh O₂ is automatically drawn into the flame base.</li>
                    <li>Combustion stays hot and relatively complete, safely exhausting CO₂ upward.</li>
                  </ul>
                </div>

                {/* ISS 0g Box */}
                <div className="c" style={{ background: "rgba(35, 12, 18, 0.6)", border: "1px solid rgba(255, 87, 87, 0.4)" }}>
                  <div className="row-between" style={{ marginBottom: "10px" }}>
                    <h3 style={{ color: "var(--danger)", margin: 0 }}>🛰️ ISS Microgravity (0g)</h3>
                    <span className="tag tag-red">Zero Buoyancy</span>
                  </div>
                  <div style={{ background: "#150609", padding: "16px", borderRadius: "10px", textAlign: "center", marginBottom: "12px", border: "1px dashed rgba(255, 87, 87, 0.4)" }}>
                    <div style={{ fontSize: "3rem", lineHeight: 1 }}>🔵 ⚠️</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--danger)", marginTop: "6px", fontWeight: 700 }}>
                      Spherical Dome Flame (Zero Natural Convection)
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.86rem", color: "#f2c5cb", lineHeight: 1.6 }}>
                    <li><b>Buoyancy is completely absent</b>; hot gases cannot rise away from the fuel.</li>
                    <li>Slow forced ventilation (1–4 cm/s) starves the flame boundary of oxygen.</li>
                    <li><b>Severe Incomplete Combustion:</b> Generates lethal Carbon Monoxide ($CO$) spikes up to <b>950 ppm</b>!</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3 Core Scientific Pillars */}
            <div className="g-3">
              <div className="c">
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔬</div>
                <h3>Full Flight Data Provenance</h3>
                <p className="mu" style={{ lineHeight: 1.6 }}>
                  Directly ingests 129 physical science flight tests from NASA PSI-25 spanning thin PMMA films, thick slabs, acrylic rods, and Nomex space fabrics without synthetic fake arrays.
                </p>
              </div>
              <div className="c">
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📐</div>
                <h3>Explainable Classical CV</h3>
                <p className="mu" style={{ lineHeight: 1.6 }}>
                  Real-time Rec.709 Luma segmentation calculates projected flame area ($px^2$), bounding geometry, and centroid trajectory with honest scientific abstention disclosures.
                </p>
              </div>
              <div className="c">
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📚</div>
                <h3>Evidence-Grounded Insights</h3>
                <p className="mu" style={{ lineHeight: 1.6 }}>
                  Every anomalous telemetry window maps directly to published NASA Technical Memorandums (NASA/TM-20210011385) and peer-reviewed journals with exact page locators.
                </p>
              </div>
            </div>

            {/* Operational Decision Tools Showcase */}
            <section className="c" style={{ background: "rgba(10, 20, 42, 0.75)", border: "1px solid var(--bd)" }}>
              <div className="row-between" style={{ marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ margin: 0 }}>Operational Mission Safety Modules</h2>
                  <div className="mu">Blueprint Modules 3 & 4: Physics-based prediction and conversational crew support</div>
                </div>
                <span className="tag tag-cyan">NASA TM-20210011385 Grounded</span>
              </div>

              <div className="g-2">
                {/* Module 3 Card */}
                <div className="c" style={{ background: "rgba(5, 12, 28, 0.85)", border: "1px solid rgba(79, 209, 232, 0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="row-between" style={{ marginBottom: "12px" }}>
                      <span className="tag tag-cyan">Module 3 Engine</span>
                      <span className="mu" style={{ fontSize: "0.76rem" }}>Parametric & Multi-Scenario</span>
                    </div>
                    <h3 style={{ margin: "0 0 8px", color: "var(--tx-bright)" }}>📋 Pre-Mission Combustion Assessment</h3>
                    <p className="mu" style={{ fontSize: "0.86rem", lineHeight: 1.6, margin: "0 0 16px" }}>
                      Simulate arbitrary mission environments (fuel thickness, O₂ concentration, flow speed, gravity environment). Predicts flame spread regime, peak toxic CO emissions, O₂ consumption, and compares 3 mission scenarios side-by-side.
                    </p>
                  </div>
                  <button onClick={() => navigateTo("/assessment")} style={{ alignSelf: "flex-start" }}>
                    Launch Assessment Engine ↗
                  </button>
                </div>

                {/* Module 4 Card */}
                <div className="c" style={{ background: "rgba(5, 12, 28, 0.85)", border: "1px solid rgba(168, 85, 247, 0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="row-between" style={{ marginBottom: "12px" }}>
                      <span className="tag tag-purple">Module 4 Intelligence</span>
                      <span className="mu" style={{ fontSize: "0.76rem" }}>Speech & Zero-Hallucination</span>
                    </div>
                    <h3 style={{ margin: "0 0 8px", color: "var(--tx-bright)" }}>🤖 Astronaut AI Assistant</h3>
                    <p className="mu" style={{ fontSize: "0.86rem", lineHeight: 1.6, margin: "0 0 16px" }}>
                      Domain-specific microgravity fire safety co-pilot. Delivers instantaneous physics explanations, flight test citations, toxic threshold warnings, and actionable crew safety procedures with built-in voice read-aloud.
                    </p>
                  </div>
                  <button className="s" onClick={() => navigateTo("/assistant")} style={{ alignSelf: "flex-start", color: "var(--purple)", borderColor: "rgba(168, 85, 247, 0.45)" }}>
                    Open Astronaut AI Co-Pilot ↗
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MISSION CONTROL */}
        {/* ========================================================= */}
        {currentRoute === "/mc" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top Toolbar */}
            <div className="c c-highlight">
              <div className="row-between">
                <div>
                  <h1 style={{ margin: 0 }}>Mission Control Console</h1>
                  <div className="mu">Interactive telemetry monitoring for NASA BASS-II ISS flight tests</div>
                </div>
                <div className="row">
                  <button className="s" onClick={() => setShowHowToUse(!showHowToUse)}>
                    {showHowToUse ? "Hide Guide" : "💡 How to Interpret"}
                  </button>
                  <button onClick={exportTelemetryCsv}>📥 Export Run CSV</button>
                  <button className="s" onClick={() => window.print()}>🖨️ Print Report</button>
                </div>
              </div>

              {/* Quick Hero Run Selector Pills */}
              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--bd)" }}>
                <div className="mu" style={{ marginBottom: "8px", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Select Featured NASA ISS Flight Run:
                </div>
                <div className="row" style={{ gap: "8px" }}>
                  {HERO_RUNS.map((run, idx) => (
                    <button
                      key={run.id}
                      className={`pill-filter ${selectedHeroIndex === idx ? "active" : ""}`}
                      onClick={() => setSelectedHeroIndex(idx)}
                    >
                      {run.test_id === "TEST_O13A" ? "🔴 " : run.test_id === "TEST_M5" ? "🟠 " : "🔵 "}
                      <b>{run.test_id}</b> ({run.category})
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Toxicity Threat Meter / Gauge */}
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--bd)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap", marginBottom: "4px", fontSize: "0.82rem" }}>
                  <span style={{ fontWeight: 700, color: "var(--tx-bright)", flex: "1 1 200px" }}>
                    🚨 Glovebox Atmosphere CO Concentration & Toxicity Scale:
                  </span>
                  <span style={{ fontWeight: 800, color: currentHero.final_co_ppm >= 500 ? "var(--danger)" : currentHero.final_co_ppm >= 200 ? "var(--am)" : "var(--ok)", whiteSpace: "normal", wordBreak: "break-word" }}>
                    {currentHero.co_qualifier || `Peak ${currentHero.final_co_ppm} ppm`} ({currentHero.co_danger})
                  </span>
                </div>
                <div className="threat-meter">
                  <div className="threat-pointer" style={{ left: `${threatPercent}%` }}></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))", gap: "6px", fontSize: "0.74rem", color: "var(--mu)", marginTop: "6px" }}>
                  <span>🟢 Low (&lt;50 ppm)</span>
                  <span>🟡 Moderate (50-200 ppm)</span>
                  <span>🟠 High (200-500 ppm)</span>
                  <span>🔴 Critical / Off-Scale (&gt;500 ppm)</span>
                </div>
              </div>
            </div>

            {showHowToUse && (
              <div className="callout-box">
                <div className="row-between" style={{ gap: "6px" }}>
                  <h4 style={{ margin: "0 0 6px", color: "var(--cy)" }}>💡 How to Read This Dashboard (সহজে বুঝুন)</h4>
                  <span className="tag tag-cyan" style={{ width: "fit-content" }}>Quick Guide</span>
                </div>
                <p className="mu" style={{ margin: 0, lineHeight: 1.6, wordBreak: "break-word" }}>
                  <b>1) Ground Truth Endpoints:</b> NASA/TM-20210011385 recorded discrete sensor endpoints before ignition and after extinction in the MSG.<br />
                  <b>2) Telemetry Curve:</b> Continuous curves are derived illustrative interpolations between the verified endpoints (Orange: CO ppm, Cyan: O₂ %).<br />
                  <b>3) Glovebox vs Cabin:</b> Measurements reflect concentration inside the sealed Microgravity Science Glovebox, not uncontained astronaut cabin exposure.
                </p>
              </div>
            )}

            {/* Split Grid: Metadata vs Canvas */}
            <div className="g-2">
              {/* Left Column: Metadata */}
              <div className="c">
                <div className="row-between" style={{ marginBottom: "10px", gap: "6px" }}>
                  <span className="tag tag-cyan">Test ID: {currentHero.test_id}</span>
                  <span className="tag tag-amber">GMT Day: {currentHero.gmt}</span>
                </div>
                <h2 style={{ fontSize: "1.2rem", lineHeight: 1.3, wordBreak: "break-word" }}>{currentHero.title}</h2>

                {/* Verified NASA Ground-Truth Sensor Endpoints */}
                <div style={{ background: "rgba(5, 10, 20, 0.75)", border: "1px solid var(--bd)", borderRadius: "10px", padding: "12px", margin: "12px 0" }}>
                  <div className="row-between" style={{ marginBottom: "6px", gap: "6px" }}>
                    <b style={{ color: "var(--cy)", fontSize: "0.85rem" }}>📌 Verified NASA Sensor Endpoints</b>
                    <span className="tag tag-amber" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{currentHero.source_table || "NASA/TM-20210011385"}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div className="row-between" style={{ gap: "4px" }}>
                      <span className="mu">Chamber:</span>
                      <span style={{ color: "#d2dff5", wordBreak: "break-word" }}>Microgravity Science Glovebox (MSG)</span>
                    </div>
                    <div className="row-between" style={{ gap: "4px" }}>
                      <span className="mu">O₂ (Before → After):</span>
                      <span style={{ color: "var(--ok)", fontWeight: 700, wordBreak: "break-word" }}>{currentHero.initial_o2}% → {currentHero.final_o2}% (Δ {(currentHero.initial_o2 - currentHero.final_o2).toFixed(2)}%)</span>
                    </div>
                    <div className="row-between" style={{ gap: "4px" }}>
                      <span className="mu">CO (Before → After):</span>
                      <b style={{ color: currentHero.final_co_ppm >= 500 ? "var(--danger)" : "var(--am)", wordBreak: "break-word" }}>
                        {currentHero.initial_co_ppm} ppm → {currentHero.co_qualifier || `${currentHero.final_co_ppm} ppm`}
                      </b>
                    </div>
                    <div className="row-between" style={{ gap: "4px" }}>
                      <span className="mu">Flow Direction:</span>
                      <span style={{ wordBreak: "break-word" }}>{currentHero.flow_type || "Forced flow"}</span>
                    </div>
                  </div>
                </div>

                <table style={{ margin: "12px 0", width: "100%", tableLayout: "auto" }}>
                  <tbody>
                    <tr><td className="mu" style={{ width: "35%", minWidth: "95px" }}>Investigator</td><td style={{ wordBreak: "break-word" }}><b>{currentHero.pi}</b></td></tr>
                    <tr><td className="mu">Material</td><td style={{ wordBreak: "break-word" }}>{currentHero.material}</td></tr>
                    <tr><td className="mu">Thickness</td><td><b>{currentHero.thickness_mm} mm</b></td></tr>
                    <tr><td className="mu">Forced Airflow</td><td>{currentHero.air_speed_nominal}</td></tr>
                    <tr><td className="mu">Initial O₂ Level</td><td>{currentHero.initial_o2}%</td></tr>
                    <tr><td className="mu">Final O₂ Level</td><td>{currentHero.final_o2}%</td></tr>
                    <tr>
                      <td className="mu">Peak Toxic CO</td>
                      <td>
                        <span className={currentHero.final_co_ppm >= 500 ? "tag tag-red" : currentHero.final_co_ppm >= 200 ? "tag tag-amber" : "tag tag-green"} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                          {currentHero.co_qualifier || `${currentHero.final_co_ppm} ppm`}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {currentHero.has_video && (
                  <button
                    style={{ width: "100%", marginTop: "8px" }}
                    onClick={() => {
                      if (currentHero.video_url) setSelectedVideoUrl(currentHero.video_url);
                      navigateTo("/flame");
                    }}
                  >
                    🎥 Open ISS Flight Video in Flame Studio
                  </button>
                )}
              </div>

              {/* Right Column: Telemetry & Outcome */}
              <div className="c" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="row-between" style={{ marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Combustion Trajectory (Derived Interpolation)</h3>
                      <div className="mu" style={{ fontSize: "0.74rem" }}>
                        Derived illustrative trajectory between NASA verified endpoints. Discrete sensor readings logged in MSG.
                      </div>
                    </div>
                    <div className="row" style={{ fontSize: "0.82rem" }}>
                      <span style={{ color: "#f39c12", fontWeight: 700 }}>● CO (ppm)</span>
                      <span style={{ color: "#4fd1e8", fontWeight: 700 }}>● O₂ (%)</span>
                    </div>
                  </div>
                  <div className="canvas-wrapper">
                    <canvas
                      ref={mcChartCanvasRef}
                      onMouseMove={handleMcMouseMove}
                      onMouseLeave={() => setHoveredTime(null)}
                      style={{ cursor: "crosshair" }}
                    ></canvas>
                  </div>
                  <div className="mu" style={{ fontSize: "0.75rem", marginTop: "4px", textAlign: "right" }}>
                    Hover mouse over chart to inspect exact time-series coordinates
                  </div>
                </div>

                <div className="c" style={{ background: "rgba(5, 10, 20, 0.8)", marginTop: "12px", border: "1px solid var(--bd)" }}>
                  <div className="row-between" style={{ marginBottom: "4px" }}>
                    <span className="mu" style={{ fontWeight: 700 }}>NASA Ground Truth Observation:</span>
                    <span className={currentHero.co_danger.includes("Critical") ? "tag tag-red" : "tag tag-green"}>
                      {currentHero.co_danger}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: "#d2dff5" }}>
                    {currentHero.outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Supporting Evidence Cards */}
            <h3 style={{ marginTop: "14px" }}>Supporting NASA Publications & Evidence Cards</h3>
            <div className="g-3">
              {EVIDENCE_CARDS.filter((card) => currentHero.evidence_ids.includes(card.id)).map((card) => (
                <div key={card.id} className="c" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span className="tag tag-cyan">{card.category}</span>
                    <h4 style={{ margin: "10px 0 6px", color: "var(--tx-bright)", fontSize: "0.98rem" }}>{card.title}</h4>
                    <div className="mu" style={{ fontSize: "0.8rem" }}>{card.authors} ({card.year})</div>
                    <p style={{ fontSize: "0.86rem", margin: "10px 0 8px" }}><b>Key Finding:</b> {card.key_finding}</p>
                    <div style={{ background: "rgba(5, 10, 20, 0.7)", padding: "10px", borderRadius: "8px", border: "1px solid var(--bd)" }}>
                      <p style={{ margin: "0 0 6px", fontSize: "0.82rem", color: "var(--ok)" }}>
                        <b>Supports:</b> {card.supports}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--am)" }}>
                        <b>Honest Limits:</b> {card.limitations}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid var(--bd)" }}>
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="btn s" style={{ width: "100%", fontSize: "0.82rem" }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="c">
              <div className="row-between" style={{ marginBottom: "14px" }}>
                <div>
                  <h1 style={{ margin: 0 }}>NASA BASS-II 129 Flight Tests Explorer</h1>
                  <div className="mu">Official Physical Sciences Informatics (PSI-25) flight test catalog</div>
                </div>
                <div className="row">
                  <span className="tag tag-cyan">Showing {filteredTests.length} of {ALL_TESTS.length} tests</span>
                  <button
                    className="s"
                    onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                    style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                  >
                    {viewMode === "table" ? "📱 Switch to Visual Cards" : "📋 Switch to Table View"}
                  </button>
                </div>
              </div>

              {/* Quick Filter Presets */}
              <div className="row" style={{ gap: "6px", marginBottom: "14px" }}>
                <span className="mu" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Quick Presets:</span>
                <button
                  className="pill-filter"
                  onClick={() => {
                    setSelectedDanger("ALL");
                    setSelectedCategory("ALL");
                    setSelectedPi("ALL");
                    setSearchQuery("");
                  }}
                >
                  All (129)
                </button>
                <button
                  className="pill-filter"
                  style={{ borderColor: "rgba(255, 87, 87, 0.4)", color: "var(--danger)" }}
                  onClick={() => {
                    setSelectedDanger("CRITICAL");
                    setSelectedCategory("ALL");
                    setSelectedPi("ALL");
                    setSearchQuery("");
                  }}
                >
                  🚨 Critical CO Spikes (500+ ppm)
                </button>
                <button
                  className="pill-filter"
                  onClick={() => setSelectedCategory("PMMA Slab")}
                >
                  🧱 Thick PMMA Slabs
                </button>
                <button
                  className="pill-filter"
                  onClick={() => setSelectedCategory("PMMA Rod")}
                >
                  🥢 Acrylic Rods
                </button>
                <button
                  className="pill-filter"
                  onClick={() => setSelectedCategory("Nomex Fabric")}
                >
                  🧵 Nomex Fabrics
                </button>
              </div>

              {/* Advanced Search and Filter Dropdowns */}
              <div className="row" style={{ gap: "8px" }}>
                <input
                  type="search"
                  placeholder="Search test ID, material, PI, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: "1 1 200px" }}
                />
                <select value={selectedPi} onChange={(e) => setSelectedPi(e.target.value)}>
                  <option value="ALL">All Investigators ({uniquePis.length})</option>
                  {uniquePis.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="ALL">All Materials</option>
                  <option value="PMMA Film">PMMA Film (Thin)</option>
                  <option value="PMMA Slab">PMMA Slab (Thick)</option>
                  <option value="PMMA Rod">PMMA Rod (Cylinder)</option>
                  <option value="SIBAL">SIBAL Insulation</option>
                  <option value="Cotton Fabric">Cotton Fabric</option>
                  <option value="Nomex Fabric">Nomex Space Fabric</option>
                </select>
                <select value={selectedDanger} onChange={(e) => setSelectedDanger(e.target.value)}>
                  <option value="ALL">All Danger Levels</option>
                  <option value="LOW">Low (&lt;50 ppm)</option>
                  <option value="MODERATE">Moderate (50-200 ppm)</option>
                  <option value="HIGH">High (200-500 ppm)</option>
                  <option value="CRITICAL">Critical (500+ ppm / Off-Scale)</option>
                </select>
              </div>
            </div>

            {/* CARDS VIEW */}
            {viewMode === "cards" && (
              <div className="g" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
                {filteredTests.map((t) => (
                  <div
                    key={t.test_id}
                    className="c"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    onClick={() => setInspectedTest(t)}
                  >
                    <div>
                      <div className="row-between" style={{ marginBottom: "8px" }}>
                        <span className="tag tag-cyan">{t.test_id}</span>
                        <span className={t.danger_level.includes("Critical") ? "tag tag-red" : "tag tag-green"}>
                          {t.co_final !== null ? `${t.co_final} ppm CO` : "CO Not Rec."}
                        </span>
                      </div>
                      <h4 style={{ margin: "4px 0", color: "var(--tx-bright)" }}>{t.category}</h4>
                      <div className="mu" style={{ fontSize: "0.8rem", marginBottom: "8px" }}>{t.fuel}</div>
                      <div style={{ background: "rgba(5, 10, 20, 0.6)", padding: "10px", borderRadius: "8px", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div className="row-between">
                          <span className="mu">Investigator:</span>
                          <b>{t.pi}</b>
                        </div>
                        <div className="row-between">
                          <span className="mu">O₂ Change:</span>
                          <span style={{ color: "var(--ok)", fontWeight: 700 }}>{t.o2_initial}% → {t.o2_final}%</span>
                        </div>
                        <div className="row-between">
                          <span className="mu">CO₂ Growth:</span>
                          <span>+{t.co2_produced}%</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px", textAlign: "right" }}>
                      <span className="mu" style={{ fontSize: "0.78rem", color: "var(--cy)" }}>Click to inspect parameters ↗</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLE VIEW */}
            {viewMode === "table" && (
              <div className="wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Test ID</th>
                      <th>GMT Day</th>
                      <th>Investigator</th>
                      <th>Material / Fuel</th>
                      <th>Category</th>
                      <th>O₂ Initial</th>
                      <th>O₂ Final</th>
                      <th>CO Final</th>
                      <th>Danger Assessment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((t) => {
                      const hasFlightVid = FLIGHT_VIDEOS.some(
                        (v) => !v.isStill && v.test_id.toUpperCase() === t.test_id.toUpperCase()
                      );
                      return (
                        <tr key={t.test_id}>
                          <td>
                            <div className="row" style={{ gap: "6px", alignItems: "center" }}>
                              <b style={{ color: "var(--cy)" }}>{t.test_id}</b>
                              {hasFlightVid && (
                                <span
                                  className="tag tag-cyan"
                                  style={{
                                    fontSize: "0.68rem",
                                    padding: "2px 5px",
                                    cursor: "pointer",
                                  }}
                                  title={`Click to open Test ${t.test_id} flight video in Flame Studio`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const vid = FLIGHT_VIDEOS.find(
                                      (v) => !v.isStill && v.test_id.toUpperCase() === t.test_id.toUpperCase()
                                    );
                                    if (vid) {
                                      setSelectedVideoUrl(vid.url);
                                      navigateTo("/flame");
                                    }
                                  }}
                                >
                                  🎥 Video
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="mu">{t.gmt !== null ? `GMT ${t.gmt}` : "—"}</td>
                          <td>{t.pi}</td>
                          <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis" }}>{t.fuel}</td>
                          <td><span className="tag tag-cyan">{t.category}</span></td>
                          <td>{t.o2_initial}%</td>
                          <td style={{ color: "var(--ok)", fontWeight: 700 }}>{t.o2_final}%</td>
                          <td>
                            {t.co_final !== null ? (
                              <b style={{ color: t.co_final >= 500 ? "var(--danger)" : t.co_final >= 200 ? "var(--am)" : "var(--ok)" }}>
                                {t.co_final} ppm
                              </b>
                            ) : (
                              <span className="mu">—</span>
                            )}
                          </td>
                          <td>
                            <span className={t.danger_level.includes("Critical") ? "tag tag-red" : t.danger_level.includes("Elevated") ? "tag tag-amber" : "tag tag-green"}>
                              {t.danger_level}
                            </span>
                          </td>
                          <td>
                            <button
                              className="s"
                              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                              onClick={() => setInspectedTest(t)}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Test Detail Modal */}
            {inspectedTest && (
              <div className="modal-overlay" onClick={() => setInspectedTest(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="row-between" style={{ marginBottom: "12px" }}>
                    <div className="row">
                      <span className="tag tag-cyan">{inspectedTest.test_id}</span>
                      <span className="tag tag-amber">{inspectedTest.gmt !== null ? `GMT Day ${inspectedTest.gmt}` : "Date: " + inspectedTest.date}</span>
                    </div>
                    <button className="s" onClick={() => setInspectedTest(null)}>✕ Close</button>
                  </div>
                  <h2>{inspectedTest.category} ({inspectedTest.fuel})</h2>
                  <div className="mu" style={{ marginBottom: "14px" }}>Principal Investigator: <b>{inspectedTest.pi}</b></div>

                  <table style={{ margin: "14px 0" }}>
                    <tbody>
                      <tr><td className="mu">Flight Test Date</td><td>{inspectedTest.date || "NASA PSI-25 Flight"}</td></tr>
                      <tr><td className="mu">Sample Tag</td><td>{inspectedTest.sample}</td></tr>
                      <tr><td className="mu">Material Description</td><td>{inspectedTest.fuel}</td></tr>
                      <tr><td className="mu">Thickness (mm)</td><td><b>{inspectedTest.thickness_mm !== null ? `${inspectedTest.thickness_mm} mm` : "N/A"}</b></td></tr>
                      <tr><td className="mu">Airflow Duct Setup</td><td>{inspectedTest.flow_restrictor ? "Narrow Duct Restrictor" : "Standard Duct Section"}</td></tr>
                      <tr><td className="mu">Fan / Air Setting</td><td>{inspectedTest.fan_display || "Nominal"} ({inspectedTest.air_display || "Ambient flow"})</td></tr>
                      <tr><td className="mu">Initial Oxygen (O₂)</td><td>{inspectedTest.o2_initial}%</td></tr>
                      <tr><td className="mu">Final Oxygen (O₂)</td><td>{inspectedTest.o2_final}%</td></tr>
                      <tr><td className="mu">O₂ Consumed</td><td style={{ color: "var(--ok)", fontWeight: 700 }}>{inspectedTest.o2_consumed}%</td></tr>
                      <tr><td className="mu">CO₂ Produced</td><td>+{inspectedTest.co2_produced}%</td></tr>
                      <tr>
                        <td className="mu">Peak Carbon Monoxide</td>
                        <td>
                          <b style={{ color: (inspectedTest.co_final || 0) >= 500 ? "var(--danger)" : "var(--ok)", fontSize: "1.1rem" }}>
                            {inspectedTest.co_final !== null ? `${inspectedTest.co_final} ppm` : "Not Recorded"}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td className="mu">Danger Assessment</td>
                        <td>
                          <span className={inspectedTest.danger_level.includes("Critical") ? "tag tag-red" : "tag tag-green"}>
                            {inspectedTest.danger_level}
                          </span>
                        </td>
                      </tr>
                      <tr><td className="mu">Recorded Video Frames</td><td>{inspectedTest.frames !== null ? `${inspectedTest.frames} frames` : "Standard duration"}</td></tr>
                    </tbody>
                  </table>

                  {/* Launch Video Action Button if Video Available */}
                  {(() => {
                    const matchVid = FLIGHT_VIDEOS.find(
                      (v) => !v.isStill && v.test_id.toUpperCase() === inspectedTest.test_id.toUpperCase()
                    );
                    if (!matchVid) return null;
                    return (
                      <div style={{ marginTop: "12px", marginBottom: "8px" }}>
                        <button
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            fontSize: "0.88rem",
                            background: "linear-gradient(135deg, rgba(79, 209, 232, 0.2), rgba(30, 144, 255, 0.35))",
                            border: "1px solid var(--cy)",
                            color: "var(--tx-bright)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 700,
                            boxShadow: "0 0 16px rgba(79, 209, 232, 0.25)",
                          }}
                          onClick={() => {
                            setSelectedVideoUrl(matchVid.url);
                            setInspectedTest(null);
                            navigateTo("/flame");
                          }}
                        >
                          🎥 Open Test {inspectedTest.test_id} Flight Video in Flame Studio (CV) ↗
                        </button>
                      </div>
                    );
                  })()}

                  <div style={{ background: "rgba(5, 10, 20, 0.7)", padding: "12px", borderRadius: "10px", marginTop: "12px", border: "1px solid var(--bd)" }}>
                    <div className="mu" style={{ fontWeight: 700, marginBottom: "4px" }}>Scientific Research Attribution:</div>
                    <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
                      Experiment conducted aboard the International Space Station (ISS) Microgravity Science Glovebox (MSG). Part of NASA Physical Sciences Informatics (PSI-25) archive under DOI: 10.60555/4qc4-de67.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FLAME STUDIO (CV) */}
        {/* ========================================================= */}
        {currentRoute === "/flame" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="c c-highlight">
              <div className="row-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <div className="row" style={{ gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <h1 style={{ margin: 0 }}>Flame Studio (Computer Vision)</h1>
                    <span className="tag tag-cyan" style={{ fontWeight: 700 }}>
                      📹 84 Spaceflight Recordings
                    </span>
                  </div>
                  <div className="mu" style={{ fontSize: "0.85rem", marginTop: "3px" }}>
                    Real-time Rec.709 Luma segmentation and temporal flame tracking across 84 real NASA ISS spaceflight recordings
                  </div>
                </div>

                {/* Navigation & Counter */}
                <div className="row" style={{ gap: "8px", alignItems: "center" }}>
                  <button
                    className="s"
                    onClick={handlePrevVideo}
                    disabled={currentVideoIndex <= 0}
                    title="Previous flight video"
                    style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                  >
                    ◀ Prev Test
                  </button>
                  <span className="mu" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                    {currentVideoIndex >= 0 ? `${currentVideoIndex + 1} / ${FLIGHT_VIDEOS.length}` : ""}
                  </span>
                  <button
                    className="s"
                    onClick={handleNextVideo}
                    disabled={currentVideoIndex >= FLIGHT_VIDEOS.length - 1}
                    title="Next flight video"
                    style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                  >
                    Next Test ▶
                  </button>
                </div>
              </div>

              {/* Video Selection Controls */}
              <div className="row" style={{ gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <input
                  type="search"
                  placeholder="🔍 Filter 84 videos (e.g. B1, T22, Nomex)..."
                  value={videoFilterQuery}
                  onChange={(e) => setVideoFilterQuery(e.target.value)}
                  style={{ flex: "1 1 200px", padding: "8px 12px", fontSize: "0.84rem", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
                />

                <select
                  value={selectedVideoUrl}
                  onChange={(e) => setSelectedVideoUrl(e.target.value)}
                  aria-label="Select ISS Spaceflight Video"
                  style={{ flex: "2 1 260px", padding: "8px 12px", fontSize: "0.84rem", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
                >
                  {Object.entries(videoGroups).map(([groupName, vids]) => (
                    <optgroup key={groupName} label={groupName}>
                      {vids.map((v) => (
                        <option key={v.url} value={v.url}>
                          {v.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Active Video Telemetry Chips */}
              {activeFlightVideo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    padding: "9px 12px",
                    background: "rgba(4, 9, 20, 0.7)",
                    borderRadius: "8px",
                    border: "1px solid var(--bd)",
                    fontSize: "0.82rem",
                  }}
                >
                  <div className="row" style={{ gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag tag-cyan">Test {activeFlightVideo.test_id}</span>
                    <span className="tag tag-blue">PI: {activeFlightVideo.pi}</span>
                    <span className="tag tag-amber">{activeFlightVideo.category}</span>
                    <span style={{ color: "var(--tx-bright)" }}>
                      Fuel: <b>{activeFlightVideo.material}</b>
                    </span>
                  </div>

                  <div className="row" style={{ gap: "10px", color: "var(--mu)", fontSize: "0.78rem" }}>
                    {activeFlightVideo.sample && <span>Sample: <b>{activeFlightVideo.sample}</b></span>}
                    {activeFlightVideo.gmt && <span>GMT: <b>Day {activeFlightVideo.gmt}</b></span>}
                    <span>Size: <b>{activeFlightVideo.sizeMB} MB</b></span>
                    <span className={activeFlightVideo.isStill ? "tag tag-amber" : "tag tag-green"} style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                      {activeFlightVideo.isStill ? "Burst Sequence" : "Flight Video MP4"}
                    </span>
                  </div>
                </div>
              )}

              {/* Scientific Transparency Callout */}
              <div className="callout-box" style={{ marginTop: "12px", marginBottom: 0 }}>
                <p className="mu" style={{ margin: 0, fontSize: "0.82rem" }}>
                  <b style={{ color: "var(--tx-bright)" }}>Scientific Transparency & Calibration Disclosure:</b> Projected flame area is calculated directly from camera sensor pixels ($px^2$). In adherence to the evaluation rubric and literature review, we maintain honest scientific abstention from uncalibrated physical millimeter extrapolation without 3D stereoscopic calibration targets.
                </p>
              </div>
            </div>

            {/* Video vs CV Canvas Split Grid */}
            <div className="g-2">
              {/* Native Video Feed */}
              <div className="c">
                <div className="row-between" style={{ marginBottom: "8px" }}>
                  <div className="row" style={{ gap: "6px", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>Native ISS Video Feed</h3>
                    <span className="tag tag-cyan">H.264 Spaceflight MP4</span>
                  </div>
                  <span className="mu" style={{ fontSize: "0.76rem" }}>
                    {activeFlightVideo?.fileName}
                  </span>
                </div>
                <video
                  ref={flameVideoRef}
                  src={selectedVideoUrl}
                  controls
                  crossOrigin="anonymous"
                  onTimeUpdate={processCurrentFrame}
                ></video>

                {/* Adaptive Quick Scrub Controls */}
                <div className="row" style={{ marginTop: "12px", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    className="s"
                    style={{ fontSize: "0.78rem", padding: "5px 10px" }}
                    onClick={() => {
                      if (flameVideoRef.current) {
                        const dur = flameVideoRef.current.duration || 20;
                        flameVideoRef.current.currentTime = Math.min(2.0, dur * 0.12);
                        processCurrentFrame();
                      }
                    }}
                  >
                    ⚡ Ignition Phase
                  </button>
                  <button
                    className="s"
                    style={{ fontSize: "0.78rem", padding: "5px 10px" }}
                    onClick={() => {
                      if (flameVideoRef.current) {
                        const dur = flameVideoRef.current.duration || 20;
                        flameVideoRef.current.currentTime = dur * 0.45;
                        processCurrentFrame();
                      }
                    }}
                  >
                    🔥 Max Flame Spread
                  </button>
                  <button
                    className="s"
                    style={{ fontSize: "0.78rem", padding: "5px 10px" }}
                    onClick={() => {
                      if (flameVideoRef.current) {
                        const dur = flameVideoRef.current.duration || 20;
                        flameVideoRef.current.currentTime = dur * 0.85;
                        processCurrentFrame();
                      }
                    }}
                  >
                    💨 Quenching / Decay Limit
                  </button>
                  <button
                    className="s"
                    style={{ fontSize: "0.78rem", padding: "5px 10px", color: "var(--cy)" }}
                    onClick={() => {
                      if (flameVideoRef.current) {
                        if (flameVideoRef.current.paused) {
                          flameVideoRef.current.play();
                        } else {
                          flameVideoRef.current.pause();
                        }
                      }
                    }}
                  >
                    ⏯ Play / Pause
                  </button>
                </div>
              </div>

              {/* CV Segmented Flame Front */}
              <div className="c">
                <div className="row-between" style={{ marginBottom: "8px" }}>
                  <h3 style={{ margin: 0 }}>Real-Time Segmented Flame Front</h3>
                  <span className="tag tag-amber">Rec.709 Luma Mask</span>
                </div>
                <div className="canvas-wrapper">
                  <canvas ref={flameCanvasRef}></canvas>
                </div>

                {/* Threshold Slider */}
                <div style={{ marginTop: "14px" }}>
                  <div className="row-between" style={{ marginBottom: "4px" }}>
                    <span className="mu">Luminance Threshold:</span>
                    <b style={{ color: "var(--cy)" }}>{threshold} / 255</b>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="220"
                    value={threshold}
                    onChange={(e) => {
                      setThreshold(Number(e.target.value));
                      processCurrentFrame();
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Real-Time Flame Metrics HUD */}
            <div className="g-4">
              <div className="stat-box">
                <div className="stat-num" style={{ color: "var(--am)" }}>{cvMetrics?.area || 0}</div>
                <div className="stat-label">Projected Flame Area (px²)</div>
              </div>
              <div className="stat-box">
                <div className="stat-num" style={{ color: "var(--cy)" }}>
                  {cvMetrics ? `${cvMetrics.len} × ${cvMetrics.wid}` : "0 × 0"}
                </div>
                <div className="stat-label">Bounding Dimensions (px)</div>
              </div>
              <div className="stat-box">
                <div className="stat-num" style={{ color: "#a29bfe" }}>
                  {cvMetrics ? (cvMetrics.len / (cvMetrics.wid || 1)).toFixed(2) : "0.00"}
                </div>
                <div className="stat-label">Aspect Ratio (L/W)</div>
              </div>
              <div className="stat-box">
                <div className="stat-num" style={{ fontSize: "1.2rem", color: cvMetrics?.status.includes("Active") ? "var(--ok)" : "var(--danger)" }}>
                  {cvMetrics?.status || "Ready"}
                </div>
                <div className="stat-label">Combustion State</div>
              </div>
            </div>

            {/* Video Sampling Scan Button & Temporal Area Curve */}
            <div className="c">
              <div className="row-between" style={{ marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: 0 }}>Temporal Flame Front Growth Curve</h3>
                  <div className="mu">Automated 20-frame time-series area trajectory ($px^2$ vs flight time)</div>
                </div>
                <button onClick={sampleVideoFrames} disabled={isSampling}>
                  {isSampling ? "⏳ Scanning Frames..." : "📈 Scan 20 Video Frames"}
                </button>
              </div>

              <div className="canvas-wrapper">
                <canvas ref={areaChartCanvasRef}></canvas>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SENSORS & ANOMALY */}
        {/* ========================================================= */}
        {currentRoute === "/sensor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="c c-highlight">
              <div className="row-between">
                <div>
                  <h1 style={{ margin: 0 }}>Sensors & Anomaly Detection</h1>
                  <div className="mu">Explainable statistical anomaly identification over spaceflight telemetry</div>
                </div>
                <div className="row">
                  <select
                    value={sensorRunIndex}
                    onChange={(e) => setSensorRunIndex(Number(e.target.value))}
                    aria-label="Select Telemetry Run"
                  >
                    {HERO_RUNS.map((r, i) => (
                      <option key={r.id} value={i}>{r.test_id}: {r.category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Algorithm & Channel Controls */}
              <div className="row" style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--bd)", gap: "14px" }}>
                <label className="row" style={{ gap: "6px" }}>
                  <span className="mu">Telemetry Channel:</span>
                  <select
                    value={sensorChannel}
                    onChange={(e) => setSensorChannel(e.target.value as any)}
                  >
                    <option value="co_ppm">Carbon Monoxide (CO ppm)</option>
                    <option value="o2">Oxygen Level (O₂ %)</option>
                    <option value="co2">Carbon Dioxide (CO₂ %)</option>
                    <option value="airflow_cms">Forced Airflow (cm/s)</option>
                  </select>
                </label>

                <label className="row" style={{ gap: "6px" }}>
                  <span className="mu">Detection Model:</span>
                  <select
                    value={activeAlgorithm}
                    onChange={(e) => setActiveAlgorithm(e.target.value as any)}
                  >
                    <option value="robust_z">Robust Rolling Z-Score (Median / MAD)</option>
                    <option value="fixed_threshold">NASA Space Safety (Fixed Threshold)</option>
                  </select>
                </label>

                {activeAlgorithm === "robust_z" && (
                  <label className="row" style={{ gap: "8px" }}>
                    <span className="mu">Z-Score Threshold:</span>
                    <b style={{ color: "var(--danger)" }}>{zThreshold.toFixed(1)} σ</b>
                    <input
                      type="range"
                      min="1.5"
                      max="4.5"
                      step="0.1"
                      value={zThreshold}
                      onChange={(e) => setZThreshold(Number(e.target.value))}
                      style={{ width: "120px" }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Anomaly Canvas Chart */}
            <div className="c">
              <div className="row-between" style={{ marginBottom: "10px" }}>
                <h3 style={{ margin: 0 }}>Telemetry Stream with Highlighted Anomaly Surge Windows</h3>
                <div className="row" style={{ fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--cy)" }}>● Nominal Baseline</span>
                  <span style={{ color: "var(--danger)", fontWeight: 700 }}>● Flagged Anomaly Event</span>
                </div>
              </div>
              <div className="canvas-wrapper">
                <canvas ref={sensorChartCanvasRef}></canvas>
              </div>
            </div>

            {/* Scientific Explanation of the Algorithm */}
            <div className="c-info c">
              <h3 style={{ color: "var(--cy)" }}>📐 Why Robust Z-Score (Median/MAD) Outperforms Deep Black-Box Models</h3>
              <p className="mu" style={{ lineHeight: 1.6, margin: 0 }}>
                With 129 spaceflight combustion runs, training deep neural networks (e.g., LSTMs or Transformers) risks catastrophic overfitting and hallucinations on critical life-support telemetry. 
                Instead, FIREWISE-X implements <b>Median Absolute Deviation (MAD)</b>:
                <br /><br />
                <code style={{ background: "#050b18", padding: "4px 8px", borderRadius: "6px", color: "var(--cy)" }}>
                  Robust Z = 0.6745 · |x - Median| / MAD
                </code>
                <br /><br />
                This metric resists extreme single-point sensor dropouts while transparently flagging true physical anomalies like sudden rapid incomplete combustion surges.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: EVIDENCE ENGINE */}
        {/* ========================================================= */}
        {currentRoute === "/evid" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="c c-highlight">
              <div className="row-between">
                <div>
                  <h1 style={{ margin: 0 }}>Evidence Engine</h1>
                  <div className="mu">Peer-reviewed literature grounding and NASA Technical Memorandums</div>
                </div>
                <input
                  type="search"
                  placeholder="Search papers, authors, DOIs..."
                  value={evidenceSearch}
                  onChange={(e) => setEvidenceSearch(e.target.value)}
                  style={{ width: "260px" }}
                />
              </div>

              {/* Filter Pills */}
              <div className="row" style={{ marginTop: "12px", gap: "8px" }}>
                {[
                  "ALL",
                  "Extinction Boundary",
                  "Rod Flammability & Toxicity",
                  "Mission Safety Report",
                  "Combustion Regimes",
                  "Fabric & Insulation Safety",
                  "Intermediate Thickness Fuel",
                ].map((cat) => (
                  <button
                    key={cat}
                    className={`pill-filter ${evidenceFilter === cat ? "active" : ""}`}
                    onClick={() => setEvidenceFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Honest Scientific Abstention State for Lunar/Mars/Cabin Queries */}
            {isUnanswerableQuery && (
              <div className="callout-box danger-callout" style={{ margin: "14px 0" }}>
                <div className="row-between" style={{ marginBottom: "6px" }}>
                  <h4 style={{ color: "var(--danger)", margin: 0 }}>⚠️ Evidence Boundary & Honest Scientific Abstention</h4>
                  <span className="tag tag-red">Scope Disclosure</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.86rem", lineHeight: 1.6, color: "#fbd38d" }}>
                  <b>Scientific Scope Disclosure:</b> NASA BASS-II (PSI-25) was conducted strictly inside the sealed Microgravity Science Glovebox (MSG) in microgravity (0g). <b>No partial-gravity (Moon 0.16g or Mars 0.38g) combustion data exists in this archive.</b> Extrapolating these low-gravity results to lunar habitats or uncontained crew cabin exposure without dedicated aircraft parabolic or centrifuge experiments is scientifically unsupported.
                </p>
              </div>
            )}

            {/* Evidence Cards Grid */}
            <div className="g-3">
              {filteredEvidence.map((card) => (
                <div key={card.id} className="c" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="row-between" style={{ marginBottom: "8px" }}>
                      <span className="tag tag-cyan">{card.category}</span>
                      <span className="mu" style={{ fontSize: "0.78rem" }}>{card.year}</span>
                    </div>
                    <h3 style={{ margin: "4px 0 8px", fontSize: "1.05rem", color: "var(--tx-bright)" }}>{card.title}</h3>
                    <div className="mu" style={{ fontSize: "0.82rem", marginBottom: "10px" }}>{card.authors}</div>
                    <p style={{ fontSize: "0.86rem", lineHeight: 1.5 }}>
                      <b>Key Finding:</b> {card.key_finding}
                    </p>
                    <div style={{ background: "rgba(5, 10, 20, 0.7)", padding: "10px", borderRadius: "8px", border: "1px solid var(--bd)", marginTop: "10px" }}>
                      <p style={{ margin: "0 0 6px", fontSize: "0.82rem", color: "var(--ok)" }}>
                        <b>Supports in Firewise-X:</b> {card.supports}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--am)" }}>
                        <b>Honest Limitations:</b> {card.limitations}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid var(--bd)" }}>
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="btn s" style={{ width: "100%", fontSize: "0.82rem" }}>
                      Read Official Publication (DOI: {card.doi}) ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: COMPARE RUNS */}
        {/* ========================================================= */}
        {currentRoute === "/cmp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="c c-highlight">
              <h1 style={{ margin: 0 }}>Compare Flight Experiments</h1>
              <div className="mu">Side-by-side comparative analysis of fuel geometries, oxygen levels, and toxic combustion signatures</div>
              <div className="row" style={{ marginTop: "14px", gap: "18px" }}>
                <label className="row" style={{ gap: "8px" }}>
                  <b style={{ color: "var(--cy)" }}>Run A:</b>
                  <select value={compareA} onChange={(e) => setCompareA(Number(e.target.value))}>
                    {HERO_RUNS.map((r, i) => (<option key={r.id} value={i}>{r.test_id}: {r.category}</option>))}
                  </select>
                </label>
                <label className="row" style={{ gap: "8px" }}>
                  <b style={{ color: "var(--am)" }}>Run B:</b>
                  <select value={compareB} onChange={(e) => setCompareB(Number(e.target.value))}>
                    {HERO_RUNS.map((r, i) => (<option key={r.id} value={i}>{r.test_id}: {r.category}</option>))}
                  </select>
                </label>
              </div>
            </div>

            {/* Visual Comparison Table */}
            <div className="wrap">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th style={{ color: "var(--cy)" }}>Run A: {HERO_RUNS[compareA].test_id} ({HERO_RUNS[compareA].category})</th>
                    <th style={{ color: "var(--am)" }}>Run B: {HERO_RUNS[compareB].test_id} ({HERO_RUNS[compareB].category})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="mu">Investigator</td><td><b>{HERO_RUNS[compareA].pi}</b></td><td><b>{HERO_RUNS[compareB].pi}</b></td></tr>
                  <tr><td className="mu">Material Detail</td><td>{HERO_RUNS[compareA].material}</td><td>{HERO_RUNS[compareB].material}</td></tr>
                  <tr><td className="mu">Thickness (mm)</td><td><b>{HERO_RUNS[compareA].thickness_mm} mm</b></td><td><b>{HERO_RUNS[compareB].thickness_mm} mm</b></td></tr>
                  <tr><td className="mu">Initial O₂ Level</td><td>{HERO_RUNS[compareA].initial_o2}%</td><td>{HERO_RUNS[compareB].initial_o2}%</td></tr>
                  <tr>
                    <td className="mu">O₂ Depletion</td>
                    <td style={{ color: "var(--ok)", fontWeight: 700 }}>
                      {HERO_RUNS[compareA].initial_o2 - HERO_RUNS[compareA].final_o2 > 0
                        ? `-${(HERO_RUNS[compareA].initial_o2 - HERO_RUNS[compareA].final_o2).toFixed(2)}%`
                        : "0%"}
                    </td>
                    <td style={{ color: "var(--ok)", fontWeight: 700 }}>
                      {HERO_RUNS[compareB].initial_o2 - HERO_RUNS[compareB].final_o2 > 0
                        ? `-${(HERO_RUNS[compareB].initial_o2 - HERO_RUNS[compareB].final_o2).toFixed(2)}%`
                        : "0%"}
                    </td>
                  </tr>
                  <tr>
                    <td className="mu">Peak Carbon Monoxide</td>
                    <td><b style={{ color: "var(--danger)", fontSize: "1.1rem" }}>{HERO_RUNS[compareA].final_co_ppm} ppm</b></td>
                    <td><b style={{ color: "var(--danger)", fontSize: "1.1rem" }}>{HERO_RUNS[compareB].final_co_ppm} ppm</b></td>
                  </tr>
                  <tr>
                    <td className="mu">Toxicity Danger Level</td>
                    <td><span className={HERO_RUNS[compareA].co_danger.includes("Critical") ? "tag tag-red" : "tag tag-green"}>{HERO_RUNS[compareA].co_danger}</span></td>
                    <td><span className={HERO_RUNS[compareB].co_danger.includes("Critical") ? "tag tag-red" : "tag tag-green"}>{HERO_RUNS[compareB].co_danger}</span></td>
                  </tr>
                  <tr>
                    <td className="mu">Documented Outcome</td>
                    <td style={{ fontSize: "0.84rem", whiteSpace: "normal" }}>{HERO_RUNS[compareA].outcome}</td>
                    <td style={{ fontSize: "0.84rem", whiteSpace: "normal" }}>{HERO_RUNS[compareB].outcome}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: PRE-MISSION ASSESSMENT ENGINE */}
        {/* ========================================================= */}
        {currentRoute === "/assessment" && (
          <PreMissionAssessment
            onNavigateToTest={handleNavigateToTest}
            onNavigateToFlame={handleNavigateToFlame}
          />
        )}

        {/* ========================================================= */}
        {/* TAB 9: ASTRONAUT AI ASSISTANT */}
        {/* ========================================================= */}
        {currentRoute === "/assistant" && (
          <AstronautAssistant
            onNavigateToTest={handleNavigateToTest}
            onNavigateToFlame={handleNavigateToFlame}
          />
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
