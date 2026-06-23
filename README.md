ATS Resume Optimizer ✦
An AI-powered resume optimizer that tailors your resume to any job description — adding ATS keywords, strengthening bullet points, and outputting an editable .docx and compilable .tex in your chosen Overleaf template. Built with a multi-chat sidebar so you can manage separate applications like Claude or ChatGPT.
---
Preview
Sidebar + Chat	Editable .docx Preview
Start new chats per job, switch between them	Click any text in the Word-like editor and type
---
Features
Multi-chat session management — sidebar with Today / Yesterday / Last 7 days grouping, rename, delete, persistence across refreshes
Resume upload — PDF or DOCX (drag & drop or click)
ATS optimization — Claude weaves job-description keywords into your resume without removing anything original; keywords highlighted in bold
Editable .docx preview — live Word-like editor in the browser; click any text, type, then download
LaTeX output — 4 Overleaf templates with exact preamble/structure (see Templates section)
Copy LaTeX — clipboard copy with guaranteed manual-select fallback if the browser blocks auto-copy
LaTeX health check — detects unbalanced `\begin`/`\end` before you open Overleaf
---
Usage (Artifact / Claude.ai)
Open the artifact in Claude.ai
Click ＋ New Chat in the sidebar
Upload your resume (PDF or DOCX)
Pick a LaTeX template from the 4 options
Paste a job description and press Send ↑ (or Ctrl+Enter)
When the result arrives:
✏️ Edit & Download — opens the live editor; edit any text, save as `.docx`
⬇ .docx — instant download without editing
⬇ .tex — download the LaTeX source file
⎘ Copy LaTeX — copy to clipboard (fallback modal if blocked)
↗ Overleaf — opens the original template on Overleaf
---
Vercel Deployment
To run this as a standalone web app:
1. Scaffold a Next.js project
```bash
npx create-next-app@latest ats-optimizer --typescript --app --no-tailwind --no-eslint
cd ats-optimizer
```
2. Install dependencies
```bash
npm install @anthropic-ai/sdk jszip mammoth
```
3. Add the API route
Create `app/api/optimize/route.ts`:
```typescript
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
4. Replace fetch URL
In the artifact JSX, change:
```js
// FROM (Claude.ai artifact — key injected by platform)
fetch("https://api.anthropic.com/v1/messages", { ... })

// TO (Vercel — key stays on server)
fetch("/api/optimize", { ... })
```
5. Set your API key
```bash
cp .env.local.example .env.local
# Add: ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx
```
Get a key at console.anthropic.com.
6. Run locally
```bash
npm run dev
# → http://localhost:3000
```
7. Deploy to Vercel
```bash
npx vercel deploy
```
Add `ANTHROPIC_API_KEY` in Vercel Dashboard → Project → Settings → Environment Variables.
---
LaTeX Templates
#	Template	Engine	Works in blank Overleaf?
1	harshibar's Resume	pdflatex	✅ Yes — standard CTAN packages only
2	Entry Level Resume (Twenty Seconds CV)	xelatex	⚠️ No — open original project first
3	Deedy / Mohamed Javid	xelatex	⚠️ No — open original project first
4	autoCV	pdflatex	✅ Yes — standard CTAN packages only
For templates marked ⚠️:
Click ↗ Open on Overleaf in the app
In that Overleaf project, open the `.tex` file
Select all → paste the generated LaTeX
Click Recompile with XeLaTeX selected as the compiler
---
How ATS optimization works
Your resume (PDF or DOCX) is sent to Claude along with the job description
Claude identifies keywords, skills, tools, and action verbs from the JD that are missing or weak in your resume
These are woven naturally into your existing bullet points — nothing is removed
Newly added/emphasized terms are wrapped in `[[keyword]]` which renders as bold blue in the preview
A summary section lists every keyword added and an estimated ATS match score improvement
---
Project structure (Vercel version)
```
app/
  page.tsx              ← full multi-chat UI
  layout.tsx            ← HTML shell
  globals.css           ← base styles + animations
  api/
    optimize/
      route.ts          ← Anthropic API proxy (keeps key secret)
lib/
  types.ts              ← TypeScript interfaces
  templates.ts          ← 4 Overleaf template specs + LaTeX preambles
  docx.ts               ← DOCX XML generation, per-template styling
```
---
Tech stack
Layer	Technology
UI framework	React 18 (artifact) / Next.js 14 App Router (Vercel)
AI model	Claude Sonnet (`claude-sonnet-4-6`) via Anthropic API
Resume parsing	mammoth — DOCX → text
DOCX generation	JSZip + hand-crafted Word XML
LaTeX	4 real Overleaf templates with exact preamble reproduction
Persistence	`window.storage` (artifact) / `localStorage` (standalone)
Styling	Inline React styles — no CSS framework dependency
---
Environment variables
Variable	Required	Description
`ANTHROPIC_API_KEY`	✅ Yes (Vercel only)	Your Anthropic API key — never needed in the Claude.ai artifact version
---
Limitations
File data is in-memory — if you refresh the page, you'll need to re-upload your resume (the chat history and messages are preserved, just not the file binary)
Two templates require Overleaf — Twenty Seconds CV and Deedy use custom `.cls` files not available on CTAN; they must be compiled inside the original Overleaf project
PDF base64 size — very large PDFs (>5MB) may hit API body size limits; DOCX upload is recommended for large resumes
Token budget — the optimizer uses up to 7,000 output tokens; extremely long resumes + JDs may get truncated; split into sections if needed
---
License
MIT — use freely, attribution appreciated.
---
Links
Anthropic Console — get your API key
harshibar's Resume on Overleaf
Entry Level Resume on Overleaf
Mohamed Javid / Deedy on Overleaf
autoCV on Overleaf
