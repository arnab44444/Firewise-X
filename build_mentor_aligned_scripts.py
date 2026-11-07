# -*- coding: utf-8 -*-
"""
Generate Official Mentor-Aligned Video Scripts for FIREWISE-X:
1. Video 1: 30-Second NASA Submission Pitch (EN & BN)
2. Video 2: 240-Second Local Judging Presentation (EN & BN)
"""

import os
import subprocess

html_30s_en = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — 30-Second NASA Global Pitch Script</title>
<style>
  @page { size: A4 portrait; margin: 15mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a202c; font-size: 10pt; line-height: 1.5; margin: 0; }
  .header { background: #060b17; color: #fff; padding: 16px 20px; border-radius: 8px; border-left: 5px solid #4fd1e8; margin-bottom: 16px; }
  .header h1 { margin: 0 0 4px; font-size: 18pt; color: #fff; }
  .header .sub { color: #4fd1e8; font-weight: 700; font-size: 10.5pt; }
  .meta { display: flex; gap: 15px; font-size: 8.5pt; color: #a0aec0; margin-top: 8px; border-top: 1px solid #1c2d52; padding-top: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 9pt; }
  th { background: #0d1e3d; color: #fff; text-align: left; padding: 8px 10px; font-size: 8.5pt; text-transform: uppercase; }
  td { padding: 10px; border: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .time { font-weight: 800; color: #0d1e3d; width: 85px; }
  .action { width: 38%; color: #2d3748; background: #fbfcfe; }
  .action b { color: #007788; display: block; margin-bottom: 4px; }
  .voiceover { width: 44%; }
  .cue { font-size: 8pt; color: #718096; font-style: italic; display: block; margin-top: 4px; }
  .rule-box { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 8.8pt; color: #2b6cb0; }
</style>
</head>
<body>
<div class="header">
  <h1>🔥 FIREWISE-X — 30-Second Global Submission Pitch</h1>
  <div class="sub">NASA International Space Apps Challenge 2026 | Challenge: Flame in Freefall</div>
  <div class="meta">
    <span><b>Target Duration:</b> 28–30 Seconds</span>
    <span><b>Team:</b> Unobtanium (Mymensingh)</span>
    <span><b>Format:</b> 1080p 16:9 MP4</span>
    <span><b>Verified Run:</b> BASS-II Test B1 / Sample 147</span>
  </div>
</div>

<div class="rule-box">
  <b>🎬 Pitch Contract (Strict 30s):</b> One question, one test, one verified source. Opens with the core research question, shows the B1 observation and verified Table A.1 citation in one unbroken chain of evidence.
</div>

<table>
  <thead>
    <tr>
      <th>Timecode</th>
      <th>Visual Screen & Edit Action</th>
      <th>English Spoken Narration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">0:00 – 0:06<br><span style="color:#007788;">(6s)</span></td>
      <td class="action">
        <b>Opening Hook & Question</b>
        Show verified B1 flight frame. Display concise title text:<br>
        <i>"What happened when airflow stopped in one ISS flame test?"</i>
      </td>
      <td class="voiceover">
        "What happened when airflow stopped in one ISS flame test?"
        <span class="cue">Pacing: Clear, questioning, steady hook.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:06 – 0:12<br><span style="color:#007788;">(6s)</span></td>
      <td class="action">
        <b>Team & Project Identity</b>
        FIREWISE-X & Unobtanium title badge (2s). Smooth zoom into B1 card on the live interface.
      </td>
      <td class="voiceover">
        "We’re Team Unobtanium. FIREWISE-X links experiments to their NASA evidence."
        <span class="cue">Pacing: Confident and direct.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:12 – 0:20<br><span style="color:#007788;">(8s)</span></td>
      <td class="action">
        <b>Ground Truth Observation</b>
        B1 / sample 147 / 100 µm thin PMMA / opposed flow. Highlight NASA Table A.1 row in memorandum.
      </td>
      <td class="voiceover">
        "In BASS-II test B1, NASA reported rapid visible flame extinction after airflow stopped."
        <span class="cue">Pacing: Technical clarity, highlighting Table A.1.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:20 – 0:27<br><span style="color:#007788;">(7s)</span></td>
      <td class="action">
        <b>Traceability & Verification</b>
        Open exact report locator (NASA/TM-20210011385, p103). Show verified clip and evidence panel.
      </td>
      <td class="voiceover">
        "Open the run, check the source, and see which conditions the result applies to."
        <span class="cue">Pacing: Inviting judge verification.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:27 – 0:30<br><span style="color:#007788;">(3s)</span></td>
      <td class="action">
        <b>End Card & Attribution</b>
        End card: <b>FIREWISE-X · Unobtanium · Flame in Freefall</b>.<br>
        Source credits: NASA BASS-II PSI-25 · Table A.1.
      </td>
      <td class="voiceover">
        <i>[Voice finishes at 0:27; allow 3 seconds of silent reading for the end card and official DOI.]</i>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
"""

html_30s_bn = """<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — ৩০ সেকেন্ডের নাসা গ্লোবাল পিচ স্ক্রিপ্ট (বাংলা)</title>
<style>
  @page { size: A4 portrait; margin: 15mm; }
  body { font-family: "Nirmala UI", "Vrinda", "Kalpurush", sans-serif; color: #1a202c; font-size: 10pt; line-height: 1.5; margin: 0; }
  .header { background: #060b17; color: #fff; padding: 16px 20px; border-radius: 8px; border-left: 5px solid #f5b041; margin-bottom: 16px; }
  .header h1 { margin: 0 0 4px; font-size: 17.5pt; color: #fff; }
  .header .sub { color: #f5b041; font-weight: 700; font-size: 10.5pt; }
  .meta { display: flex; gap: 15px; font-size: 8.5pt; color: #a0aec0; margin-top: 8px; border-top: 1px solid #1c2d52; padding-top: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 9pt; }
  th { background: #0d1e3d; color: #fff; text-align: left; padding: 8px 10px; font-size: 8.5pt; text-transform: uppercase; }
  td { padding: 10px; border: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .time { font-weight: 800; color: #0d1e3d; width: 85px; }
  .action { width: 38%; color: #2d3748; background: #fbfcfe; }
  .action b { color: #b7791f; display: block; margin-bottom: 4px; }
  .voiceover { width: 44%; }
  .cue { font-size: 8pt; color: #718096; font-style: italic; display: block; margin-top: 4px; }
  .rule-box { background: #fffaf0; border-left: 4px solid #dd6b20; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 8.8pt; color: #7b341e; }
</style>
</head>
<body>
<div class="header">
  <h1>🔥 FIREWISE-X — ৩০ সেকেন্ডের গ্লোবাল সাবমিশন পিচ</h1>
  <div class="sub">নাসা ইন্টারন্যাশনাল স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬ | চ্যালেঞ্জ: Flame in Freefall</div>
  <div class="meta">
    <span><b>নির্ধারিত সময়:</b> ২৮–৩০ সেকেন্ড</span>
    <span><b>দল:</b> Unobtanium (ময়মনসিংহ)</span>
    <span><b>ফরম্যাট:</b> 1080p 16:9 MP4</span>
    <span><b>টেস্ট:</b> NASA BASS-II Test B1 / Sample 147</span>
  </div>
</div>

<div class="rule-box">
  <b>🎬 পিচ নির্দেশনা (কঠোর ৩০ সেকেন্ড):</b> একটি প্রশ্ন, একটি টেস্ট, একটি প্রমাণিত উৎস। শুরুতে মূল গবেষণার প্রশ্নটি দিন, তারপর B1 রেকর্ড এবং নাসার অফিসিয়াল টেবিল A.1 রিপোর্ট এক সুতোয় গেঁথে প্রমাণসহ উপস্থাপন করুন।
</div>

<table>
  <thead>
    <tr>
      <th>টাইমকোড</th>
      <th>স্ক্রিন অ্যাকশন ও সম্পাদনা</th>
      <th>বাংলা ভয়েসওভার ডায়লগ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">০:০০ – ০:০৬<br><span style="color:#b7791f;">(৬ সেকেন্ড)</span></td>
      <td class="action">
        <b>সূচনা প্রশ্ন ও হুক</b>
        B1 এর আসল ফ্রেম প্রদর্শন। অন-স্ক্রিন প্রশ্ন টাইটেল:<br>
        <i>"আইএসএস-এর একটি ফ্লেম টেস্টে বাতাস বন্ধ হয়ে গেলে কী ঘটেছিল?"</i>
      </td>
      <td class="voiceover">
        "আইএসএস-এর একটি ফ্লেম টেস্টে বাতাস চলাচল বন্ধ হয়ে গেলে কী ঘটেছিল?"
        <span class="cue">টোন: গভীর ও কৌতূহলোদ্দীপক।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:০৬ – ০:১২<br><span style="color:#b7791f;">(৬ সেকেন্ড)</span></td>
      <td class="action">
        <b>দল ও প্রজেক্ট পরিচয়</b>
        FIREWISE-X ও Unobtanium টাইটেল ব্যানার (২ সেকেন্ড)। এরপর B1 কার্ডে মসৃণ জুম-ইন।
      </td>
      <td class="voiceover">
        "আমরা টিম আনঅবটানিয়াম। FIREWISE-X প্রতিটি স্পেসফ্লাইট টেস্টকে নাসার তথ্যের সাথে যুক্ত করে।"
        <span class="cue">টোন: আত্মবিশ্বাসী ও স্পষ্ট।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:১২ – ০:২০<br><span style="color:#b7791f;">(৮ সেকেন্ড)</span></td>
      <td class="action">
        <b>নাসার পরীক্ষিত ফলাফল</b>
        B1 / স্যাম্পল 147 / ১০০ মাইক্রন PMMA ফিল্ম। নাসার অফিসিয়াল টেবিল A.1 রো হাইলাইট করুন।
      </td>
      <td class="voiceover">
        "BASS-II টেস্ট B1-এ নাসা রিপোর্ট করেছে—বাতাস বন্ধ হওয়ার সাথে সাথেই দৃশ্যমান আগুন নিভে গিয়েছিল।"
        <span class="cue">টোন: বৈজ্ঞানিক নির্ভুলতা।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:২০ – ০:২৭<br><span style="color:#b7791f;">(৭ সেকেন্ড)</span></td>
      <td class="action">
        <b>রিপোর্ট প্রমাণ ও ভেরিফিকেশন</b>
        নাসার রিপোর্ট পেজ (NASA/TM-20210011385, পৃ. ১০৩) খুলুন। ভেরিফাইড ক্লিপ ও এভিডেন্স প্যানেল দেখান।
      </td>
      <td class="voiceover">
        "টেস্টটি ওপেন করে মূল উৎস যাচাই করুন, এবং দেখুন কোন পরিস্থিতিতে এই ফলাফল কার্যকর।"
        <span class="cue">টোন: বিচারকদের যাচাইয়ের আহ্বান।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:২৭ – ০:৩০<br><span style="color:#b7791f;">(৩ সেকেন্ড)</span></td>
      <td class="action">
        <b>এন্ড কার্ড ও সোর্স ক্রেডিট</b>
        এন্ড কার্ড: <b>FIREWISE-X · Unobtanium · Flame in Freefall</b>।<br>
        সোর্স ক্রেডিট: NASA BASS-II PSI-25 · Table A.1।
      </td>
      <td class="voiceover">
        <i>[০:২৭ সেকেন্ডে কথা শেষ হবে; শেষ ৩ সেকেন্ড বিচারকদের এন্ড কার্ড পড়ার নীরব সময় দিন।]</i>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
"""

html_240s_en = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — 240-Second Local Judging Presentation Script</title>
<style>
  @page { size: A4 portrait; margin: 14mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a202c; font-size: 9.5pt; line-height: 1.48; margin: 0; }
  .header { background: #060b17; color: #fff; padding: 14px 18px; border-radius: 8px; border-left: 5px solid #4fd1e8; margin-bottom: 12px; }
  .header h1 { margin: 0 0 4px; font-size: 16.5pt; color: #fff; }
  .header .sub { color: #4fd1e8; font-weight: 700; font-size: 10pt; }
  .meta { display: flex; gap: 15px; font-size: 8.5pt; color: #a0aec0; margin-top: 6px; border-top: 1px solid #1c2d52; padding-top: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8.8pt; }
  th { background: #0d1e3d; color: #fff; text-align: left; padding: 7px 9px; font-size: 8pt; text-transform: uppercase; }
  td { padding: 9px; border: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .time { font-weight: 800; color: #0d1e3d; width: 85px; }
  .action { width: 36%; color: #2d3748; background: #fbfcfe; }
  .action b { color: #007788; display: block; margin-bottom: 3px; }
  .voiceover { width: 46%; }
  .cue { font-size: 7.8pt; color: #718096; font-style: italic; display: block; margin-top: 3px; }
  .rule-box { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px; font-size: 8.5pt; color: #2b6cb0; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
<div class="header">
  <h1>🔥 FIREWISE-X — 240-Second Local Judging Presentation</h1>
  <div class="sub">Mymensingh Local Judging ("240 Seconds of Glory") | Flame in Freefall</div>
  <div class="meta">
    <span><b>Target Duration:</b> 240 Seconds (4:00 Minutes)</span>
    <span><b>Submission Slot:</b> 13 Nov 18:30–19:00 (Google Drive Upload)</span>
    <span><b>Team:</b> Unobtanium, Mymensingh</span>
    <span><b>Live Codebase:</b> http://localhost:3000</span>
  </div>
</div>

<div class="rule-box">
  <b>🎬 Presentation Blueprint (Exact 4:00 Minutes):</b> Demonstrate how FIREWISE-X audits real NASA combustion science. Includes clicks, reading pauses, exact table locators, condition contrasts, and honest scientific abstention.
</div>

<table>
  <thead>
    <tr>
      <th>Timecode</th>
      <th>Visual Screen Action (What to Click & Show)</th>
      <th>English Narration Draft (Spoken Voiceover)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">0:00 – 0:20<br><span style="color:#007788;">(20s)</span></td>
      <td class="action">
        <b>Team, Challenge & B1 Research Question</b>
        Show FIREWISE-X Home page banner, team name Unobtanium, Mymensingh. Pose B1 research question clearly.
      </td>
      <td class="voiceover">
        "We’re Unobtanium from Mymensingh. We built FIREWISE-X for Flame in Freefall. What happened to a thin PMMA film flame when airflow stopped in NASA’s BASS-II experiment?"
        <span class="cue">Pacing: Energetic, formal, scientific introduction.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:20 – 0:55<br><span style="color:#007788;">(35s)</span></td>
      <td class="action">
        <b>PSI-25 -> B1 Metadata & Table A.1 Link</b>
        Navigate to Test B1 (sample 147). Show fuel (100 µm PMMA), geometry, opposed flow. Click link opening NASA/TM Table A.1.
      </td>
      <td class="voiceover">
        "We start with test B1. The experiment used a thin PMMA film and opposed flow. This link opens Table A.1 in the NASA memorandum so a reviewer can verify the original observation."
        <span class="cue">Pacing: Steady, demonstrating clickable provenance.</span>
      </td>
    </tr>
    <tr>
      <td class="time">0:55 – 1:35<br><span style="color:#007788;">(40s)</span></td>
      <td class="action">
        <b>Report Row, Verified Clip & HUD Mask</b>
        Open Flame Studio. Play verified B1 clip. Highlight active Chamber HUD Mask (excluding OSD clock). Show extinction event.
      </td>
      <td class="voiceover">
        "The report describes flame spread followed by rapid visible flame extinction after airflow stopped. The video gives the visual context. Where we have a verified event label, we show the frame and its timing basis."
        <span class="cue">Pacing: Measured, showing video sync and HUD filtering.</span>
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<table style="margin-top: 15px;">
  <thead>
    <tr>
      <th>Timecode</th>
      <th>Visual Screen Action (What to Click & Show)</th>
      <th>English Narration Draft (Spoken Voiceover)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">1:35 – 2:15<br><span style="color:#007788;">(40s)</span></td>
      <td class="action">
        <b>Ranked Answer & Condition Contrast</b>
        In 129 Tests Explorer, show B1 direct match. Compare against a related run with different thickness or flow. Highlight matching fields.
      </td>
      <td class="voiceover">
        "For this question, the direct B1 record ranks first. The related run differs in material or flow direction. Its evidence adds context. You can see why it appears here and open its original source."
        <span class="cue">Pacing: Demonstrating condition-aware ranking.</span>
      </td>
    </tr>
    <tr>
      <td class="time">2:15 – 2:55<br><span style="color:#007788;">(40s)</span></td>
      <td class="action">
        <b>O13a Endpoints (Glovebox) & Lunar Abstention</b>
        In Mission Control, select O13a. Point out verified 389 → 950 ppm glovebox endpoints. Search 'lunar' in Evidence Engine: show Abstention card!
      </td>
      <td class="voiceover">
        "O13a recorded 389 and 950 parts per million before and after the test in the glovebox. A timed spike or crew exposure would require other measurements. For a lunar partial-gravity question, the dashboard explains the evidence gap."
        <span class="cue">Pacing: Emphasizing rigorous scientific honesty.</span>
      </td>
    </tr>
    <tr>
      <td class="time">2:55 – 3:35<br><span style="color:#007788;">(40s)</span></td>
      <td class="action">
        <b>Pinned Build, Source Version & Truthful Export</b>
        Show PSI-25 DOI, exact 129 row manifest, and click 'Export Run CSV' displaying provenance headers and interpolation labels.
      </td>
      <td class="voiceover">
        "Open the same build and use the query on screen. The evidence package includes the dataset version, source locator and evaluation cases. The results panel shows the observed counts, including cases where the system withheld an answer."
        <span class="cue">Pacing: Confident technical closure.</span>
      </td>
    </tr>
    <tr>
      <td class="time">3:35 – 4:00<br><span style="color:#007788;">(25s)</span></td>
      <td class="action">
        <b>Live Demo Verification & Final End Card</b>
        Show live URL (http://localhost:3000), source citations, team members. Hold final end card for 5–7 seconds.
      </td>
      <td class="voiceover">
        "FIREWISE-X gives reviewers a path from a fire-safety question to a NASA observation and its conditions. Try the B1 query and verify the same result in the report. Thank you."
        <span class="cue">Pacing: Strong conclusion; hold end card silently.</span>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
"""

html_240s_bn = """<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>FIREWISE-X — ২৪০ সেকেন্ডের লোকাল জাজিং প্রেজেন্টেশন স্ক্রিপ্ট (বাংলা)</title>
<style>
  @page { size: A4 portrait; margin: 14mm; }
  body { font-family: "Nirmala UI", "Vrinda", "Kalpurush", sans-serif; color: #1a202c; font-size: 9.5pt; line-height: 1.48; margin: 0; }
  .header { background: #060b17; color: #fff; padding: 14px 18px; border-radius: 8px; border-left: 5px solid #f5b041; margin-bottom: 12px; }
  .header h1 { margin: 0 0 4px; font-size: 16.5pt; color: #fff; }
  .header .sub { color: #f5b041; font-weight: 700; font-size: 10pt; }
  .meta { display: flex; gap: 15px; font-size: 8.5pt; color: #a0aec0; margin-top: 6px; border-top: 1px solid #1c2d52; padding-top: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8.8pt; }
  th { background: #0d1e3d; color: #fff; text-align: left; padding: 7px 9px; font-size: 8pt; text-transform: uppercase; }
  td { padding: 9px; border: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .time { font-weight: 800; color: #0d1e3d; width: 85px; }
  .action { width: 36%; color: #2d3748; background: #fbfcfe; }
  .action b { color: #b7791f; display: block; margin-bottom: 3px; }
  .voiceover { width: 46%; }
  .cue { font-size: 7.8pt; color: #718096; font-style: italic; display: block; margin-top: 3px; }
  .rule-box { background: #fffaf0; border-left: 4px solid #dd6b20; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px; font-size: 8.5pt; color: #7b341e; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
<div class="header">
  <h1>🔥 FIREWISE-X — ২৪০ সেকেন্ডের লোকাল জাজিং প্রেজেন্টেশন</h1>
  <div class="sub">ময়মনসিংহ লোকাল জাজিং ("240 Seconds of Glory") | Flame in Freefall</div>
  <div class="meta">
    <span><b>নির্ধারিত সময়:</b> ২৪০ সেকেন্ড (৪:০০ মিনিট)</span>
    <span><b>আপলোড স্লট:</b> ১৩ নভেম্বর ১৮:৩০–১৯:০০ (গুগল ড্রাইভ ফোল্ডার)</span>
    <span><b>দল:</b> Unobtanium, Mymensingh</span>
    <span><b>লাইভ ডেমো:</b> http://localhost:3000</span>
  </div>
</div>

<div class="rule-box">
  <b>🎬 প্রেজেন্টেশন ব্লুপ্রিন্ট (কঠোর ৪ মিনিট):</b> নাসার আসল বৈজ্ঞানিক তথ্য কীভাবে FIREWISE-X অডিট করে তা প্রমাণসহ প্রদর্শন করুন। স্ক্রিনে প্রতিটি ক্লিক, পড়ার বিরতি, সঠিক টেবিল লোকেটর এবং বৈজ্ঞানিক সততার সাথে অসঙ্গতি প্রকাশের দৃশ্য সংযুক্ত।
</div>

<table>
  <thead>
    <tr>
      <th>টাইমকোড</th>
      <th>স্ক্রিন অ্যাকশন (যা ক্লিক করে দেখাবেন)</th>
      <th>বাংলা ভয়েসওভার ডায়লগ (যা মুখে বলবেন)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">০:০০ – ০:২০<br><span style="color:#b7791f;">(২০ সেকেন্ড)</span></td>
      <td class="action">
        <b>দল, চ্যালেঞ্জ ও B1 রিসার্চ প্রশ্ন</b>
        FIREWISE-X হোম ব্যানার, দল আনঅবটানিয়াম, ময়মনসিংহ। B1 এর মূল গবেষণার প্রশ্নটি স্ক্রিনে আনুন।
      </td>
      <td class="voiceover">
        "আমরা ময়মনসিংহের টিম আনঅবটানিয়াম। 'Flame in Freefall' চ্যালেঞ্জের জন্য আমরা তৈরি করেছি FIREWISE-X। নাসার BASS-II পরীক্ষায় একটি পাতলা PMMA ফিল্মের আগুন বাতাস বন্ধ হলে কেমন আচরণ করেছিল?"
        <span class="cue">টোন: আনুষ্ঠানিক, আত্মবিশ্বাসী বৈজ্ঞানিক সূচনা।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:২০ – ০:৫৫<br><span style="color:#b7791f;">(৩৫ সেকেন্ড)</span></td>
      <td class="action">
        <b>B1 মেটাডাটা ও নাসা টেবিল A.1 লিংক</b>
        টেস্ট B1 (স্যাম্পল 147) ওপেন করুন। ১০০ মাইক্রন ফিল্ম ও অপোজড ফ্লো দেখান। নাসা টেবিল A.1 লিংকটি ওপেন করুন।
      </td>
      <td class="voiceover">
        "আমরা টেস্ট B1 দিয়ে শুরু করছি। এই পরীক্ষায় একটি পাতলা PMMA ফিল্ম এবং বিপরীতমুখী বাতাস ব্যবহার করা হয়। এই লিংকটি নাসার মেমোরান্ডামের টেবিল A.1 খুলে দেয়, যাতে একজন বিচারক নিজেই মূল পর্যবেক্ষণ যাচাই করতে পারেন।"
        <span class="cue">টোন: প্রামাণ্য তথ্যের ওপর জোর দেওয়া।</span>
      </td>
    </tr>
    <tr>
      <td class="time">০:৫৫ – ১:৩৫<br><span style="color:#b7791f;">(৪০ সেকেন্ড)</span></td>
      <td class="action">
        <b>নাসা রিপোর্ট ও ভেরিফাইড ক্লিপ (HUD Mask)</b>
        ফ্লেম স্টুডিওতে যান। আসল B1 ভিডিও প্লে করুন। ওএসডি ঘড়ি বাদ দিয়ে সক্রিয় HUD Mask ও এক্সটিংকশন ফ্রেম দেখান।
      </td>
      <td class="voiceover">
        "রিপোর্টে বলা হয়েছে—শিখা বিস্তারের পর বাতাস বন্ধ করার সাথে সাথেই দ্রুত দৃশ্যমান আগুন নিভে গিয়েছিল। ভিডিওটি আমাদের চাক্ষুষ প্রমাণ দেয়। আমাদের যাচাইকৃত ইভেন্ট লেবেলে ফ্রেম এবং তার সঠিক টাইমিং দেখানো হয়েছে।"
        <span class="cue">টোন: ভিডিও অ্যানালিসিস ও HUD ফিল্টারিং স্পষ্ট করা।</span>
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<table style="margin-top: 15px;">
  <thead>
    <tr>
      <th>টাইমকোড</th>
      <th>স্ক্রিন অ্যাকশন (যা ক্লিক করে দেখাবেন)</th>
      <th>বাংলা ভয়েসওভার ডায়লগ (যা মুখে বলবেন)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="time">১:৩৫ – ২:১৫<br><span style="color:#b7791f;">(৪০ সেকেন্ড)</span></td>
      <td class="action">
        <b>র‍্যাংকড অ্যানসার ও কন্ডিশন তুলনা</b>
        ১২৯ টেস্ট এক্সপ্লোরারে B1 সার্চ করে ১ম স্থানে দেখান। ভিন্ন পুরুত্ব বা ফ্লো ডিরেকশনের আরেকটি টেস্টের সাথে তুলনা করুন।
      </td>
      <td class="voiceover">
        "এই প্রশ্নের জন্য সরাসরি B1 রেকর্ডটি শীর্ষে র‍্যাংক করে। সম্পর্কিত অন্য রানটির উপাদান বা বাতাসের দিক আলাদা। এর প্রমাণ প্রেক্ষাপট তৈরি করে। বিচারক দেখতে পারেন এটি কেন এখানে এসেছে এবং তার মূল উৎস খুলতে পারেন।"
        <span class="cue">টোন: তুলনামূলক বিশ্লেষণের গভীরতা প্রদর্শন।</span>
      </td>
    </tr>
    <tr>
      <td class="time">২:১৫ – ২:৫৫<br><span style="color:#b7791f;">(৪০ সেকেন্ড)</span></td>
      <td class="action">
        <b>O13a গ্লাভবক্স এন্ডপয়েন্ট ও লুনার অ্যাবস্টেনশন</b>
        মিশন কন্ট্রোলে O13a-র ৩৮৯ → ৯৫০ ppm গ্লাভবক্স এন্ডপয়েন্ট দেখান। এভিডেন্স ইঞ্জিনে 'lunar' লিখে সৎ অ্যাবস্টেনশন কার্ড দেখান!
      </td>
      <td class="voiceover">
        "টেস্ট O13a-তে গ্লাভবক্সের ভেতরে পরীক্ষার আগে ও পরে ৩৮৯ এবং ৯৫০ পিপিএম রেকর্ড করা হয়েছিল। এটি কেবিন এক্সপোজার নয়। আর চাঁদের আংশিক মাধ্যাকর্ষণ নিয়ে প্রশ্নের ক্ষেত্রে আমাদের ড্যাশবোর্ড সততার সাথে ডাটার সীমাবদ্ধতা ব্যাখ্যা করে।"
        <span class="cue">টোন: কঠোর বৈজ্ঞানিক সততা ও ডিসক্লোজার প্রকাশ।</span>
      </td>
    </tr>
    <tr>
      <td class="time">২:৫৫ – ৩:৩৫<br><span style="color:#b7791f;">(৪০ সেকেন্ড)</span></td>
      <td class="action">
        <b>সোর্স ভার্সন ও ট্রুথফুল CSV এক্সপোর্ট</b>
        PSI-25 DOI, ১২৯ রোর ম্যানিফেস্ট দেখান। 'Export Run CSV' ক্লিক করে প্রোভেন্যান্স হেডার ও এন্ডপয়েন্ট দেখান।
      </td>
      <td class="voiceover">
        "বিচারকরা একই বিল্ড খুলে স্ক্রিনের কুয়েরিটি পরীক্ষা করতে পারেন। আমাদের এভিডেন্স প্যাকেজে ডেটাসেট ভার্সন, সোর্স লোকেটর এবং মূল্যায়ন টেস্ট কেস অন্তর্ভুক্ত রয়েছে। ফলাফল প্যানেলে সিস্টেম যেখানে উত্তর স্থগিত রেখেছে তাও স্পষ্টভাবে দৃশ্যমান।"
        <span class="cue">টোন: প্রযুক্তিগত সততা ও স্বচ্ছতা।</span>
      </td>
    </tr>
    <tr>
      <td class="time">৩:৩৫ – ৪:০০<br><span style="color:#b7791f;">(২৫ সেকেন্ড)</span></td>
      <td class="action">
        <b>লাইভ ডেমো ভেরিফিকেশন ও সমাপনী এন্ড কার্ড</b>
        লাইভ ইউআরএল, রেফারেন্স লিংক ও টিম ক্রেডিটস দেখান। শেষ ৫–৭ সেকেন্ড নীরব এন্ড কার্ড রাখুন।
      </td>
      <td class="voiceover">
        "FIREWISE-X বিচারকদের অগ্নিনিরাপত্তা প্রশ্ন থেকে নাসার আসল পর্যবেক্ষণ ও তার শর্ত পর্যন্ত একটি অটুট পথ তৈরি করে দেয়। B1 কুয়েরিটি ট্রাই করুন এবং নাসার রিপোর্টে নিজেই ফলাফল যাচাই করুন। ধন্যবাদ।"
        <span class="cue">টোন: দৃঢ় ও মার্জিত সমাপনী।</span>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
"""

# Write the HTML files
files = [
    ("D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_EN.html", html_30s_en),
    ("D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_BN.html", html_30s_bn),
    ("D:/Nasa FINAL/FIREWISE-X_240s_Local_Judging_EN.html", html_240s_en),
    ("D:/Nasa FINAL/FIREWISE-X_240s_Local_Judging_BN.html", html_240s_bn),
]

for path, content in files:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("HTML script files written successfully.")

# Convert to PDF via Microsoft Edge
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

conversions = [
    ("D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_EN.html", "D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_Script_EN.pdf"),
    ("D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_BN.html", "D:/Nasa FINAL/FIREWISE-X_30s_Global_Pitch_Script_BN.pdf"),
    ("D:/Nasa FINAL/FIREWISE-X_240s_Local_Judging_EN.html", "D:/Nasa FINAL/FIREWISE-X_240s_Local_Presentation_Script_EN.pdf"),
    ("D:/Nasa FINAL/FIREWISE-X_240s_Local_Judging_BN.html", "D:/Nasa FINAL/FIREWISE-X_240s_Local_Presentation_Script_BN.pdf"),
]

for src, dest in conversions:
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={dest}",
        f"file:///{src}"
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated: {dest}")

print("All 4 Mentor-Aligned Video Script PDFs generated successfully!")
