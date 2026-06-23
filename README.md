# ✦ ATS Resume Optimizer

> **AI-powered resume tailoring with multi-chat session management, editable .docx output, and LaTeX generation for 4 real Overleaf templates.**

---

## 🚀 What It Does

Upload your resume, paste a job description, and get back:

- 🎯 An **ATS-optimized resume** with keywords woven in naturally — nothing removed, only enhanced
- 📝 An **editable .docx** you can click into and type directly in the browser, then download
- λ A **compilable .tex file** styled to your chosen Overleaf template
- 💬 **Multi-chat sessions** — one chat per job application, just like Claude or ChatGPT

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 Multi-chat sidebar | New Chat button, grouped by Today / Yesterday / Last 7 days, rename & delete |
| 📂 Resume upload | PDF or DOCX — drag & drop or click to browse |
| 🎯 ATS optimization | Claude adds job keywords into existing bullets, never fabricates experience |
| 🔵 Keyword highlighting | Added terms shown in **bold blue** — visual diff of what changed |
| ✏️ Live editor | Click any text in the Word-like preview, type, then save as `.docx` |
| λ LaTeX output | 4 Overleaf templates with exact preamble reproduction |
| ⎘ Copy LaTeX | Clipboard API with manual-select modal fallback |
| ⚠️ LaTeX health check | Detects unbalanced `\begin`/`\end` before you open Overleaf |
| 💾 Session persistence | Chats survive page refresh via artifact storage |

---

## 🖥️ Using the Artifact (Claude.ai)

```
1. Click  ＋ New Chat  in the sidebar
2. Upload your resume (PDF or DOCX)
3. Pick a LaTeX template from the 4 cards
4. Paste a job description → press Send ↑  (or Ctrl+Enter)
5. When the result appears:
      ✏️ Edit & Download  →  live editor, save as .docx
      ⬇ .docx            →  instant download
      ⬇ .tex             →  LaTeX source file
      ⎘ Copy LaTeX        →  copy to clipboard
      ↗ Overleaf          →  open original template
```

---

## ⚡ Deploy to Vercel

### Step 1 — Scaffold the project

```bash
npx create-next-app@latest ats-optimizer --typescript --app
cd ats-optimizer
npm install @anthropic-ai/sdk jszip mammoth
```

### Step 2 — Create the API route

```typescript
// app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 7000,
    system,
    messages,
  });
  return NextResponse.json(response);
}
```

### Step 3 — Update the fetch call in the UI

```js
// Change this one line in app/page.tsx (or the artifact JSX):

// ❌ Artifact version (Anthropic injects the key)
fetch("https://api.anthropic.com/v1/messages", { ... })

// ✅ Vercel version (key stays on your server)
fetch("/api/optimize", { ... })
```

### Step 4 — Add your API key

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx
```

Get yours at [console.anthropic.com](https://console.anthropic.com)

### Step 5 — Deploy

```bash
npx vercel deploy
# Add ANTHROPIC_API_KEY in Vercel Dashboard → Settings → Environment Variables
```

---

## λ LaTeX Templates

| # | Template | Engine | Blank Overleaf? |
|---|---|---|---|
| 1 | **harshibar's Resume** | `pdflatex` | ✅ Yes — CTAN only |
| 2 | **Entry Level** (Twenty Seconds CV) | `xelatex` | ⚠️ No — needs original project |
| 3 | **Deedy / Mohamed Javid** | `xelatex` | ⚠️ No — needs original project |
| 4 | **autoCV** | `pdflatex` | ✅ Yes — CTAN only |

> **For ⚠️ templates:** Click **↗ Open on Overleaf** → open the `.tex` file in that project → select all → paste → Recompile with **XeLaTeX**.

---

## 🧠 How the ATS Optimization Works

```
Your Resume  ──┐
               ├──▶  Claude  ──▶  Optimized Resume
Job Description─┘

Claude will:
  ✅  Add JD keywords into existing bullet points naturally
  ✅  Strengthen weak action verbs to match JD language
  ✅  Expand Skills section with JD-relevant tools
  ✅  Mark every change with [[keyword]] → renders bold blue
  ❌  Never remove existing experience or education
  ❌  Never fabricate skills you don't have
```

---

## 🗂️ Project Structure (Vercel)

```
ats-optimizer/
├── app/
│   ├── page.tsx              ← full multi-chat UI (all components)
│   ├── layout.tsx            ← HTML shell
│   ├── globals.css           ← base styles + animations
│   └── api/
│       └── optimize/
│           └── route.ts      ← Anthropic proxy (key never hits browser)
├── lib/
│   ├── types.ts              ← TypeScript interfaces
│   ├── templates.ts          ← 4 Overleaf specs + LaTeX preambles
│   └── docx.ts               ← DOCX XML generation, per-template styles
├── .env.local                ← ANTHROPIC_API_KEY (never commit this)
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 (artifact) · Next.js 14 App Router (Vercel) |
| AI | Claude Sonnet via `@anthropic-ai/sdk` |
| Resume parsing | `mammoth` — DOCX → plain text |
| DOCX generation | `jszip` + hand-crafted Word XML (no external service) |
| LaTeX | 4 real Overleaf templates, exact preamble copied from source |
| Persistence | `window.storage` (artifact) · `localStorage` (standalone) |
| Styling | Inline React styles — zero CSS framework dependency |

---

## ⚠️ Known Limitations

- **File data is in-memory** — re-upload your resume after a page refresh (chat history is preserved, file binary is not)
- **Two templates need Overleaf** — Twenty Seconds CV and Deedy use custom `.cls` files not on CTAN
- **Large PDFs** — files over ~5 MB may hit API body size limits; prefer DOCX for large resumes
- **Token budget** — output capped at 7,000 tokens; very long resumes + JDs may truncate

---

## 🔗 Links

- [Anthropic Console](https://console.anthropic.com) — get your API key
- [harshibar's Resume](https://www.overleaf.com/latex/templates/harshibars-resume/sbcyynmtpnyd) — Overleaf template
- [Entry Level Resume](https://www.overleaf.com/latex/templates/entry-level-resume-template-latex/jsmpwkcwyntg) — Overleaf template
- [Deedy / Mohamed Javid](https://www.overleaf.com/articles/mohamed-javids-single-page-resume/ryhxghnkffqp) — Overleaf article
- [autoCV](https://www.overleaf.com/latex/templates/autocv/scfvqfpxncwb) — Overleaf template

---

<div align="center">

Made with Claude · MIT License

</div>
