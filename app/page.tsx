"use client";

import { useState } from "react";

const installPrompt = `Install Sifu for me.

Sifu is a native macOS action logger that captures
my workflows and produces clean tutorials for humans
and structured workflow specs for agents.

Read https://github.com/heymitch/sifu and install it:
1. Clone the repo and pip install the Python CLI
2. Build the native SifuBar capture app from extras/SifuBar
3. Move SifuBar.app to /Applications
4. Grant Accessibility and Screen Recording permissions
5. Start a capture session: sifu start

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
  {
    name: "Classifier",
    desc: "Discovers your automation toolkit, then classifies each step into the fastest execution method\u2014API, CLI, browser, or macro.",
    icon: "\u2B21",
  },
];

const classifierSteps = [
  { id: 1, original: "Open terminal, cd to project", method: "eliminate", label: "SKIP" },
  { id: 2, original: "git status", method: "cli", label: "CLI" },
  { id: 3, original: "git add . && git commit", method: "cli", label: "CLI" },
  { id: 4, original: "vercel --prod", method: "api", label: "API" },
  { id: 5, original: "Wait for build to finish", method: "wait_for", label: "WAIT" },
  { id: 6, original: "Switch to Chrome", method: "eliminate", label: "SKIP" },
  { id: 7, original: "Open Vercel dashboard", method: "eliminate", label: "SKIP" },
  { id: 8, original: "Click into latest deployment", method: "eliminate", label: "SKIP" },
  { id: 9, original: "Verify production URL is live", method: "api", label: "API" },
];

const methodColors: Record<string, string> = {
  eliminate: "bg-paper/10 text-paper/30 line-through",
  cli: "bg-leaf/20 text-leaf",
  api: "bg-blossom/20 text-blossom",
  wait_for: "bg-[#FFB86C]/20 text-[#FFB86C]",
  manual: "bg-paper/20 text-paper/60",
};

const labelColors: Record<string, string> = {
  SKIP: "bg-paper/10 text-paper/30",
  CLI: "bg-leaf/20 text-leaf border-leaf/30",
  API: "bg-blossom/20 text-blossom border-blossom/30",
  WAIT: "bg-[#FFB86C]/20 text-[#FFB86C] border-[#FFB86C]/30",
};

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
  const [outputTab, setOutputTab] = useState<"preview" | "code" | "agent">("preview");

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

        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-ink mb-5">
              si<span className="text-blossom-deep">fu</span>
            </h1>

            <p className="text-2xl sm:text-3xl font-medium text-ink/80 mb-6 leading-snug">
              Train your agent.
            </p>

            <p className="font-mono text-sm text-branch-light/70 leading-relaxed mb-8 max-w-lg">
              Work normally. Sifu watches, then produces clean tutorials
              for humans and structured workflow specs for agents.
              Same recording, two outputs. Open source, privacy-first,
              everything stays on your machine.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "SOPs and tutorials from real workflows\u2014no manual documentation",
                "Classified workflow specs your agent can execute",
                "Coaching on shortcuts and inefficiencies",
                "Saves tokens vs computer use and browser automation tools",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 block h-2 w-2 rounded-full bg-blossom shrink-0" />
                  <span className="text-ink/70 text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blossom-light/30 border border-blossom/15 px-3 py-1 font-mono text-xs text-ink/50">SOPs for humans</span>
              <span className="inline-flex items-center rounded-full bg-blossom-light/30 border border-blossom/15 px-3 py-1 font-mono text-xs text-ink/50">Specs for agents</span>
              <span className="inline-flex items-center rounded-full bg-blossom-light/30 border border-blossom/15 px-3 py-1 font-mono text-xs text-ink/50">Zero manual docs</span>
            </div>
          </div>

          {/* Hero video */}
          <div className="hidden lg:block w-[280px] shrink-0 rounded-xl overflow-hidden border border-blossom/10 shadow-lg shadow-blossom/5">
            <video
              src="/hero-loop.mp4"
              autoPlay
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── Install ── */}
      <section className="relative z-10 bg-ink">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="branch-divider branch-divider-ink mb-10" />

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-paper mb-2">
              One prompt. Your agent handles the rest.
            </h2>
            <p className="font-mono text-sm text-paper/40 mb-8">
              Paste this into Claude Code, Codex, or OpenClaw. Your agent
              clones the repo, builds the native app, installs the CLI, and starts capturing.
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

      {/* ── Architecture ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 py-16">
        <div className="branch-divider mb-10" />

        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-2">
            Native app + CLI. Six layers.
          </h2>
          <p className="font-mono text-branch-light/60 text-sm">
            SifuBar.app captures natively with macOS permissions. The CLI analyzes, compiles, and classifies.
          </p>
        </div>

        {/* Native app label */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-blossom-deep/70">
            <span className="h-1.5 w-1.5 rounded-full bg-blossom-deep/70" />
            Native macOS app (SifuBar.app)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {layers.slice(0, 2).map((l, i) => (
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

        {/* CLI label */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-leaf/70">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf/70" />
            Python CLI (agent-powered analysis)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {layers.slice(2).map((l, i) => (
            <div
              key={l.name}
              className="group rounded-xl border border-blossom/15 bg-blossom-light/20 p-5 transition-all duration-300 hover:border-blossom/40 hover:bg-blossom-light/40 hover:shadow-lg hover:shadow-blossom/5"
            >
              <div className="text-2xl mb-3 text-blossom-deep">{l.icon}</div>
              <div className="font-mono text-[10px] tracking-wider uppercase text-branch-light/40 mb-1">
                Layer {i + 2}
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
              Two outputs from one recording
            </h2>
            <p className="font-mono text-sm text-paper/40 mb-8">
              Sifu watched a Vercel deploy. It produced a tutorial a human can follow
              and a classified spec an agent can execute. Same workflow, both audiences.
            </p>

            <div className="rounded-lg border border-blossom/10 bg-[#12101e] overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-blossom/20">
                {([
                  { id: "preview" as const, label: "For Humans" },
                  { id: "agent" as const, label: "For Agents" },
                  { id: "code" as const, label: "Raw Markdown" },
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOutputTab(tab.id)}
                    className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                      outputTab === tab.id
                        ? "text-blossom-deep border-b-2 border-blossom-deep"
                        : "text-paper/40 hover:text-paper/60 border-b-2 border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div className="p-6 overflow-x-auto">
                {outputTab === "preview" && <SopPreview />}
                {outputTab === "code" && (
                  <pre className="font-mono text-xs sm:text-sm leading-relaxed text-paper/70 whitespace-pre-wrap">
                    {sopSnippet}
                  </pre>
                )}
                {outputTab === "agent" && (
                  <div className="font-mono text-xs sm:text-sm leading-relaxed text-paper/70 space-y-2">
                    <div className="text-paper/40 text-xs mb-4">
                      # Classified workflow spec &mdash; machine-readable, agent-executable
                    </div>
                    {classifierSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                          step.method === "eliminate" ? "opacity-40" : ""
                        }`}
                      >
                        <span className={`shrink-0 w-12 text-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${labelColors[step.label]}`}>
                          {step.label}
                        </span>
                        <span className={`flex-1 ${step.method === "eliminate" ? "line-through text-paper/30" : "text-paper/70"}`}>
                          {step.original}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-blossom/20 mt-4 pt-3 flex items-center gap-4">
                      <span className="text-paper/30">Human: <span className="text-paper/60">9 steps</span></span>
                      <span className="text-paper/20">&rarr;</span>
                      <span className="text-paper/30">Agent: <span className="text-leaf">5 steps</span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blossom animate-pulse" />
              <p className="font-mono text-xs text-paper/30">
                Same recording. Tutorial for your team, spec for your agent. Both auto-generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What to say ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 py-16">
        <div className="branch-divider mb-10" />

        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
            What to say to your agent
          </h2>
          <p className="font-mono text-sm text-branch-light/60 mb-8">
            Sifu is agent-native. You talk to your agent, it talks to Sifu.
          </p>

          <div className="space-y-4">
            {[
              {
                prompt: "Compile my workflows from today into SOPs.",
                desc: "Tutorials for your team",
              },
              {
                prompt: "Classify my workflows. What can be automated?",
                desc: "Specs for your agent",
              },
              {
                prompt: "Coach my workflow. What shortcuts am I missing?",
                desc: "Efficiency feedback",
              },
              {
                prompt: "What tools do I have that Sifu can classify against?",
                desc: "Capability discovery",
              },
            ].map((example) => (
              <div
                key={example.prompt}
                className="rounded-lg border border-blossom/10 bg-ink px-5 py-4 flex items-start gap-4"
              >
                <span className="text-leaf font-mono text-sm mt-0.5 shrink-0">&gt;</span>
                <div className="flex-1">
                  <pre className="font-mono text-sm text-leaf whitespace-pre-wrap">{example.prompt}</pre>
                  <p className="font-mono text-xs text-paper/30 mt-1">{example.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-branch-light/40 mt-6">
            Works with Claude Code, Codex, and OpenClaw. The agent reads your
            action log and does the rest.
          </p>
        </div>
      </section>

      {/* ── Classifier ── */}
      <section className="relative z-10 bg-ink">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="branch-divider branch-divider-ink mb-10" />

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-paper mb-2">
              Classify &mdash; find the fastest path
            </h2>
            <p className="font-mono text-sm text-paper/40 mb-3">
              The classifier scans your recorded workflow, discovers what tools you have,
              and assigns each step the most efficient execution method.
            </p>
            <p className="font-mono text-sm text-paper/40 mb-8">
              Human overhead gets eliminated. API calls replace browser clicks.
              What took 8 steps takes 4.
            </p>

            {/* Before/After comparison */}
            <div className="rounded-lg border border-blossom/10 bg-[#12101e] overflow-hidden">
              <div className="flex border-b border-blossom/20">
                <div className="px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-blossom-deep border-b-2 border-blossom-deep">
                  Workflow Classification
                </div>
              </div>

              <div className="p-5 space-y-2">
                {classifierSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 font-mono text-xs transition-all ${
                      step.method === "eliminate" ? "opacity-40" : ""
                    }`}
                  >
                    <span className={`shrink-0 w-12 text-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${labelColors[step.label]}`}>
                      {step.label}
                    </span>
                    <span className={`flex-1 ${step.method === "eliminate" ? "line-through text-paper/30" : "text-paper/70"}`}>
                      {step.original}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats bar */}
              <div className="border-t border-blossom/20 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-paper/30">Human: <span className="text-paper/60">9 steps, ~2 min</span></span>
                  <span className="text-paper/20">&rarr;</span>
                  <span className="font-mono text-xs text-paper/30">Compiled: <span className="text-leaf">5 steps, ~35s</span></span>
                </div>
                <span className="font-mono text-[10px] text-blossom/50 uppercase tracking-wider">4 steps eliminated</span>
              </div>
            </div>

            {/* Capability extensions */}
            <div className="mt-8 rounded-lg border border-blossom/10 bg-ink/80 p-5">
              <h3 className="font-bold text-paper/80 text-sm mb-3">Teach it your tools</h3>
              <p className="font-mono text-xs text-paper/40 mb-4">
                Drop YAML files in <code className="bg-[#12101e] rounded px-1.5 py-0.5 text-leaf">~/.sifu/capabilities.d/</code> to
                extend the classifier with your specific automation toolkit.
              </p>
              <pre className="font-mono text-xs leading-relaxed text-leaf/80 bg-[#12101e] rounded p-4 overflow-x-auto">
{`# ~/.sifu/capabilities.d/slack.yaml
name: slack
type: mcp
matches:
  - app: "Slack"
  - url_contains: "slack.com"
actions:
  - send_message
  - read_channel`}
              </pre>
              <p className="font-mono text-xs text-paper/30 mt-3">
                Re-run classification after adding capabilities. The diff shows exactly what improved.
              </p>
            </div>
          </div>
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
            { cmd: "sifu classify", desc: "Classify steps into best methods" },
            { cmd: "sifu classify --discover", desc: "Show available capabilities" },
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

      {/* ── Mission ── */}
      <section className="relative z-10 max-w-[960px] mx-auto px-6 py-16">
        <div className="branch-divider mb-10" />

        <div className="max-w-xl mx-auto text-center">
          <p className="text-xl sm:text-2xl font-medium text-ink/80 leading-relaxed mb-4">
            Building tools agents want.
          </p>
          <p className="font-mono text-sm text-branch-light/60 leading-relaxed">
            Sifu exists so agents can understand human workflows.
            Open source, agent-native, built for the people building
            the future of work.
          </p>
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
