"use client";

import { useState } from "react";

const DURATIONS = ["30 min", "45 min", "60 min", "75 min", "90 min", "120 min"];
const FORMATS = ["Educational / Lecture", "Product Demo", "Panel Discussion", "Fireside Chat", "Workshop / Interactive", "Case Study"];

const typeColors: Record<string, string> = {
  Talking: "bg-blue-100 text-blue-700",
  Demo: "bg-purple-100 text-purple-700",
  Poll: "bg-amber-100 text-amber-700",
  "Q&A": "bg-green-100 text-green-700",
  Break: "bg-slate-100 text-slate-600",
  CTA: "bg-red-100 text-red-700",
};

export default function WebinarOutlinePage() {
  const [form, setForm] = useState({
    topic: "", targetAudience: "", duration: "60 min",
    speaker: "", format: "Educational / Lecture",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function generate() {
    if (!form.topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.webinarTitle) setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            Webinar Planning Tool
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">AI Webinar Outline Generator</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Generate a complete webinar flow — timing, talking points, slides, polls, and CTAs.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Webinar Topic *</label>
              <input value={form.topic} onChange={(e) => update("topic", e.target.value)}
                placeholder="How to Build a $1M SaaS in 2025"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Audience</label>
              <input value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)}
                placeholder="Aspiring SaaS founders"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
              <select value={form.duration} onChange={(e) => update("duration", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                {DURATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Speaker Name</label>
              <input value={form.speaker} onChange={(e) => update("speaker", e.target.value)}
                placeholder="Jane Doe"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Format</label>
              <select value={form.format} onChange={(e) => update("format", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
                {FORMATS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading || !form.topic.trim()}
            className="w-full mt-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-4 rounded-xl transition-all text-lg shadow-lg shadow-violet-200">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Building Webinar Outline...
              </span>
            ) : "Generate Webinar Outline"}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">{result.webinarTitle}</h2>
              <p className="text-slate-500 mt-1">{result.subtitle}</p>
              <span className="inline-block mt-2 text-sm bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">{result.totalDuration}</span>
            </div>

            {result.sections && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">📋 Full Outline</h3>
                <div className="space-y-3">
                  {result.sections.map((s: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{s.startTime} – {s.endTime}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${typeColors[s.type] || "bg-slate-100 text-slate-600"}`}>{s.type}</span>
                        <span className="text-xs text-slate-400">{s.durationMinutes} min</span>
                      </div>
                      <p className="font-semibold text-slate-800 mb-1">{s.section}</p>
                      {s.slideTitle && <p className="text-xs text-slate-400 mb-2">📽️ Slide: {s.slideTitle}</p>}
                      {s.bulletPoints && s.bulletPoints.length > 0 && (
                        <ul className="space-y-1 mb-2">
                          {s.bulletPoints.map((b: string, j: number) => (
                            <li key={j} className="text-sm text-slate-600 pl-3">• {b}</li>
                          ))}
                        </ul>
                      )}
                      {s.tips && <p className="text-xs text-violet-600 italic">💡 {s.tips}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.polls && result.polls.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">🗳️ Polls</h3>
                <div className="grid gap-3">
                  {result.polls.map((p: any, i: number) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-semibold text-slate-800 mb-1">{p.question}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {p.options.map((o: string, j: number) => (
                          <span key={j} className="text-xs bg-white border border-amber-200 text-slate-600 px-2 py-0.5 rounded">{o}</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500"><span className="font-semibold">When:</span> {p.when} — <span className="font-semibold">Why:</span> {p.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.ctaMoments && result.ctaMoments.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">🎯 CTA Moments</h3>
                <div className="grid gap-3">
                  {result.ctaMoments.map((c: any, i: number) => (
                    <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-red-600 bg-red-100 px-2 py-0.5 rounded">{c.ctaType}</span>
                        <span className="text-xs text-slate-400">at {c.when}</span>
                      </div>
                      <p className="font-semibold text-slate-800 mb-1">&ldquo;{c.ctaCopy}&rdquo;</p>
                      <p className="text-sm text-slate-600">{c.offer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.qnaPrompts && result.qnaPrompts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-3">💬 Pre-Planned Q&A Prompts</h3>
                <div className="space-y-2">
                  {result.qnaPrompts.map((q: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.technicalChecklist && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-3">🔧 Technical Checklist</h3>
                <div className="space-y-2">
                  {result.technicalChecklist.map((item: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-violet-600" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
