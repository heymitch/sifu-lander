"use client";

import { useState } from "react";

const installPrompt = `Install Sifu for me.

Sifu is a local action logger for macOS that captures
my workflows and auto-generates SOPs, coaching feedback,
and automation scripts.

Read https://github.com/heymitch/sifu and install it
on my machine. Set up the menu bar widget so I can
see recording status.

After install, start a capture session so I can test it:
  sifu start

Then confirm it's running and show me the status.`;

const layers = [
  {
    name: "Capture",
    desc: "Real-time action logging. Clicks, keystrokes, app switches, screenshots. <1% CPU, ~30MB RAM. No network calls.",
    icon: "\u25C9",
  },
  {
    name: "Pattern Detection",
    desc: "Groups actions into workflows. Detects repetition, identifies session boundaries. Pure local analysis.",
    icon: "\u25CE",
  },
  {
    name: "Compiler",
    desc: "Converts raw action logs into polished markdown SOPs with annotated screenshots. LLM-powered via Claude Code.",
    icon: "\u25C8",
  },
  {
    name: "Coach",
    desc: 'Efficiency analysis. Identifies shortcuts you missed ("use Cmd+C instead of right-click > Copy") and automation candidates.',
    icon: "\u25C7",
  },
  {
    name: "Automator",
    desc: "Generates executable bash, AppleScript, or dev-browser scripts from detected patterns. One command away from zero-click.",
    icon: "\u2B23",
  },
];

const petals = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8.3) % 100}%`,
  duration: `${8 + (i % 5) * 2}s`,
  delay: `${i * 1.2}s`,
  sway: `${30 + (i % 3) * 25}px`,
  swayEnd: `${-10 + (i % 4) * 20}px`,
}));

const sopSnippet = `# SOP: Deploy to Vercel from Local Repository

| Field            | Value                                       |
|------------------|---------------------------------------------|
| **Time Estimate**| ~2 minutes                                  |
| **Apps Used**    | Ghostty (terminal), Chrome (browser)        |
| **Trigger**      | When local changes are ready for deployment  |

## Steps

### 1. Open your terminal
Switch to Ghostty and navigate to the project directory.

### 2. Review pending changes
Run \`git status\` to confirm which files have been modified.
**Why:** Prevents accidentally committing unintended files.

### 3. Stage and commit
\`\`\`bash
git add .
git commit -m 'fix: update deploy config'
\`\`\`

### 4. Deploy to production
\`\`\`bash
vercel --prod
\`\`\``;

/* ── Hardcoded SOP Preview ── */
function SopPreview() {
  return (
    <div className="font-sans text-paper/60 space-y-4 text-sm leading-relaxed">
      {/* Title */}
      <h1 className="text-lg font-bold text-paper/90 font-sans">
        SOP: Deploy to Vercel from Local Repository
      </h1>

      {/* Metadata table */}
      <div className="border border-blossom/10 rounded overflow-hidden text-xs font-mono">
        <div className="grid grid-cols-[140px_1fr] border-b border-blossom/10">
          <div className="px-3 py-2 text-paper/50 border-r border-blossom/10 bg-ink/30">
            <span className="font-bold">Time Estimate</span>
          </div>
          <div className="px-3 py-2 text-paper/60">~2 minutes</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-blossom/10">
          <div className="px-3 py-2 text-paper/50 border-r border-blossom/10 bg-ink/30">
            <span className="font-bold">Apps Used</span>
          </div>
          <div className="px-3 py-2 text-paper/60">Ghostty (terminal), Chrome (browser)</div>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <div className="px-3 py-2 text-paper/50 border-r border-blossom/10 bg-ink/30">
            <span className="font-bold">Trigger</span>
          </div>
          <div className="px-3 py-2 text-paper/60">When local changes are ready for deployment</div>
        </div>
      </div>

      {/* Steps heading */}
      <h2 className="text-base font-bold text-paper/80 pt-2">Steps</h2>

      {/* Step 1 */}
      <div>
        <h3 className="text-base font-bold text-paper/80">1. Open your terminal</h3>
        <p className="mt-1 text-paper/60">
          Switch to Ghostty and navigate to the project directory.
        </p>
      </div>

      {/* Step 2 */}
      <div>
        <h3 className="text-base font-bold text-paper/80">2. Review pending changes</h3>
        <p className="mt-1 text-paper/60">
          Run <code className="bg-ink/50 rounded px-1.5 py-0.5 font-mono text-xs text-leaf">git status</code> to
          confirm which files have been modified.
        </p>
        <p className="mt-1 text-paper/60">
          <span className="font-bold">Why:</span> Prevents accidentally committing unintended files.
        </p>
      </div>

      {/* Step 3 */}
      <div>
        <h3 className="text-base font-bold text-paper/80">3. Stage and commit</h3>
        <pre className="mt-2 bg-ink/50 rounded px-3 py-2 font-mono text-xs text-leaf overflow-x-auto">
{`git add .
git commit -m 'fix: update deploy config'`}
        </pre>
      </div>

      {/* Step 4 */}
      <div>
        <h3 className="text-base font-bold text-paper/80">4. Deploy to production</h3>
        <pre className="mt-2 bg-ink/50 rounded px-3 py-2 font-mono text-xs text-leaf overflow-x-auto">
{`vercel --prod`}
        </pre>
      </div>
    </div>
  );
}

