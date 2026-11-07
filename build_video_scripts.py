# -*- coding: utf-8 -*-
"""
Script to generate 3-Minute Video Presentation Scripts in Bengali and English as PDFs for FIREWISE-X.
"""

import os
import subprocess

html_en = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — 3-Minute Video Presentation Script (English)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1a202c;
    line-height: 1.45;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }
  .header-card {
    background: #060b17;
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    border-left: 5px solid #4fd1e8;
  }
  .header-card h1 {
    margin: 0 0 4px;
    font-size: 18pt;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .header-card .subtitle {
    color: #4fd1e8;
    font-weight: 700;
    font-size: 10.5pt;
    margin-bottom: 8px;
  }
  .meta-grid {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    font-size: 8.5pt;
    color: #a0aec0;
    border-top: 1px solid #1c2d52;
    padding-top: 8px;
    margin-top: 6px;
  }
  .meta-grid span b {
    color: #ffffff;
  }
  .badge {
    display: inline-block;
    padding: 2px 7px;
    font-size: 7.5pt;
    font-weight: 700;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .badge-cyan { background: #e6fffa; color: #007788; border: 1px solid #81e6d9; }
  .badge-red { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
  .badge-amber { background: #fffaf0; color: #b7791f; border: 1px solid #fbd38d; }
  
  table.script-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 8.8pt;
  }
  table.script-table th {
    background: #0d1e3d;
    color: #ffffff;
    text-align: left;
    padding: 8px 10px;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #0d1e3d;
  }
  table.script-table td {
    padding: 9px 10px;
    vertical-align: top;
    border: 1px solid #e2e8f0;
    line-height: 1.45;
  }
  table.script-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .time-cell {
    width: 75px;
    font-weight: 800;
    color: #0d1e3d;
    white-space: nowrap;
  }
  .action-cell {
    width: 28%;
    color: #2d3748;
    background: #fbfcfe;
  }
  .action-cell b {
    color: #007788;
    display: block;
    margin-bottom: 3px;
  }
  .voiceover-cell {
    width: 44%;
    color: #1a202c;
  }
  .voiceover-cell p {
    margin: 0;
  }
  .overlay-cell {
    width: 18%;
    font-size: 7.8pt;
    color: #4a5568;
  }
  .cue-tag {
    font-size: 7.5pt;
    color: #718096;
    font-style: italic;
    display: block;
    margin-top: 4px;
  }
  .instruction-box {
    background: #ebf8ff;
    border-left: 4px solid #3182ce;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 8.5pt;
    color: #2b6cb0;
  }
  .instruction-box b {
    color: #2c5282;
  }
  .footer-note {
    margin-top: 15px;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    font-size: 8pt;
    color: #718096;
    text-align: center;
  }
  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

<div class="header-card">
  <h1>🔥 FIREWISE-X — 3-Minute Video Presentation Script</h1>
  <div class="subtitle">NASA International Space Apps Challenge 2026 | Challenge: Flame in Freefall</div>
  <div class="meta-grid">
    <span><b>Target Duration:</b> 180 Seconds (3:00 Min)</span>
    <span><b>Spoken Word Count:</b> 408 Words (~136 wpm)</span>
    <span><b>Video Resolution:</b> 1080p 60fps</span>
    <span><b>Platform URL:</b> http://localhost:3000</span>
    <span><b>Data Source:</b> NASA PSI-25 (BASS-II)</span>
  </div>
</div>

<div class="instruction-box">
  <b>🎬 Director & Presenter Delivery Guidelines:</b>
  Keep delivery energetic, scientific, and confident. Use a smooth mouse cursor with slight yellow highlight circle during screen recording. Pacing is calibrated at ~135 words per minute. Practice speaking along with the visual clicks so each scene transitions exactly at the indicated timestamp.
</div>

<table class="script-table">
  <thead>
    <tr>
      <th style="width: 80px;">Timecode</th>
      <th style="width: 27%;">Visual Screen Action (What to Show)</th>
      <th style="width: 45%;">Voiceover Dialogue (What to Say)</th>
      <th style="width: 20%;">On-Screen Graphics & SFX</th>
    </tr>
  </thead>
  <tbody>
    <!-- Scene 1 -->
    <tr>
      <td class="time-cell">
        0:00 – 0:25<br>
        <span class="badge badge-amber">25 Sec</span>
      </td>
      <td class="action-cell">
        <b>Home Page & Science Primer</b>
        • Open on <code>http://localhost:3000</code> Home.<br>
        • Zoom into Hero text: <i>"Understand the Flame. Follow the Evidence."</i><br>
        • Scroll smoothly down to the <b>Earth (1g) vs ISS (0g)</b> visual comparison card.<br>
        • Hover mouse over the buoyant flame vs spherical space dome.
      </td>
      <td class="voiceover-cell">
        <p>
          "In space, fire doesn’t behave like it does on Earth. Without gravity, natural buoyancy vanishes—hot gases cannot rise away. Instead, flames morph into quiet, creeping spheres.
        </p>
        <p style="margin-top: 5px;">
          But this calm appearance hides a lethal reality: sluggish cabin airflow causes severe incomplete combustion, generating toxic Carbon Monoxide surges up to <b>950 ppm</b>! Welcome to <b>FIREWISE-X</b>: an evidence-grounded research engine transforming 129 real NASA ISS combustion tests into life-saving spacecraft fire safety protocols."
        </p>
        <span class="cue-tag">Tone: Dramatic, authoritative hook; steady pace.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "FIREWISE-X"<br>
        "NASA BASS-II (PSI-25)"<br>
        <br>
        <b>SFX:</b> Subtle low synth drone; atmospheric spacecraft hum.
      </td>
    </tr>

    <!-- Scene 2 -->
    <tr>
      <td class="time-cell">
        0:25 – 0:55<br>
        <span class="badge badge-red">30 Sec</span>
      </td>
      <td class="action-cell">
        <b>Mission Control Live Telemetry</b>
        • Click <b>🚀 Mission Control</b> in top nav.<br>
        • Click pill: <b>🔴 TEST_O13A</b> (PMMA Rod).<br>
        • Point cursor to the <b>Cabin Toxicity Threat Gauge</b> swinging into the red lethal zone.<br>
        • Hover over the canvas chart: show glowing crosshair and floating HUD box with time, O₂, and 950 ppm CO.
      </td>
      <td class="voiceover-cell">
        <p>
          "Stepping into Mission Control, we interface directly with real flight data from NASA's BASS-II experiment on the International Space Station.
        </p>
        <p style="margin-top: 5px;">
          Selecting Test O13a—a half-inch acrylic rod—our dynamic Cabin Threat Meter immediately flags a critical hazard. As we trace the high-DPI telemetry stream, our interactive HUD reveals the exact second oxygen plummets and Carbon Monoxide spikes to an alarming <b>950 ppm</b>—far exceeding safe astronaut thresholds."
        </p>
        <span class="cue-tag">Tone: Focused, urgent, pointing out telemetry spikes.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "Peak Toxic CO: 950 ppm"<br>
        "Threshold: &gt;500 ppm Lethal"<br>
        <br>
        <b>SFX:</b> Interface click blip; soft warning chime.
      </td>
    </tr>

    <!-- Scene 3 -->
    <tr>
      <td class="time-cell">
        0:55 – 1:30<br>
        <span class="badge badge-cyan">35 Sec</span>
      </td>
      <td class="action-cell">
        <b>129 Tests Explorer & Catalog</b>
        • Click <b>📊 129 Tests Explorer</b>.<br>
        • Click preset: <b>🚨 Critical CO Spikes (&gt;500 ppm)</b>.<br>
        • Click button: <b>📱 Switch to Visual Cards</b>.<br>
        • Click on <b>TEST_M5</b> card to pop open the <b>Test Detail Modal</b> with 17 telemetry fields.<br>
        • Close modal (click ✕).
      </td>
      <td class="voiceover-cell">
        <p>
          "Unlike projects built on synthetic mocks, FIREWISE-X directly ingests all 129 flight combustion tests from NASA's Physical Sciences Informatics archive.
        </p>
        <p style="margin-top: 5px;">
          With one click on our preset filters, researchers instantly isolate all runs exceeding 500 ppm CO. We can seamlessly toggle from dense tabular data to mobile-friendly visual cards, and open an in-depth parameter modal detailing fuel thickness, airflow duct restrictions, and investigator observations."
        </p>
        <span class="cue-tag">Tone: Energetic; showing depth and real data provenance.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "129 Real Spaceflight Runs"<br>
        "NASA DOI: 10.60555/4qc4-de67"<br>
        <br>
        <b>SFX:</b> Crisp filter click; modal pop whoosh.
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<table class="script-table" style="margin-top: 15px;">
  <thead>
    <tr>
      <th style="width: 80px;">Timecode</th>
      <th style="width: 27%;">Visual Screen Action (What to Show)</th>
      <th style="width: 45%;">Voiceover Dialogue (What to Say)</th>
      <th style="width: 20%;">On-Screen Graphics & SFX</th>
    </tr>
  </thead>
  <tbody>
    <!-- Scene 4 -->
    <tr>
      <td class="time-cell">
        1:30 – 2:05<br>
        <span class="badge badge-amber">35 Sec</span>
      </td>
      <td class="action-cell">
        <b>Flame Studio & Computer Vision</b>
        • Click <b>🎥 Flame Studio (CV)</b>.<br>
        • Play native ISS video (Test B1).<br>
        • Point to the right-hand canvas: highlight golden segmented flame, cyan bounding box, red centroid.<br>
        • Move Luma Threshold slider (140 → 160).<br>
        • Click <b>📈 Scan 20 Video Frames</b> button.<br>
        • Watch the temporal area curve render.
      </td>
      <td class="voiceover-cell">
        <p>
          "In Flame Studio, we analyze native H.264 video captured inside the ISS Microgravity Science Glovebox. Using classical Rec.709 luminance thresholding, our algorithm tracks flame front boundaries, bounding dimensions, and centroid trajectories in real-time.
        </p>
        <p style="margin-top: 5px;">
          By clicking 'Scan Video Frames', FIREWISE-X automatically samples temporal keyframes to graph the complete flame front expansion curve. And maintaining strict scientific honesty, we abstain from uncalibrated 3D millimeter claims, reporting strictly in verifiable camera pixels."
        </p>
        <span class="cue-tag">Tone: Technical precision, emphasizing scientific integrity.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "Classical Rec.709 Luma CV"<br>
        "Temporal Flame Front Growth"<br>
        "Honest Pixel Disclosure"<br>
        <br>
        <b>SFX:</b> Camera shutter click; smooth curve draw sweep.
      </td>
    </tr>

    <!-- Scene 5 -->
    <tr>
      <td class="time-cell">
        2:05 – 2:35<br>
        <span class="badge badge-cyan">30 Sec</span>
      </td>
      <td class="action-cell">
        <b>Sensors Anomaly & Evidence Engine</b>
        • Click <b>📈 Sensors & Anomaly</b>.<br>
        • Adjust Z-Threshold slider (3.0σ).<br>
        • Show glowing red anomaly beacon rings on the surge points.<br>
        • Click <b>📚 Evidence Engine</b> in nav.<br>
        • Filter by 'Toxic Emissions'.<br>
        • Hover over NASA TM-20210011385 card and click DOI link.
      </td>
      <td class="voiceover-cell">
        <p>
          "To detect anomalies without deep-learning hallucination, our Sensors tab implements a Robust Rolling Z-score powered by Median Absolute Deviation (MAD), pinpointing sudden toxic surges while rejecting sensor noise.
        </p>
        <p style="margin-top: 5px;">
          Every detection is fully transparent. In our Evidence Engine, every algorithm and telemetry spike maps directly to peer-reviewed NASA literature and Technical Memorandums with exact DOIs and explicit limitation boundaries."
        </p>
        <span class="cue-tag">Tone: Analytical, establishing peer-reviewed credibility.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "Robust Z-Score: Median / MAD"<br>
        "Zero AI Hallucination"<br>
        "Direct NTRS DOI Citations"<br>
        <br>
        <b>SFX:</b> Anomaly ping sound; page flip sound.
      </td>
    </tr>

    <!-- Scene 6 -->
    <tr>
      <td class="time-cell">
        2:35 – 3:00<br>
        <span class="badge badge-amber">25 Sec</span>
      </td>
      <td class="action-cell">
        <b>Compare Runs & Mission Impact</b>
        • Click <b>⚖️ Compare Runs</b> in nav.<br>
        • Select Run A (Test B1 Thin Film) vs Run B (Test M5 Thick Slab).<br>
        • Highlight oxygen depletion (-3.2%) and CO spike (500 ppm).<br>
        • Scroll to footer and show final NASA Space Apps 2026 title graphic.
      </td>
      <td class="voiceover-cell">
        <p>
          "Finally, Compare Runs reveals critical physical contrasts: thick acrylic slabs sustain two-sided burning that consumes over 3% oxygen and pumps out 500 ppm CO, whereas thin films extinguish rapidly when airflow ceases.
        </p>
        <p style="margin-top: 5px;">
          By turning archived flight telemetry into transparent, explainable intelligence, FIREWISE-X provides the foundation for autonomous fire safety aboard Artemis, Gateway, and deep-space habitats. <b>Understand the flame. Follow the evidence.</b> Thank you."
        </p>
        <span class="cue-tag">Tone: Inspiring, impactful conclusion with strong sign-off.</span>
      </td>
      <td class="overlay-cell">
        <b>Text Overlay:</b><br>
        "Artemis & Gateway Ready"<br>
        "Understand the Flame."<br>
        "Follow the Evidence."<br>
        <br>
        <b>SFX:</b> Uplifting cinematic music swell; final fade out.
      </td>
    </tr>
  </tbody>
</table>

<div class="footer-note">
  FIREWISE-X — Official Submission for the NASA International Space Apps Challenge 2026 (Challenge: Flame in Freefall)<br>
  Built with Next.js 16, TypeScript, Canvas API, and NASA Physical Sciences Informatics (PSI-25, DOI: 10.60555/4qc4-de67).
</div>

</body>
</html>
"""

html_bn = """<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — ৩ মিনিটের ভিডিও উপস্থাপনা স্ক্রিপ্ট (বাংলা)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  body {
    font-family: "Nirmala UI", "Vrinda", "Kalpurush", "SolaimanLipi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1a202c;
    line-height: 1.5;
    font-size: 9.8pt;
    margin: 0;
    padding: 0;
  }
  .header-card {
    background: #060b17;
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    border-left: 5px solid #f5b041;
  }
  .header-card h1 {
    margin: 0 0 4px;
    font-size: 17.5pt;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .header-card .subtitle {
    color: #f5b041;
    font-weight: 700;
    font-size: 10.5pt;
    margin-bottom: 8px;
  }
  .meta-grid {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    font-size: 8.5pt;
    color: #a0aec0;
    border-top: 1px solid #1c2d52;
    padding-top: 8px;
    margin-top: 6px;
  }
  .meta-grid span b {
    color: #ffffff;
  }
  .badge {
    display: inline-block;
    padding: 2px 7px;
    font-size: 7.5pt;
    font-weight: 700;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .badge-cyan { background: #e6fffa; color: #007788; border: 1px solid #81e6d9; }
  .badge-red { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
  .badge-amber { background: #fffaf0; color: #b7791f; border: 1px solid #fbd38d; }
  
  table.script-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 8.8pt;
  }
  table.script-table th {
    background: #0d1e3d;
    color: #ffffff;
    text-align: left;
    padding: 8px 10px;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #0d1e3d;
  }
  table.script-table td {
    padding: 9px 10px;
    vertical-align: top;
    border: 1px solid #e2e8f0;
    line-height: 1.5;
  }
  table.script-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .time-cell {
    width: 75px;
    font-weight: 800;
    color: #0d1e3d;
    white-space: nowrap;
  }
  .action-cell {
    width: 27%;
    color: #2d3748;
    background: #fbfcfe;
  }
  .action-cell b {
    color: #b7791f;
    display: block;
    margin-bottom: 3px;
  }
  .voiceover-cell {
    width: 45%;
    color: #1a202c;
  }
  .voiceover-cell p {
    margin: 0;
  }
  .overlay-cell {
    width: 20%;
    font-size: 7.8pt;
    color: #4a5568;
  }
  .cue-tag {
    font-size: 7.5pt;
    color: #718096;
    font-style: italic;
    display: block;
    margin-top: 4px;
  }
  .instruction-box {
    background: #fffaf0;
    border-left: 4px solid #dd6b20;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 8.5pt;
    color: #7b341e;
  }
  .instruction-box b {
    color: #9c4221;
  }
  .footer-note {
    margin-top: 15px;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    font-size: 8pt;
    color: #718096;
    text-align: center;
  }
  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

<div class="header-card">
  <h1>🔥 FIREWISE-X — ৩ মিনিটের ভিডিও উপস্থাপনা স্ক্রিপ্ট</h1>
  <div class="subtitle">নাসা ইন্টারন্যাশনাল স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬ | চ্যালেঞ্জ: Flame in Freefall</div>
  <div class="meta-grid">
    <span><b>নির্ধারিত সময়:</b> ১৮০ সেকেন্ড (৩:০০ মিনিট)</span>
    <span><b>শব্দ সংখ্যা:</b> ৩৯৫ শব্দ (প্রতি মিনিটে ~১৩২ শব্দ)</span>
    <span><b>ভিডিও রেজোলিউশন:</b> 1080p 60fps</span>
    <span><b>লাইভ ডোমেইন:</b> http://localhost:3000</span>
    <span><b>ডাটাবেজ:</b> NASA PSI-25 (BASS-II)</span>
  </div>
</div>

<div class="instruction-box">
  <b>🎬 নির্দেশক ও উপস্থাপকের জন্য গুরুত্বপূর্ণ নির্দেশনা:</b>
  উপস্থাপনার ভঙ্গি হবে স্পষ্ট, আত্মবিশ্বাসী এবং বৈজ্ঞানিক। স্ক্রিন রেকর্ডিং করার সময় মাউস কার্সারে হালকা হলুদ সার্কেল হাইলাইট ব্যবহার করুন। ভিডিওতে মাউস ক্লিকের সাথে কথার গতিশীলতা বজায় রাখুন, যাতে নির্ধারিত সময়ে প্রতিটি দৃশ্য প্রদর্শিত হয়।
</div>

<table class="script-table">
  <thead>
    <tr>
      <th style="width: 80px;">টাইমকোড</th>
      <th style="width: 27%;">ভিজ্যুয়াল স্ক্রিন অ্যাকশন (যা স্ক্রিনে দেখাবেন)</th>
      <th style="width: 45%;">ভয়েসওভার ডায়লগ (যা মুখে বলবেন)</th>
      <th style="width: 20%;">অন-স্ক্রিন টেক্সট ও শব্দ প্রভাব (SFX)</th>
    </tr>
  </thead>
  <tbody>
    <!-- Scene 1 -->
    <tr>
      <td class="time-cell">
        ০:০০ – ০:২৫<br>
        <span class="badge badge-amber">২৫ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>হোম পেজ ও সায়েন্স প্রাইমার</b>
        • ব্রাউজারে <code>http://localhost:3000</code> হোম পেজ খুলুন।<br>
        • হিরো টেক্সট জুম করুন: <i>"Understand the Flame. Follow the Evidence."</i><br>
        • স্ক্রল করে নিচে <b>Earth (1g) vs ISS (0g)</b> ভিজ্যুয়াল কার্ড দেখান।<br>
        • মাউস কার্সর দিয়ে পৃথিবীর লম্বা শিখা ও স্পেসের গোল গম্বুজ শিখা নির্দেশ করুন।
      </td>
      <td class="voiceover-cell">
        <p>
          "মহাকাশে আগুনের আচরণ পৃথিবীর মতো নয়। গ্র্যাভিটি বা মাধ্যাকর্ষণ না থাকায় সেখানে কোনো প্লবতা থাকে না—গরম গ্যাস উপরে উঠতে পারে না। আগুন চারদিকে শান্ত, বৃত্তাকার গম্বুজের মতো জ্বলে।
        </p>
        <p style="margin-top: 5px;">
          কিন্তু এই শান্ত রূপের পেছনে লুকিয়ে আছে এক প্রাণঘাতী বিপদ: অক্সিজেন সরবরাহ কমে গেলে শুরু হয় মারাত্মক অসম্পূর্ণ দহন, যা কেবিনের ভেতর <b>৯৫০ পিপিএম</b> পর্যন্ত বিষাক্ত কার্বন মনোক্সাইড নির্গমন করে! নাসার স্পেস অ্যাপস চ্যালেঞ্জের জন্য আমরা তৈরি করেছি <b>FIREWISE-X</b>: যা নাসার ১২৯টি স্পেসফ্লাইট পরীক্ষার বাস্তব ডাটা দিয়ে মহাকাশচারীদের অগ্নিনিরাপত্তা নিশ্চিত করে।"
        </p>
        <span class="cue-tag">টোন: গম্ভীর ও রোমাঞ্চকর হুক; স্পষ্ট উচ্চারণ।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "FIREWISE-X"<br>
        "NASA BASS-II (PSI-25)"<br>
        <br>
        <b>SFX:</b> ধীরগতির সায়েন্স ফিকশন সিন্থ ড্রোন।
      </td>
    </tr>

    <!-- Scene 2 -->
    <tr>
      <td class="time-cell">
        ০:২৫ – ০:৫৫<br>
        <span class="badge badge-red">৩০ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>মিশন কন্ট্রোল ও লাইভ টেলিমেট্রি</b>
        • টপ ন্যাপ থেকে <b>🚀 Mission Control</b> ক্লিক করুন।<br>
        • প্রিসেট পিল <b>🔴 TEST_O13A</b> (PMMA Rod) সিলেক্ট করুন।<br>
        • <b>Cabin Toxicity Threat Gauge</b>-এ পয়েন্টারটি রেড অ্যালার্ট জোনে যেতে দেখান।<br>
        • ক্যানভাস চার্টে মাউস হোভার করুন: লাইভ ক্রসহেয়ার এবং টাইম, O₂ ও ৯৫০ পিপিএম CO টুলটিপ দেখান।
      </td>
      <td class="voiceover-cell">
        <p>
          "মিশন কন্ট্রোল ট্যাবে আমরা সরাসরি ইন্টারন্যাশনাল স্পেস স্টেশনের BASS-II ফ্লাইট ডাটা পর্যবেক্ষণ করি।
        </p>
        <p style="margin-top: 5px;">
          টেস্ট O13a নির্বাচন করলেই আমাদের কেবিন থ্রেট মিটারটি সরাসরি রেড অ্যালার্ট জোনে পৌঁছে যায়। হাই-ডিপিআই টেলিমেট্রি গ্রাফে মাউস হোভার করলেই লাইভ ক্রসহেয়ারে দেখা যায়—অক্সিজেন কমার সাথে সাথে কার্বন মনোক্সাইডের মাত্রা কীভাবে বিপজ্জনক <b>৯৫০ পিপিএমে</b> পৌঁছায়, যা মহাকাশচারীদের জীবন বিপন্ন করার জন্য যথেষ্ট!"
        </p>
        <span class="cue-tag">টোন: বিশ্লেষণী ও জরুরি; বিপদের মাত্রা ফুটিয়ে তুলুন।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "Peak Toxic CO: 950 ppm"<br>
        "Threshold: &gt;500 ppm Lethal"<br>
        <br>
        <b>SFX:</b> ইন্টারফেস মাউস ক্লিক; সফট ওয়ার্নিং বিম।
      </td>
    </tr>

    <!-- Scene 3 -->
    <tr>
      <td class="time-cell">
        ০:৫৫ – ১:৩০<br>
        <span class="badge badge-cyan">৩৫ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>১২৯টি ফ্লাইট টেস্ট এক্সপ্লোরার</b>
        • <b>📊 129 Tests Explorer</b>-এ যান।<br>
        • প্রিসেট ক্লিক করুন: <b>🚨 Critical CO Spikes (&gt;500 ppm)</b>।<br>
        • বাটন ক্লিক: <b>📱 Switch to Visual Cards</b>।<br>
        • <b>TEST_M5</b> কার্ডে ক্লিক করে ১৭টি প্যারামিটারের <b>Test Detail Modal</b> ওপেন করে দেখান।<br>
        • মোডাল বন্ধ করুন (✕)।
      </td>
      <td class="voiceover-cell">
        <p>
          "কোনো ডামি বা কাল্পনিক ডাটা নয়—FIREWISE-X সরাসরি নাসার ফিজিক্যাল সায়েন্সেস ইনফরমেটিক্স আর্কাইভের সম্পূর্ণ ১২৯টি স্পেসফ্লাইট ডাটাবেজ প্রসেস করে।
        </p>
        <p style="margin-top: 5px;">
          আমাদের কুইক প্রিসেট ফিল্টারে এক ক্লিকেই ৫০০ পিপিএমের বেশি বিষাক্ত গ্যাস তৈরি করা টেস্টগুলো আলাদা করা যায়। গবেষকরা বড় টেবিল থেকে মোবাইল-ফ্রেন্ডলি কার্ড ভিউতে সুইচ করতে পারেন এবং যেকোনো টেস্টে ক্লিক করলেই ফুয়েল থিকনেস, ডাক্ট রেস্ট্রিক্টর ও টেস্ট রেজাল্টের সম্পূর্ণ মোডাল ওপেন হয়।"
        </p>
        <span class="cue-tag">টোন: উদ্যমী ও আত্মবিশ্বাসী; আসল ডাটাবেজ প্রদর্শনের গর্ব।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "129 Real Spaceflight Runs"<br>
        "NASA DOI: 10.60555/4qc4-de67"<br>
        <br>
        <b>SFX:</b> ক্রিস্প ফিল্টার ক্লিক; মোডাল পপ সাউন্ড।
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<table class="script-table" style="margin-top: 15px;">
  <thead>
    <tr>
      <th style="width: 80px;">টাইমকোড</th>
      <th style="width: 27%;">ভিজ্যুয়াল স্ক্রিন অ্যাকশন (যা স্ক্রিনে দেখাবেন)</th>
      <th style="width: 45%;">ভয়েসওভার ডায়লগ (যা মুখে বলবেন)</th>
      <th style="width: 20%;">অন-স্ক্রিন টেক্সট ও শব্দ প্রভাব (SFX)</th>
    </tr>
  </thead>
  <tbody>
    <!-- Scene 4 -->
    <tr>
      <td class="time-cell">
        ১:৩০ – ২:০৫<br>
        <span class="badge badge-amber">৩৫ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>ফ্লেম স্টুডিও ও কম্পিউটার ভিশন</b>
        • <b>🎥 Flame Studio (CV)</b>-তে যান।<br>
        • টেস্ট B1 এর আসল ISS ফ্লাইট ভিডিও প্লে করুন।<br>
        • ডানপাশের ক্যানভাসে গোল্ডেন সেগমেন্টেড ফ্লেম, সাইয়ান বাউন্ডিং বক্স ও রেড সেন্ট্রয়েড দেখান।<br>
        • লুমা স্লাইডার সামান্য নাড়াচাড়া করুন।<br>
        • <b>📈 Scan 20 Video Frames</b> বাটনে ক্লিক করে এরিয়া কার্ভ জেনারেট করুন।
      </td>
      <td class="voiceover-cell">
        <p>
          "ফ্লেম স্টুডিওতে আমরা আইএসএস-এর মাইক্রোগ্র্যাভিটি গ্লাভবক্সের আসল ফ্লাইট ভিডিও বিশ্লেষণ করি। ক্লাসিক্যাল Rec.709 লুমা কম্পিউটার ভিশনের মাধ্যমে রিয়েল-টাইমে আগুনের বাউন্ডারি, সাইজ এবং সেন্ট্রয়েড ট্র্যাক করা হয়।
        </p>
        <p style="margin-top: 5px;">
          'Scan Video Frames' বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে আগুনের বিস্তার বা ফ্লেম এরিয়া গ্রোথ কার্ভ তৈরি হয়। কঠোর বৈজ্ঞানিক সততা বজায় রেখে আমরা কোনো মনগড়া মিলিমিটার কনভার্শন না করে সেন্সরের আসল পিক্সেলে পরিমাপ প্রদর্শন করি।"
        </p>
        <span class="cue-tag">টোন: প্রযুক্তিগত নির্ভুলতা; সায়েন্টিফিক সততা প্রকাশ।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "Classical Rec.709 Luma CV"<br>
        "Temporal Flame Front Growth"<br>
        "Honest Pixel Disclosure"<br>
        <br>
        <b>SFX:</b> ক্যামেরা শাটার ক্লিক; কার্ভ ড্রয়িং সুইপ।
      </td>
    </tr>

    <!-- Scene 5 -->
    <tr>
      <td class="time-cell">
        ২:০৫ – ২:৩৫<br>
        <span class="badge badge-cyan">৩০ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>সেন্সরস অ্যানোমালি ও এভিডেন্স ইঞ্জিন</b>
        • <b>📈 Sensors & Anomaly</b> ট্যাবে যান।<br>
        • Z-Threshold স্লাইডার 3.0σ-তে নিন।<br>
        • লাল রঙের পালসিং অ্যানোমালি রিংগুলো দেখান।<br>
        • ন্যাপ বার থেকে <b>📚 Evidence Engine</b>-এ যান।<br>
        • 'Toxic Emissions' ফিল্টার করুন এবং নাসা পেপারের DOI লিংকে মাউস নিন।
      </td>
      <td class="voiceover-cell">
        <p>
          "ছোট ডাটাবেজে ডিপ লার্নিং মডেলের হ্যালুসিনেশন ও ওভারফিটিং এড়াতে আমরা ব্যবহার করেছি রোবাস্ট রোলিং Z-স্কোর (Median/MAD)। এটি সেন্সরের নয়েজ এড়িয়ে হঠাৎ বিষাক্ত গ্যাস বৃদ্ধির সঠিক মুহূর্তগুলো লাল অ্যানোমালি পয়েন্টারে চিহ্নিত করে।
        </p>
        <p style="margin-top: 5px;">
          আমাদের এভিডেন্স ইঞ্জিনে প্রতিটি অ্যালগরিদম ও ডাটা সরাসরি নাসার টেকনিক্যাল মেমোরান্ডাম এবং পিয়ার-রিভিউড রিসার্চ পেপারের সাথে অফিশিয়াল ডিওআই (DOI) সহ লিংক করা।"
        </p>
        <span class="cue-tag">টোন: আত্মবিশ্বাসী, প্রামাণ্য তথ্যের ওপর জোর দেওয়া।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "Robust Z-Score: Median / MAD"<br>
        "Zero AI Hallucination"<br>
        "Direct NTRS DOI Citations"<br>
        <br>
        <b>SFX:</b> অ্যানোমালি পিং অ্যালার্ট; পেপার ফ্লিপ সাউন্ড।
      </td>
    </tr>

    <!-- Scene 6 -->
    <tr>
      <td class="time-cell">
        ২:৩৫ – ৩:০০<br>
        <span class="badge badge-amber">২৫ সেকেন্ড</span>
      </td>
      <td class="action-cell">
        <b>কমপ্যারিসন অ্যানালিসিস ও সমাপ্তি</b>
        • <b>⚖️ Compare Runs</b> ট্যাবে যান।<br>
        • Run A (Test B1 Thin Film) বনাম Run B (Test M5 Thick Slab) সিলেক্ট করুন।<br>
        • ৩.২% অক্সিজেন হ্রাস ও ৫০০ পিপিএম CO এর তুলনা দেখান।<br>
        • স্ক্রল করে ব্র্যান্ড ফুটার এবং স্পেস অ্যাপস ২০২৬ ক্রেডিট দেখান।
      </td>
      <td class="voiceover-cell">
        <p>
          "সবশেষে 'Compare Runs'-এ আমরা পাতলা ফিল্ম বনাম পুরু স্ল্যাবের ভিন্ন আচরণ দেখতে পাই—পুরু এক্রিলিক স্ল্যাব দ্বিমুখী শিখায় জ্বলে ৩% এর বেশি অক্সিজেন শেষ করে ফেলে এবং ৫০০ পিপিএমের বেশি বিষাক্ত গ্যাস ছড়ায়।
        </p>
        <p style="margin-top: 5px;">
          নাসার ফ্লাইট ডাটাকে ব্যাখ্যাযোগ্য গবেষণায় রূপান্তর করে FIREWISE-X তৈরি করেছে আর্টেমিস ও ডিপ-স্পেস মিশনের জন্য নির্ভরযোগ্য অগ্নিনিরাপত্তা ব্যবস্থা। <b>Understand the Flame. Follow the Evidence.</b> ধন্যবাদ!"
        </p>
        <span class="cue-tag">টোন: উদ্দীপনামূলক, স্মরণীয় সমাপনী।</span>
      </td>
      <td class="overlay-cell">
        <b>অন-স্ক্রিন টেক্সট:</b><br>
        "Artemis & Gateway Ready"<br>
        "Understand the Flame."<br>
        "Follow the Evidence."<br>
        <br>
        <b>SFX:</b> গৌরবময় সিনেমাটিক মিউজিক ক্রেসেন্ডো ও ফেড আউট।
      </td>
    </tr>
  </tbody>
</table>

<div class="footer-note">
  FIREWISE-X — নাসা ইন্টারন্যাশনাল স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬-এর অফিশিয়াল প্রজেক্ট সাবমিশন (চ্যালেঞ্জ: Flame in Freefall)<br>
  নির্মিত হয়েছে Next.js 16, TypeScript, ক্যানভাস API এবং নাসা ফিজিক্যাল সায়েন্সেস ইনফরমেটিক্স (PSI-25, DOI: 10.60555/4qc4-de67) দিয়ে।
</div>

</body>
</html>
"""

# Write HTML files
with open("D:/Nasa FINAL/FIREWISE-X_3Min_Video_Script_EN.html", "w", encoding="utf-8") as f:
    f.write(html_en)

with open("D:/Nasa FINAL/FIREWISE-X_3Min_Video_Script_BN.html", "w", encoding="utf-8") as f:
    f.write(html_bn)

print("HTML files written successfully.")

# Convert to PDF using Microsoft Edge
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

en_cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    '--print-to-pdf=D:\\Nasa FINAL\\FIREWISE-X_3Min_Video_Script_EN.pdf',
    'file:///D:/Nasa%20FINAL/FIREWISE-X_3Min_Video_Script_EN.html'
]

bn_cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    '--print-to-pdf=D:\\Nasa FINAL\\FIREWISE-X_3Min_Video_Script_BN.pdf',
    'file:///D:/Nasa%20FINAL/FIREWISE-X_3Min_Video_Script_BN.html'
]

print("Rendering English PDF...")
subprocess.run(en_cmd, check=True)

print("Rendering Bengali PDF...")
subprocess.run(bn_cmd, check=True)

print("PDFs generated successfully!")