export default function SifuPage() {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(installPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-paper relative overflow-hidden">
      {/* ── Falling Petals ── */}
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: p.left,
            "--duration": p.duration,
            "--delay": p.delay,
            "--sway": p.sway,
            "--sway-end": p.swayEnd,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Nav ── */}
      <nav className="relative z-10 max-w-[960px] mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-branch-light/60">
            heymitch.ai
          </span>
          <a
            href="https://github.com/heymitch/sifu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-branch-light/50 hover:text-blossom text-sm font-mono transition-colors"
          >
            GitHub &rarr;
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 pt-8 pb-20">
        <div className="branch-divider mb-10" />

        <div className="max-w-2xl">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-ink mb-5">
            si<span className="text-blossom-deep">fu</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-medium text-ink/80 mb-6 leading-snug">
            Work normally. Get SOPs automatically.
          </p>

          <p className="font-mono text-sm text-branch-light/70 leading-relaxed mb-8 max-w-lg">
            Free, open-source action logger for macOS. Records your workflows,
            detects patterns, generates step-by-step documentation with
            screenshots. Privacy-first&mdash;everything stays on your machine.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              "Step-by-step SOPs from real workflows",
              "Coaching feedback on inefficiencies",
              "Automation scripts for repetitive patterns",
              "Tutorial content from screen recordings",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 rounded-full bg-blossom shrink-0" />
                <span className="text-ink/70 text-base">{item}</span>
              </li>
            ))}
          </ul>

          <p className="font-mono text-xs tracking-wide uppercase text-branch-light/40">
            No screen recording apps. No manual documentation. No paid subscriptions.
          </p>
        </div>
      </section>

      {/* ── Install ── */}
      <section className="relative z-10 bg-ink">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="branch-divider branch-divider-ink mb-10" />

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-paper mb-2">
              Install once. Paste into your agent.
            </h2>
            <p className="font-mono text-sm text-paper/40 mb-8">
              Open Claude Code, Codex, or OpenClaw. Paste this. Done.
            </p>

            <div className="rounded-lg border border-blossom/10 bg-ink/80 p-6 overflow-x-auto backdrop-blur-sm relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blossom-deep/80" />
                  <span className="h-3 w-3 rounded-full bg-blossom/60" />
                  <span className="h-3 w-3 rounded-full bg-leaf/60" />
                  <span className="ml-3 font-mono text-xs text-leaf/40">
                    paste into your agent
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blossom/20 bg-blossom/5 hover:bg-blossom/15 transition-all text-paper/50 hover:text-paper/80 font-mono text-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-sm leading-relaxed text-leaf whitespace-pre-wrap">
                {installPrompt}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Claude Code", "Codex", "OpenClaw"].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full bg-paper/5 border border-paper/10 px-4 py-1.5 font-mono text-xs text-paper/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                  {name}
                </span>
              ))}
            </div>

            <p className="font-mono text-xs text-paper/25 mt-6">
              Free forever. MIT license.{" "}
              <a
                href="https://github.com/heymitch/sifu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blossom hover:underline"
              >
                Star it on GitHub.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Five Layers ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 py-16">
        <div className="branch-divider mb-10" />

        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-2">
            Five layers, one command
          </h2>
          <p className="font-mono text-branch-light/60 text-sm">
            Each layer builds on the last. Start capturing, everything else follows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {layers.map((l, i) => (
            <div
              key={l.name}
              className="group rounded-xl border border-blossom/15 bg-blossom-light/20 p-5 transition-all duration-300 hover:border-blossom/40 hover:bg-blossom-light/40 hover:shadow-lg hover:shadow-blossom/5"
            >
              <div className="text-2xl mb-3 text-blossom-deep">{l.icon}</div>
              <div className="font-mono text-[10px] tracking-wider uppercase text-branch-light/40 mb-1">
                Layer {i}
              </div>
              <h3 className="font-bold text-ink text-sm mb-2">{l.name}</h3>
              <p className="font-mono text-xs text-branch-light/60 leading-relaxed">
                {l.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample Output ── */}
      <section className="relative z-10 bg-ink">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="branch-divider branch-divider-ink mb-10" />

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-paper mb-2">
              What you get
            </h2>
            <p className="font-mono text-sm text-paper/40 mb-8">
              Real output from a real workflow. Sifu watched a Vercel deploy and
              wrote this.
            </p>

            <div className="rounded-lg border border-blossom/10 bg-[#12101e] overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-blossom/20">
                <button
                  onClick={() => setShowCode(false)}
                  className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    !showCode
                      ? "text-blossom-deep border-b-2 border-blossom-deep"
                      : "text-paper/40 hover:text-paper/60 border-b-2 border-transparent"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowCode(true)}
                  className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    showCode
                      ? "text-blossom-deep border-b-2 border-blossom-deep"
                      : "text-paper/40 hover:text-paper/60 border-b-2 border-transparent"
                  }`}
                >
                  Code
                </button>
              </div>

              {/* Content area */}
              <div className="p-6 overflow-x-auto">
                <div
                  className="transition-opacity duration-200"
                  style={{ opacity: showCode ? 0 : 1, display: showCode ? "none" : "block" }}
                >
                  <SopPreview />
                </div>
                <div
                  className="transition-opacity duration-200"
                  style={{ opacity: showCode ? 1 : 0, display: showCode ? "block" : "none" }}
                >
                  <pre className="font-mono text-xs sm:text-sm leading-relaxed text-paper/70 whitespace-pre-wrap">
                    {sopSnippet}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blossom animate-pulse" />
              <p className="font-mono text-xs text-paper/30">
                Auto-generated. Auto-opened in Sublime Text. macOS notification when done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Go Further ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 py-16">
        <div className="branch-divider mb-10" />

        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
            Coach your workflow
          </h2>
          <p className="font-mono text-sm text-branch-light/60 mb-8">
            Already installed? Ask your agent to analyze your day.
          </p>

          <div className="rounded-lg border border-blossom/10 bg-ink p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-3 w-3 rounded-full bg-blossom-deep/80" />
              <span className="h-3 w-3 rounded-full bg-blossom/60" />
              <span className="h-3 w-3 rounded-full bg-leaf/60" />
              <span className="ml-3 font-mono text-xs text-leaf/40">
                terminal
              </span>
            </div>
            <pre className="font-mono text-sm sm:text-base leading-relaxed">
              <span className="text-leaf">
                {">"} Coach my workflow from today.{"\n"}
                {"  "}What could I automate?
              </span>
            </pre>
          </div>

          <p className="font-mono text-xs text-branch-light/40 mt-4">
            Works with Claude Code, Codex, and OpenClaw. The agent reads your
            action log and finds every shortcut you missed.
          </p>
        </div>
      </section>

      {/* ── Commands Quick Reference ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 pb-16">
        <div className="branch-divider mb-10" />

        <h2 className="text-xl font-bold tracking-tight text-ink mb-6">
          Commands
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { cmd: "sifu start", desc: "Start capture daemon (background)" },
            { cmd: "sifu stop", desc: "Stop + auto-compile SOPs + coaching" },
            { cmd: "sifu status", desc: "Is it running? How many events?" },
            { cmd: "sifu compile", desc: "Generate SOPs from patterns" },
            { cmd: "sifu coach --today", desc: "Efficiency coaching report" },
            { cmd: "sifu automate", desc: "List automation candidates" },
            { cmd: "sifu patterns", desc: "Detected workflow patterns" },
            { cmd: "sifu sensitive", desc: "Panic: pause + purge last 5 min" },
          ].map((c) => (
            <div
              key={c.cmd}
              className="flex items-baseline gap-3 rounded-lg border border-blossom/10 bg-blossom-light/15 px-4 py-3"
            >
              <code className="font-mono text-sm text-blossom-deep font-medium whitespace-nowrap">
                {c.cmd}
              </code>
              <span className="font-mono text-xs text-branch-light/50">
                {c.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 bg-ink px-6 py-8 text-center">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-paper/30">
          By Mitch Harris
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a
            href="https://heymitch.ai"
            className="font-mono text-xs text-blossom/40 hover:text-blossom transition-colors"
          >
            heymitch.ai
          </a>
          <span className="text-paper/10">|</span>
          <a
            href="https://github.com/heymitch/sifu"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blossom/40 hover:text-blossom transition-colors"
          >
            github
          </a>
        </div>
      </footer>
    </main>
  );
}
