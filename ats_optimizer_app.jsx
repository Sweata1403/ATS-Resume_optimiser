import { useState, useRef, useEffect, useCallback, memo } from "react";
import mammoth from "mammoth";

/* ── colours ── */
const C = {
  bg:"#090b13", surface:"#0f1220", raised:"#161925", border:"#1f2436",
  accent:"#00c4a3", accentDim:"rgba(0,196,163,0.12)", text:"#e4e8f4",
  muted:"#5c6278", hint:"#3d4259", userBg:"#151c30", userBorder:"#1e2a44",
  sidebar:"#07090f", warn:"#d4a93f", warnDim:"rgba(212,169,63,0.1)",
};

/* ── templates ── */
const TEMPLATES = [
  { id:"harshibar", name:"harshibar's Resume", author:"harshibar",
    desc:"Sans-serif · gray rules · FiraMono", accent:"#4a90d9", engine:"pdflatex", custom:false,
    url:"https://www.overleaf.com/latex/templates/harshibars-resume/sbcyynmtpnyd",
    spec:`TEMPLATE: harshibar's Resume — STANDALONE pdflatex. Use EXACTLY this preamble verbatim:
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}\\usepackage[empty]{fullpage}\\usepackage{titlesec}\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}\\usepackage{verbatim}\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}\\usepackage{fancyhdr}\\usepackage[english]{babel}\\usepackage{tabularx}
\\usepackage{fontawesome5}\\usepackage[scale=0.90,lf]{FiraMono}
\\definecolor{light-grey}{gray}{0.83}\\definecolor{dark-grey}{gray}{0.3}\\definecolor{text-grey}{gray}{.08}
\\DeclareRobustCommand{\\ebseries}{\\fontseries{eb}\\selectfont}\\DeclareTextFontCommand{\\texteb}{\\ebseries}
\\usepackage{contour}\\usepackage[normalem]{ulem}\\renewcommand{\\ULdepth}{1.8pt}\\contourlength{0.8pt}
\\newcommand{\\myuline}[1]{\\uline{\\phantom{#1}}\\llap{\\contour{white}{#1}}}
\\usepackage{tgheros}\\renewcommand*\\familydefault{\\sfdefault}\\usepackage[T1]{fontenc}
\\pagestyle{fancy}\\fancyhf{}\\fancyfoot{}\\renewcommand{\\headrulewidth}{0pt}\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}\\addtolength{\\evensidemargin}{0in}\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}\\raggedbottom\\raggedright\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\bfseries \\vspace{2pt} \\raggedright \\large}{}{0em}{}[\\color{light-grey} {\\titlerule[2pt]} \\vspace{-4pt}]
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-1pt}}}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{-1pt}\\item\\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\ \\textit{#3} & {\\color{dark-grey} \\small #4}\\\\ \\end{tabular*}\\vspace{-4pt}}
\\newcommand{\\resumeSubSubheading}[2]{\\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}\\textit{\\small#1} & \\textit{\\small #2} \\\\\\end{tabular*}\\vspace{-7pt}}
\\newcommand{\\resumeProjectHeading}[2]{\\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}#1 & {\\color{dark-grey}} \\\\\\end{tabular*}\\vspace{-4pt}}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}
\\color{text-grey}
BODY:
\\begin{document}
\\begin{center}
    \\textbf{\\Huge NAME} \\\\ \\vspace{5pt}
    \\small \\faPhone* \\texttt{phone} $|$ \\faEnvelope \\hspace{2pt}\\texttt{email} $|$ \\faLinkedin \\hspace{2pt}\\texttt{linkedin} $|$ \\faMapMarker* \\hspace{2pt}\\texttt{City}
\\end{center}
\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading{Company}{Dates}{Title}{City}
      \\resumeItemListStart\\resumeItem{Bullet with \\textbf{keyword}.}\\resumeItemListEnd
  \\resumeSubHeadingListEnd
\\section{SKILLS}
 \\begin{itemize}[leftmargin=0in, label={}]\\small{\\item{\\textbf{Category}{: items}\\vspace{2pt}\\\\\\textbf{Tools}{: items}}}\\end{itemize}
\\end{document}
ATS KEYWORDS: \\textbf{keyword}` },
  { id:"twentyseconds", name:"Entry Level Resume", author:"Harsh Gadgil",
    desc:"Two-column · blue sidebar · bubbles", accent:"#3d6bd0", engine:"xelatex", custom:true,
    url:"https://www.overleaf.com/latex/templates/entry-level-resume-template-latex/jsmpwkcwyntg",
    spec:`TEMPLATE: Twenty Seconds CV — REQUIRES original Overleaf project. Engine: XeLaTeX.
\\documentclass[letterpaper]{twentysecondcv}
\\newcommand\\skills{~\\smartdiagram[bubble diagram]{\\textbf{S1},\\textbf{S2},\\textbf{S3},\\textbf{S4},\\textbf{S5}}}
\\programming{{L1 $\\textbullet$ L2 / 3},{L3 $\\textbullet$ L4 / 3.5},{L5 $\\textbullet$ L6 / 5}}
\\education{\\textbf{Degree, Field}\\\\University\\\\Year - Year | City}
\\cvname{FULL NAME}\\cvjobtitle{Job Title}\\cvlinkedin{/in/handle}\\cvgithub{username}
\\cvnumberphone{phone}\\cvmail{email}
\\begin{document}
\\makeprofile
\\section{Experience}
\\begin{twenty}
\\twentyitem{Start -}{End}{Title}{\\href{url}{Company}}{}{\\begin{itemize}\\item Bullet with \\textbf{keyword}.\\end{itemize}}
    \\\\
\\twentyitem{Start -}{End}{Title}{Company}{}{\\begin{itemize}\\item Bullet.\\end{itemize}}
\\end{twenty}
\\end{document}
RULES: \\makeprofile FIRST. \\twentyitem=6 args. ATS keywords: \\textbf{keyword} ONLY (no \\color inside \\textbf).` },
  { id:"deedy", name:"Deedy / Mohamed Javid", author:"Debarghya Das",
    desc:"Dark header · two-column · open fonts", accent:"#5a80c8", engine:"xelatex", custom:true,
    url:"https://www.overleaf.com/articles/mohamed-javids-single-page-resume/ryhxghnkffqp",
    spec:`TEMPLATE: Deedy Resume — REQUIRES original Overleaf project. Engine: XeLaTeX.
\\documentclass[]{deedy-resume-openfont}
\\namesection{First}{Last}{website \\\\ email | phone}
\\begin{document}
\\begin{minipage}[t]{0.33\\textwidth}
\\section{Education}\\subsection{University}\\descript{Degree}\\location{Year|City}\\sectionsep
\\section{Skills}\\subsection{Languages}\\location{Python, JS}\\sectionsep
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.66\\textwidth}
\\section{Experience}
\\runsubsection{Company}\\descript{| Title}\\location{Dates|City}
\\begin{tightemize}\\item Bullet with \\textbf{keyword}.\\end{tightemize}\\sectionsep
\\end{minipage}
\\end{document}
ATS KEYWORDS: \\textbf{keyword}` },
  { id:"autocv", name:"autoCV", author:"Jitin Nair",
    desc:"FontAwesome icons · article class", accent:"#4a80e0", engine:"pdflatex", custom:false,
    url:"https://www.overleaf.com/latex/templates/autocv/scfvqfpxncwb",
    spec:`TEMPLATE: autoCV — STANDALONE pdflatex.
\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=0.75in]{geometry}\\usepackage[T1]{fontenc}\\usepackage{fontawesome5}
\\usepackage{xcolor}\\definecolor{accent}{HTML}{2B5797}
\\usepackage[colorlinks=true,urlcolor=accent,hidelinks=false]{hyperref}
\\usepackage{enumitem}\\usepackage{titlesec}\\usepackage{parskip}\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\titleformat{\\section}{\\large\\bfseries\\color{accent}}{}{0em}{}[{\\color{accent}\\titlerule}]
\\titlespacing{\\section}{0pt}{10pt}{4pt}
\\begin{document}
{\\Huge\\textbf{FULL NAME}}\\\\[4pt]
\\textcolor{accent}{\\faGithub}~\\href{https://github.com/u}{github} \\quad
\\textcolor{accent}{\\faLinkedin}~\\href{https://linkedin.com/in/u}{linkedin} \\quad
\\textcolor{accent}{\\faEnvelope}~\\href{mailto:e}{email} \\quad \\textcolor{accent}{\\faPhone}~phone
\\section{Experience}
{\\large\\textbf{Title}} \\hfill \\textit{Dates}\\\\\\textit{Company, City}\\\\[2pt]
\\begin{itemize}[noitemsep,topsep=2pt,leftmargin=*]\\item Bullet with \\textbf{\\textcolor{accent}{keyword}}.\\end{itemize}
\\section{Skills}\\textbf{Languages:} items\\\\\\textbf{Tools:} items
\\end{document}
ATS KEYWORDS: \\textbf{\\textcolor{accent}{keyword}}` },
];

/* ── DOCX styles per template ── */
const DS = {
  harshibar:{nc:"1a1a1a",ns:32,na:"center",nb:false,h2c:"1a1a1a",h2s:20,h2r:"normal",h2rc:"d0d0d0",h2rs:20,h3c:"1a1a1a",h3s:20,bc:"333333",bs:20,kc:"555555",mg:{t:720,r:1008,b:720,l:1008}},
  twentyseconds:{nc:"1a3a7a",ns:32,na:"center",nb:false,h2c:"2b4d9e",h2s:22,h2r:"normal",h2rc:"3d6bd0",h2rs:8,h3c:"2b4d9e",h3s:20,bc:"333333",bs:20,kc:"2b4d9e",mg:{t:1080,r:1260,b:1080,l:1260}},
  deedy:{nc:"1c2844",ns:36,na:"center",nb:false,h2c:"2c4a8a",h2s:20,h2r:"upper",h2rc:"2c4a8a",h2rs:8,h3c:"2c4a8a",h3s:20,bc:"333333",bs:20,kc:"2c4a8a",mg:{t:1080,r:1260,b:1080,l:1260}},
  autocv:{nc:"1a2a5e",ns:36,na:"left",nb:true,h2c:"2b5797",h2s:22,h2r:"upper",h2rc:"2b5797",h2rs:8,h3c:"1a2a5e",h3s:20,bc:"333333",bs:20,kc:"2b5797",mg:{t:900,r:1080,b:900,l:1080}},
};

/* ── utilities ── */
const uid = () => Math.random().toString(36).slice(2,10);
const hexRgb = h => `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
const noEmoji = s => (s||"").replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}✅✦▸]/gu,"").trim();
const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const relTime = iso => {
  const d = (Date.now()-new Date(iso).getTime())/86400000;
  if(d<0.04)return"Just now"; if(d<0.07)return"Minutes ago";
  const h=Math.round(d*24); if(h<24)return`${h}h ago`;
  const dd=Math.floor(d); if(dd<7)return`${dd}d ago`;
  return new Date(iso).toLocaleDateString();
};
const groupChats = chats => {
  const g={Today:[],Yesterday:[],"Last 7 days":[],Older:[]};
  const now=Date.now();
  for(const c of [...chats].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))){
    const d=(now-new Date(c.updatedAt).getTime())/86400000;
    if(d<1)g.Today.push(c); else if(d<2)g.Yesterday.push(c); else if(d<7)g["Last 7 days"].push(c); else g.Older.push(c);
  }
  return g;
};
const titleFromJD = jd => jd.trim().split(/\s+/).slice(0,6).join(" ").replace(/[^a-zA-Z0-9 ]/g,"").trim()||"New Chat";
const renderMd = raw => {
  if(!raw)return"";
  return raw
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\[\[([^\]]+)\]\]/g,`<strong style="color:#5ca8e8;font-weight:700">$1</strong>`)
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/^### (.+)$/gm,`<h3 style="font-size:13.5px;font-weight:700;color:#5ca8e8;margin:13px 0 3px">$1</h3>`)
    .replace(/^## (.+)$/gm,`<h2 style="font-size:14px;font-weight:700;color:#3d8fe0;margin:18px 0 5px;border-bottom:1px solid #1a2d4a;padding-bottom:4px">$1</h2>`)
    .replace(/^# (.+)$/gm,`<h1 style="font-size:18px;font-weight:700;color:#5cb3f0;margin:0 0 12px;text-align:center">$1</h1>`)
    .replace(/^---+$/gm,`<div style="border-top:1px solid #1f2436;margin:12px 0"></div>`)
    .replace(/^- (.+)$/gm,`<div style="display:flex;gap:8px;margin:3px 0;line-height:1.55"><span style="color:#00c4a3;flex-shrink:0;margin-top:2px">▸</span><span>$1</span></div>`)
    .replace(/\n{2,}/g,`<div style="height:8px"></div>`).replace(/\n/g,"<br>");
};

/* ── clipboard ── */
function legacyCopy(t){try{const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;top:0;left:-9999px;opacity:0";document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,t.length);const ok=document.execCommand("copy");document.body.removeChild(ta);return ok;}catch{return false;}}
function copyToClipboard(t){return new Promise(r=>{try{if(navigator.clipboard?.writeText){navigator.clipboard.writeText(t).then(()=>r(true)).catch(()=>r(legacyCopy(t)));}else r(legacyCopy(t));}catch{r(legacyCopy(t));}});}

/* ── DOCX XML ── */
function inlineRuns(text,kc,bc,bs){
  let o="";
  for(const p of (text||"").split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[\[[^\]]+\]\])/)){
    if(!p)continue;
    if(p.startsWith("**")&&p.endsWith("**"))o+=`<w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">${esc(p.slice(2,-2))}</w:t></w:r>`;
    else if(p.startsWith("[[")&&p.endsWith("]]"))o+=`<w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${kc}"/></w:rPr><w:t xml:space="preserve">${esc(p.slice(2,-2))}</w:t></w:r>`;
    else if(p.startsWith("*")&&p.endsWith("*"))o+=`<w:r><w:rPr><w:i/><w:iCs/><w:color w:val="${bc}"/></w:rPr><w:t xml:space="preserve">${esc(p.slice(1,-1))}</w:t></w:r>`;
    else o+=`<w:r><w:rPr><w:color w:val="${bc}"/><w:sz w:val="${bs}"/><w:szCs w:val="${bs}"/></w:rPr><w:t xml:space="preserve">${esc(p)}</w:t></w:r>`;
  }
  return o||"<w:r><w:t></w:t></w:r>";
}
function mdToDocXml(md,tid="harshibar"){
  const S=DS[tid]||DS.harshibar;const ir=t=>inlineRuns(t,S.kc,S.bc,S.bs);let b="";
  const{t,r,b:mb,l}=S.mg;
  for(const line of md.split("\n")){
    const tx=line.trim();
    if(!tx||tx==="---"){b+=`<w:p><w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr></w:p>`;continue;}
    if(tx.startsWith("# ")){
      const jc=S.na==="center"?`<w:jc w:val="center"/>`:"";
      const bdr=S.nb?`<w:pBdr><w:bottom w:val="single" w:sz="20" w:space="4" w:color="${S.h2rc}"/></w:pBdr>`:"";
      b+=`<w:p><w:pPr>${jc}${bdr}<w:spacing w:before="0" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.nc}"/><w:sz w:val="${S.ns}"/><w:szCs w:val="${S.ns}"/></w:rPr><w:t>${esc(noEmoji(tx.slice(2)))}</w:t></w:r></w:p>`;
    }else if(tx.startsWith("## ")){
      const raw=noEmoji(tx.slice(3)),label=esc(S.h2r==="upper"?raw.toUpperCase():raw);
      b+=`<w:p><w:pPr><w:spacing w:before="240" w:after="60"/><w:pBdr><w:bottom w:val="single" w:sz="${S.h2rs}" w:space="4" w:color="${S.h2rc}"/></w:pBdr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.h2c}"/><w:sz w:val="${S.h2s}"/><w:szCs w:val="${S.h2s}"/></w:rPr><w:t>${label}</w:t></w:r></w:p>`;
    }else if(tx.startsWith("### ")){
      b+=`<w:p><w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.h3c}"/><w:sz w:val="${S.h3s}"/><w:szCs w:val="${S.h3s}"/></w:rPr><w:t xml:space="preserve">${esc(noEmoji(tx.slice(4)))}</w:t></w:r></w:p>`;
    }else if(/^[-*] /.test(tx)){
      b+=`<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="30" w:after="30"/></w:pPr>${ir(tx.slice(2))}</w:p>`;
    }else{
      b+=`<w:p><w:pPr><w:spacing w:before="50" w:after="50"/></w:pPr>${ir(tx)}</w:p>`;
    }
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${b}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="${t}" w:right="${r}" w:bottom="${mb}" w:left="${l}"/></w:sectPr></w:body></w:document>`;
}
const DOCX_PARTS={
  ct:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`,
  rels:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  wRels:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`,
  num:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#x2022;"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`,
};
async function makeDocxBlob(docXml){
  if(!window.JSZip)throw new Error("JSZip not loaded yet");
  const zip=new window.JSZip();
  zip.file("[Content_Types].xml",DOCX_PARTS.ct);zip.file("_rels/.rels",DOCX_PARTS.rels);
  const w=zip.folder("word");w.file("document.xml",docXml);w.file("numbering.xml",DOCX_PARTS.num);
  w.folder("_rels").file("document.xml.rels",DOCX_PARTS.wRels);
  return zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}

/* ── editor helpers ── */
function mdToEditableHtml(md,tid){
  const S=DS[tid]||DS.harshibar;const pt=n=>n/2+"pt";
  const inline=t=>(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\[\[([^\]]+)\]\]/g,`<span style="font-weight:700;color:#${S.kc}">$1</span>`)
    .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
  return md.split("\n").map(line=>{
    const tx=line.trim();
    if(!tx||tx==="---")return`<div data-mk="spacer" style="height:8px"></div>`;
    if(tx.startsWith("# ")){
      const bdr=S.nb?`border-bottom:2pt solid #${S.h2rc};padding-bottom:5px;`:"";
      return`<div data-mk="h1" contenteditable="true" style="text-align:${S.na};font-size:${pt(S.ns)};font-weight:700;color:#${S.nc};margin:0 0 8px;${bdr}outline:none">${inline(noEmoji(tx.slice(2)))}</div>`;
    }if(tx.startsWith("## ")){
      const raw=noEmoji(tx.slice(3)),label=S.h2r==="upper"?raw.toUpperCase():raw,rw=S.h2rs>=16?"2pt":"1pt";
      return`<div data-mk="h2" contenteditable="true" style="font-size:${pt(S.h2s)};font-weight:700;color:#${S.h2c};border-bottom:${rw} solid #${S.h2rc};margin:18px 0 5px;padding-bottom:3px;outline:none">${inline(label)}</div>`;
    }if(tx.startsWith("### ")){
      return`<div data-mk="h3" contenteditable="true" style="font-size:${pt(S.h3s)};font-weight:700;color:#${S.h3c};margin:10px 0 3px;outline:none">${inline(noEmoji(tx.slice(4)))}</div>`;
    }if(/^[-*] /.test(tx)){
      return`<div data-mk="bullet" style="display:flex;gap:7px;margin:2px 0"><span style="flex-shrink:0;color:#00c4a3;font-size:${pt(S.bs)};line-height:1.5;margin-top:1px">•</span><span data-mk-text="1" contenteditable="true" style="flex:1;outline:none;font-size:${pt(S.bs)};color:#${S.bc};line-height:1.5">${inline(tx.slice(2))}</span></div>`;
    }
    return`<div data-mk="body" contenteditable="true" style="font-size:${pt(S.bs)};color:#${S.bc};margin:3px 0;outline:none">${inline(tx)}</div>`;
  }).join("");
}
function editorToDocXml(el,tid){
  const S=DS[tid]||DS.harshibar;let b="";
  for(const node of el.querySelectorAll("[data-mk]")){
    const type=node.dataset.mk;
    if(type==="spacer"){b+=`<w:p><w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr></w:p>`;continue;}
    let raw=type==="bullet"?(node.querySelector("[data-mk-text]")?.innerText||"").trim():(node.innerText||node.textContent||"").trim();
    if(!raw)continue;
    if(type==="h1"){
      const jc=S.na==="center"?`<w:jc w:val="center"/>`:"";const bdr=S.nb?`<w:pBdr><w:bottom w:val="single" w:sz="20" w:space="4" w:color="${S.h2rc}"/></w:pBdr>`:"";
      b+=`<w:p><w:pPr>${jc}${bdr}<w:spacing w:before="0" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.nc}"/><w:sz w:val="${S.ns}"/><w:szCs w:val="${S.ns}"/></w:rPr><w:t>${esc(raw)}</w:t></w:r></w:p>`;
    }else if(type==="h2"){
      const label=S.h2r==="upper"?raw.toUpperCase():raw;
      b+=`<w:p><w:pPr><w:spacing w:before="240" w:after="60"/><w:pBdr><w:bottom w:val="single" w:sz="${S.h2rs}" w:space="4" w:color="${S.h2rc}"/></w:pBdr></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.h2c}"/><w:sz w:val="${S.h2s}"/><w:szCs w:val="${S.h2s}"/></w:rPr><w:t>${esc(label)}</w:t></w:r></w:p>`;
    }else if(type==="h3"){
      b+=`<w:p><w:pPr><w:spacing w:before="120" w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="${S.h3c}"/><w:sz w:val="${S.h3s}"/><w:szCs w:val="${S.h3s}"/></w:rPr><w:t xml:space="preserve">${esc(raw)}</w:t></w:r></w:p>`;
    }else if(type==="bullet"){
      b+=`<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="30" w:after="30"/></w:pPr><w:r><w:rPr><w:color w:val="${S.bc}"/><w:sz w:val="${S.bs}"/><w:szCs w:val="${S.bs}"/></w:rPr><w:t xml:space="preserve">${esc(raw)}</w:t></w:r></w:p>`;
    }else{
      b+=`<w:p><w:pPr><w:spacing w:before="50" w:after="50"/></w:pPr><w:r><w:rPr><w:color w:val="${S.bc}"/><w:sz w:val="${S.bs}"/><w:szCs w:val="${S.bs}"/></w:rPr><w:t xml:space="preserve">${esc(raw)}</w:t></w:r></w:p>`;
    }
  }
  const{t,r,b:mb,l}=S.mg;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${b}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="${t}" w:right="${r}" w:bottom="${mb}" w:left="${l}"/></w:sectPr></w:body></w:document>`;
}

/* ── latex health ── */
function latexHealth(tex){
  if(!tex)return{ok:true,issues:[]};
  const code=tex.slice(tex.indexOf("\\documentclass"),tex.lastIndexOf("\\end{document}")+14);
  const bg=(code.match(/\\begin\{(\w+)\}/g)||[]).map(m=>m.match(/\{(\w+)\}/)[1]).sort();
  const en=(code.match(/\\end\{(\w+)\}/g)||[]).map(m=>m.match(/\{(\w+)\}/)[1]).sort();
  const issues=[];
  if(JSON.stringify(bg)!==JSON.stringify(en))issues.push("unbalanced \\begin/\\end environments");
  if(!tex.includes("\\end{document}"))issues.push("missing \\end{document}");
  return{ok:issues.length===0,issues};
}

/* ══ SMALL COMPONENTS ══ */
function Avatar({type}){
  return (<div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,background:type==="user"?"#1a2040":C.accentDim,border:`1px solid ${type==="user"?"#252f55":"rgba(0,196,163,.25)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{type==="user"?"👤":"✦"}</div>);
}
function Dots(){
  return (<div style={{display:"flex",gap:5,alignItems:"center",padding:"4px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.accent,animation:`blink 1.2s ease-in-out ${i*.18}s infinite`}}/>)}</div>);
}
function ManualCopyModal({text,onClose}){
  const ref=useRef(null);
  useEffect(()=>{setTimeout(()=>{ref.current?.focus();ref.current?.select();},50);},[]);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16,maxWidth:560,width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>Select &amp; copy manually</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <p style={{fontSize:11.5,color:C.muted,marginBottom:8,lineHeight:1.5}}>Auto-copy was blocked. Text is pre-selected — press <strong style={{color:C.text}}>Ctrl+C</strong> (Cmd+C on Mac).</p>
        <textarea ref={ref} readOnly value={text} style={{flex:1,minHeight:260,background:"#0a0c14",border:`1px solid ${C.border}`,borderRadius:8,padding:10,color:"#c8d0e8",fontSize:11.5,fontFamily:"'SF Mono',Consolas,monospace",lineHeight:1.5,resize:"none",outline:"none"}}/>
      </div>
    </div>
  );
}

/* ── SVG thumbnails ── */
function SvgH({s}){const a=s?"#4a90d9":"#4a5070",t="#2a2d3e";return (<svg viewBox="0 0 90 116" xmlns="http://www.w3.org/2000/svg" style={{display:"block",width:"100%"}}><rect width="90" height="116" fill="#f4f6fa" rx="3"/><rect x="18" y="7" width="54" height="6" rx="1.5" fill="#1a1a2e"/>{[11,30,52,68,80].map((x,i)=><rect key={i} x={x} y="16" width={[12,14,14,8,6][i]} height="2" rx=".8" fill="#888"/>)}<rect x="6" y="22" width="78" height="2" rx=".5" fill={a} opacity=".5"/><rect x="6" y="27" width="34" height="3" rx="1" fill={t}/><rect x="6" y="32" width="78" height="1.5" rx=".4" fill="#ccc"/>{[36,40,45,50,55,60].map((y,i)=>[<rect key={`a${i}`} x="6" y={y} width={[48,36,56,48,60,44][i]} height="2" rx=".5" fill={i<2?t:"#aaa"}/>])}{s&&<rect width="90" height="116" fill="none" stroke={a} strokeWidth="1.8" rx="3"/>}</svg>);}
function SvgT({s}){const a=s?"#3d6bd0":"#3d5090";return (<svg viewBox="0 0 90 116" xmlns="http://www.w3.org/2000/svg" style={{display:"block",width:"100%"}}><rect width="90" height="116" fill="#f4f6fa" rx="3"/><rect x="0" y="0" width="28" height="116" fill={a} rx="3"/><rect x="22" y="0" width="6" height="116" fill={a}/><circle cx="14" cy="14" r="8" fill={s?"#5a84d8":"#4a6db8"} stroke="#fff" strokeWidth="1.2"/><rect x="3" y="26" width="22" height="3" rx="1" fill="#fff" opacity=".9"/><rect x="32" y="6" width="44" height="5" rx="1" fill="#1a1a2e"/>{[30,35,40,45,50,55].map((y,i)=>[<circle key={`c${i}`} cx="35" cy={y+1} r="1.1" fill={a}/>,<rect key={`r${i}`} x="38" y={y} width={[42,34,46,38,44,36][i]} height="2" rx=".5" fill="#888"/>])}{s&&<rect width="90" height="116" fill="none" stroke={a} strokeWidth="1.8" rx="3"/>}</svg>);}
function SvgD({s}){const a=s?"#5a80c8":"#4a6aa0";return (<svg viewBox="0 0 90 116" xmlns="http://www.w3.org/2000/svg" style={{display:"block",width:"100%"}}><rect width="90" height="116" fill="#f4f6fa" rx="3"/><rect x="0" y="0" width="90" height="20" fill={s?"#1c2844":"#212c40"} rx="3"/><rect x="0" y="15" width="90" height="5" fill={s?"#1c2844":"#212c40"}/><rect x="6" y="4" width="38" height="6" rx="1.5" fill="#fff" opacity=".9"/><rect x="0" y="20" width="30" height="96" fill={s?"#eef1f8":"#e8ecf4"}/><rect x="3" y="25" width="22" height="3" rx="1" fill={a}/><rect x="34" y="25" width="22" height="3.5" rx="1" fill={a}/>{[32,37,42,47,52,57].map((y,i)=>[<circle key={`c${i}`} cx="37" cy={y+1} r="1.1" fill="#666"/>,<rect key={`r${i}`} x="40" y={y} width={[42,34,46,36,44,32][i]} height="2" rx=".5" fill="#888" opacity=".7"/>])}{s&&<rect width="90" height="116" fill="none" stroke={a} strokeWidth="1.8" rx="3"/>}</svg>);}
function SvgA({s}){const a=s?"#4a80e0":"#3d6abf",t="#1a2040";return (<svg viewBox="0 0 90 116" xmlns="http://www.w3.org/2000/svg" style={{display:"block",width:"100%"}}><rect width="90" height="116" fill="#f8f9fc" rx="3"/><rect x="6" y="7" width="40" height="7" rx="1.5" fill={t}/>{[0,1,2,3].map(i=><circle key={i} cx={66+i*8} cy="10" r="3.5" fill={s?"#dce8ff":"#d4e0f4"}/>)}<rect x="6" y="16" width="70" height="1.8" rx=".5" fill={a} opacity=".7"/><rect x="6" y="21" width="28" height="3.5" rx="1" fill={t}/>{[30,35,40,45,50,55].map((y,i)=>[<circle key={`c${i}`} cx="9.5" cy={y+1} r="1.3" fill={a} opacity=".8"/>,<rect key={`r${i}`} x="13" y={y} width={[55,46,60,44,50,40][i]} height="2" rx=".5" fill="#888" opacity=".75"/>])}{s&&<rect width="90" height="116" fill="none" stroke={a} strokeWidth="1.8" rx="3"/>}</svg>);}
const SVGS={harshibar:SvgH,twentyseconds:SvgT,deedy:SvgD,autocv:SvgA};

/* ══ TEMPLATE PICKER ══ */
const TemplatePicker=memo(function TemplatePicker({selected,onSelect}){
  return(
    <div style={{padding:"10px 14px 0"}}>
      <div style={{fontSize:11,color:C.muted,marginBottom:7,display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:"#9b7fd4",fontSize:12}}>◈</span>
        <span style={{fontWeight:600,color:"#c4b0e8"}}>LaTeX Template</span>
      </div>
      <div style={{display:"flex",gap:9,overflowX:"auto",paddingBottom:8}}>
        {TEMPLATES.map(t=>{
          const sel=selected===t.id,FB=SVGS[t.id],rgb=hexRgb(t.accent);
          return(
            <div key={t.id} onClick={()=>onSelect(t.id)} style={{flexShrink:0,cursor:"pointer",width:106,background:sel?`rgba(${rgb},.1)`:C.raised,border:`1.5px solid ${sel?t.accent:C.border}`,borderRadius:10,padding:"7px 7px 6px",transition:"all .15s"}}>
              <div style={{borderRadius:5,overflow:"hidden",marginBottom:5,border:`1px solid ${sel?t.accent+"40":C.border}`,background:"#f0f3f8",lineHeight:0}}><FB s={sel}/></div>
              <div style={{fontSize:10.5,fontWeight:700,color:sel?t.accent:C.text,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
              <div style={{fontSize:9,color:C.muted,lineHeight:1.3,marginBottom:3}}>{t.desc}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:8.5,color:C.hint,background:C.surface,borderRadius:3,padding:"1px 3px"}}>{t.engine}</span>
                <a href={t.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:8.5,color:"#5ca8e8",textDecoration:"none"}}>↗OL</a>
              </div>
              {t.custom&&<div style={{fontSize:8,color:C.warn,background:C.warnDim,borderRadius:3,padding:"1px 4px",textAlign:"center",marginTop:3}}>⚠ Open via link</div>}
              {sel&&<div style={{marginTop:3,fontSize:8.5,background:`rgba(${rgb},.15)`,color:t.accent,borderRadius:3,padding:"1px 5px",textAlign:"center",fontWeight:600}}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ══ RESUME EDITOR ══ */
function ResumeEditor({msg,templateId,onBack}){
  const paperRef=useRef(null);
  const[saving,setSaving]=useState(false);
  const S=DS[templateId]||DS.harshibar;
  const tmpl=TEMPLATES.find(t=>t.id===templateId)||TEMPLATES[0];
  useEffect(()=>{if(paperRef.current)paperRef.current.innerHTML=mdToEditableHtml(msg.content,templateId);},[]);
  const save=async()=>{
    if(!paperRef.current)return;setSaving(true);
    try{
      const xml=editorToDocXml(paperRef.current,templateId);
      const blob=await makeDocxBlob(xml);
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download="edited_resume.docx";document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),5000);
    }catch(e){alert("Error: "+e.message);}
    setSaving(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",minHeight:0}}>
      <div style={{background:"#0d101a",borderBottom:`1px solid ${C.border}`,padding:"8px 14px",display:"flex",alignItems:"center",gap:9,flexShrink:0,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:11}}>← Back</button>
        <span style={{fontSize:12,fontWeight:600,color:C.text}}>✏️ Edit Resume</span>
        <span style={{fontSize:10.5,color:C.muted}}>Click any text to edit</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:9.5,color:tmpl.accent,background:`rgba(${hexRgb(tmpl.accent)},.1)`,border:`1px solid rgba(${hexRgb(tmpl.accent)},.25)`,borderRadius:4,padding:"2px 6px",fontWeight:600}}>{tmpl.name}</span>
          <button onClick={save} disabled={saving} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,196,163,.15)",border:"1px solid rgba(0,196,163,.3)",color:C.accent,padding:"5px 12px",borderRadius:7,cursor:saving?"not-allowed":"pointer",fontSize:12,fontWeight:600,opacity:saving?.6:1}}>
            {saving?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> Saving…</>:<>⬇ Save .docx</>}
          </button>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",background:"#c8cdd8",padding:"18px 10px"}}>
        <div style={{background:"#fff",maxWidth:660,margin:"0 auto",boxShadow:"0 4px 24px rgba(0,0,0,.3)",fontFamily:"'Calibri',Arial,sans-serif",lineHeight:1.5,padding:`${S.mg.t/20}px ${S.mg.r/20}px`}}
          ref={paperRef}
          onKeyDown={e=>{
            if(e.key==="Enter"){e.preventDefault();try{const sel=window.getSelection();if(!sel?.rangeCount)return;const r=sel.getRangeAt(0),br=document.createElement("br");r.deleteContents();r.insertNode(br);r.setStartAfter(br);r.setEndAfter(br);sel.removeAllRanges();sel.addRange(r);}catch{}}
          }}
        />
      </div>
    </div>
  );
}

/* ══ CHAT WINDOW ══ */
function ChatWindow({chat,runtime,onUpdateChat,onUpdateRuntime,onSetManualCopy}){
  const[jd,setJd]=useState("");
  const[loading,setLoading]=useState(false);
  const[isDrag,setIsDrag]=useState(false);
  const[editorMsg,setEditorMsg]=useState(null);
  const[copied,setCopied]=useState(null);
  const[copiedTex,setCopiedTex]=useState(null);
  const fileRef=useRef(null);
  const msgRef=useRef(null);
  useEffect(()=>{msgRef.current?.scrollTo({top:msgRef.current.scrollHeight,behavior:"smooth"});},[chat.messages,loading]);

  const processFile=async f=>{
    const isPDF=f.type==="application/pdf",isDOCX=/\.docx?$/i.test(f.name);
    if(!isPDF&&!isDOCX){alert("Please upload PDF or Word (.pdf, .doc, .docx)");return;}
    onUpdateChat({fileInfo:{name:f.name,ext:f.name.split(".").pop()?.toLowerCase()||""}});
    if(isPDF){const r=new FileReader();r.onload=e=>{onUpdateRuntime({fileData:{type:"pdf",base64:e.target.result.split(",")[1]}});};r.readAsDataURL(f);}
    else{try{const buf=await f.arrayBuffer();const res=await mammoth.extractRawText({arrayBuffer:buf});onUpdateRuntime({fileData:{type:"docx",text:res.value}});}catch{onUpdateRuntime({fileData:{type:"docx",text:await f.text()}});}}
  };

  const send=async()=>{
    if(!runtime.fileData||!jd.trim()||loading)return;
    const userMsg=jd.trim();setJd("");setLoading(true);
    const um={id:uid(),role:"user",content:userMsg,createdAt:new Date().toISOString()};
    const msgs=[...chat.messages,um];
    const isFirst=chat.messages.filter(m=>m.role==="user").length===0;
    onUpdateChat({messages:msgs,title:isFirst?titleFromJD(userMsg):chat.title,updatedAt:new Date().toISOString()});
    const tmpl=TEMPLATES.find(t=>t.id===chat.selectedTemplate)||TEMPLATES[0];
    const system=`You are a senior ATS resume optimization specialist and LaTeX typesetter.
MISSION: Enhance the resume for the given job description. Output Markdown AND LaTeX.
CONTENT RULES:
1. NEVER remove existing experience, education, projects or achievements
2. NEVER fabricate skills or experience
3. DO add ATS keywords from JD naturally, mark with [[keyword]]
4. DO expand Skills with JD tools/competencies
5. End Markdown with ## ATS Optimization Summary
LATEX RULES:
1. Reproduce the preamble EXACTLY verbatim — no changes
2. Output COMPLETE document — never truncate or use "..."
3. Every \\begin{X} must have \\end{X}
4. TEMPLATE SPEC: ${tmpl.spec}
OUTPUT — exactly these two blocks:
===RESUME_MARKDOWN===
[Complete optimized resume, [[keyword]] for ATS terms]
===END_MARKDOWN===
===RESUME_LATEX===
[Complete compilable LaTeX]
===END_LATEX===`;
    let apiMsgs;
    if(runtime.fileData.type==="pdf"){apiMsgs=[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:runtime.fileData.base64}},{type:"text",text:`Job Description:\n\n${userMsg}\n\nOutput both blocks.`}]}];}
    else{apiMsgs=[{role:"user",content:`My Resume:\n\n${runtime.fileData.text}\n\n---\nJob Description:\n\n${userMsg}\n\nOutput both blocks.`}];}
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:7000,system,messages:apiMsgs})});
      if(!res.ok)throw new Error(`API error ${res.status}`);
      const data=await res.json();
      const raw=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      if(!raw)throw new Error("Empty response — please try again");
      const mdM=raw.match(/===RESUME_MARKDOWN===([\s\S]*?)===END_MARKDOWN===/);
      const ltM=raw.match(/===RESUME_LATEX===([\s\S]*?)===END_LATEX===/);
      const am={id:uid(),role:"assistant",content:mdM?mdM[1].trim():raw,latex:ltM?ltM[1].trim():null,templateId:tmpl.id,templateName:tmpl.name,templateAccent:tmpl.accent,isResume:true,createdAt:new Date().toISOString()};
      onUpdateChat({messages:[...msgs,am],updatedAt:new Date().toISOString()});
    }catch(e){onUpdateChat({messages:[...msgs,{id:uid(),role:"assistant",content:`**Error:** ${e.message}`,createdAt:new Date().toISOString()}],updatedAt:new Date().toISOString()});}
    setLoading(false);
  };

  const handleDownload=async(msg,i)=>{
    onUpdateRuntime({dlState:{...runtime.dlState,[i]:"generating"}});
    try{const xml=mdToDocXml(msg.content,msg.templateId||"harshibar");const blob=await makeDocxBlob(xml);const url=URL.createObjectURL(blob);onUpdateRuntime({dlState:{...runtime.dlState,[i]:url}});}
    catch(e){alert("DOCX error: "+e.message);onUpdateRuntime({dlState:{...runtime.dlState,[i]:""}});}
  };
  const doCopy=(t,i,setFn)=>copyToClipboard(t).then(ok=>{if(ok){setFn(i);setTimeout(()=>setFn(null),2000);}else onSetManualCopy(t);});
  const getTexUrl=(latex,i)=>{if(runtime.texUrls?.[i])return runtime.texUrls[i];const u=URL.createObjectURL(new Blob([latex],{type:"text/plain"}));onUpdateRuntime({texUrls:{...runtime.texUrls,[i]:u}});return u;};
  const canSend=!!runtime.fileData&&!!jd.trim()&&!loading;
  const tmpl=TEMPLATES.find(t=>t.id===chat.selectedTemplate)||TEMPLATES[0];

  if(editorMsg)return (<ResumeEditor msg={editorMsg} templateId={chat.selectedTemplate} onBack={()=>setEditorMsg(null)}/>);

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",minHeight:0}}>
      <div style={{padding:"10px 14px 0",flexShrink:0}}>
        {!chat.fileInfo?(
          <div onDragOver={e=>{e.preventDefault();setIsDrag(true);}} onDragLeave={()=>setIsDrag(false)}
            onDrop={e=>{e.preventDefault();setIsDrag(false);processFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current?.click()}
            style={{border:`1.5px dashed ${isDrag?C.accent:C.border}`,borderRadius:10,padding:"12px 18px",cursor:"pointer",background:isDrag?C.accentDim:C.raised,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <span style={{fontSize:20}}>📂</span>
            <div><div style={{fontWeight:600,fontSize:12.5,marginBottom:1}}>Upload your resume</div><div style={{fontSize:11,color:C.muted}}>PDF, DOC, DOCX · drag & drop</div></div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>e.target.files?.[0]&&processFile(e.target.files[0])}/>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:9,background:C.raised,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 12px"}}>
            <span style={{fontSize:13}}>{chat.fileInfo.ext==="pdf"?"📕":"📘"}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{chat.fileInfo.name}</div>
              <div style={{fontSize:10,color:runtime.fileData?C.accent:C.warn,marginTop:1}}>{runtime.fileData?"✓ Ready":"Re-upload to continue"}</div>
            </div>
            <button onClick={()=>{onUpdateChat({fileInfo:null});onUpdateRuntime({fileData:null});}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"2px 7px",borderRadius:5,cursor:"pointer",fontSize:10}}>Change</button>
          </div>
        )}
      </div>
      {/* template picker */}
      <div style={{flexShrink:0}}><TemplatePicker selected={chat.selectedTemplate} onSelect={t=>onUpdateChat({selectedTemplate:t,updatedAt:new Date().toISOString()})}/></div>
      {/* messages */}
      <div ref={msgRef} style={{flex:1,overflowY:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:11,minHeight:0}}>
        {chat.messages.length===0&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"32px 20px",gap:10}}>
            <div style={{fontSize:36}}>✦</div>
            <div style={{fontSize:15,fontWeight:600,color:C.text}}>ATS Resume Optimizer</div>
            <div style={{fontSize:12.5,color:C.muted,lineHeight:1.7,maxWidth:340}}>
              Upload your resume, pick a LaTeX template, then paste a job description below. I'll return an ATS-optimized version as <strong>.docx</strong> + <strong>.tex</strong>.
            </div>
          </div>
        )}
        {chat.messages.map((msg,i)=>{
          const isUser=msg.role==="user",dl=runtime.dlState?.[i],health=msg.latex?latexHealth(msg.latex):null;
          const tmplInfo=TEMPLATES.find(t=>t.id===msg.templateId);
          return(
            <div key={msg.id} style={{display:"flex",gap:8,flexDirection:isUser?"row-reverse":"row",alignItems:"flex-start",animation:"fadeIn .18s ease"}}>
              <Avatar type={msg.role}/>
              <div style={{maxWidth:"85%",background:isUser?C.userBg:C.surface,border:`1px solid ${isUser?C.userBorder:C.border}`,borderRadius:isUser?"14px 4px 14px 14px":"4px 14px 14px 14px",padding:"9px 13px",fontSize:13.5,lineHeight:1.6,color:C.text}}>
                {isUser?(
                  <div style={{whiteSpace:"pre-wrap",color:"#9db3e0"}}>{msg.content.length>220?msg.content.slice(0,220)+"…":msg.content}</div>
                ):(
                  <div>
                    <div dangerouslySetInnerHTML={{__html:renderMd(msg.content)}}/>
                    {msg.isResume&&(
                      <div style={{marginTop:9}}>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                          <button onClick={()=>setEditorMsg(msg)} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(155,127,212,.12)",border:"1px solid rgba(155,127,212,.3)",color:"#b89de8",padding:"5px 10px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>✏️ Edit &amp; Download</button>
                          {!dl&&<button onClick={()=>handleDownload(msg,i)} style={{display:"flex",alignItems:"center",gap:4,background:C.accentDim,border:"1px solid rgba(0,196,163,.3)",color:C.accent,padding:"5px 10px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>⬇ .docx</button>}
                          {dl==="generating"&&<span style={{fontSize:12,color:C.accent,padding:"5px 10px"}}><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span></span>}
                          {dl&&dl!=="generating"&&<a href={dl} download="ats_resume.docx" style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,196,163,.18)",border:"1px solid rgba(0,196,163,.45)",color:C.accent,padding:"5px 11px",borderRadius:7,fontSize:12,fontWeight:700,textDecoration:"none"}}>⬇ Save .docx</a>}
                          <button onClick={()=>doCopy(msg.content,i,setCopied)} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.06)",border:`1px solid ${C.border}`,color:"#c8d0e8",padding:"5px 9px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>{copied===i?"✓ Copied":"⎘ Copy"}</button>
                        </div>
                        {msg.latex&&(
                          <div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${C.border}`}}>
                            <div style={{fontSize:11,color:C.muted,marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                              <span style={{color:msg.templateAccent}}>λ</span>
                              <span style={{fontWeight:600,color:msg.templateAccent}}>{msg.templateName}</span>
                              <span style={{color:C.hint}}>· {tmplInfo?.engine}</span>
                            </div>
                            {tmplInfo?.custom&&<div style={{fontSize:11,color:C.warn,background:C.warnDim,border:"1px solid rgba(212,169,63,.25)",borderRadius:6,padding:"4px 8px",marginBottom:5,lineHeight:1.5}}>⚠ Use <strong>Open on Overleaf</strong> — replace .tex in that project (not a blank one).</div>}
                            {health&&!health.ok&&<div style={{fontSize:11,color:"#e08585",background:"rgba(224,90,90,.08)",border:"1px solid rgba(224,90,90,.2)",borderRadius:6,padding:"4px 8px",marginBottom:5}}>⚠ {health.issues.join(", ")}</div>}
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              <a href={getTexUrl(msg.latex,i)} download="ats_resume.tex" style={{display:"flex",alignItems:"center",gap:4,background:`rgba(${hexRgb(msg.templateAccent||"#9b7fd4")},.12)`,border:`1px solid rgba(${hexRgb(msg.templateAccent||"#9b7fd4")},.35)`,color:msg.templateAccent||"#b89de8",padding:"5px 10px",borderRadius:7,fontSize:12,fontWeight:700,textDecoration:"none"}}>⬇ .tex</a>
                              <button onClick={()=>doCopy(msg.latex,i,setCopiedTex)} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.06)",border:`1px solid ${C.border}`,color:"#c8d0e8",padding:"5px 10px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>{copiedTex===i?"✓ Copied!":"⎘ Copy LaTeX"}</button>
                              <a href={tmplInfo?.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,background:C.raised,border:`1px solid ${C.border}`,color:"#5ca8e8",padding:"5px 8px",borderRadius:7,fontSize:12,textDecoration:"none"}}>↗ Overleaf</a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-start"}}><Avatar type="assistant"/><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"4px 14px 14px 14px",padding:"10px 13px"}}><Dots/><div style={{fontSize:11,color:C.muted,marginTop:4}}>Optimizing + generating LaTeX ({tmpl.name})…</div></div></div>}
      </div>
      {/* input */}
      <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,padding:"9px 14px 12px",flexShrink:0}}>
        {!chat.fileInfo&&<div style={{fontSize:11,color:"#d4b060",background:"rgba(255,200,0,.06)",border:"1px solid rgba(255,200,0,.12)",borderRadius:7,padding:"4px 9px",marginBottom:6}}>⚠ Upload your resume first</div>}
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea value={jd} onChange={e=>setJd(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))send();}}
            placeholder={runtime.fileData?"Paste the job description here… (Ctrl+Enter)":"Upload resume first…"}
            disabled={!runtime.fileData||loading} rows={3}
            style={{flex:1,boxSizing:"border-box",background:C.raised,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 11px",color:C.text,fontSize:13,lineHeight:1.55,resize:"none",minHeight:68,maxHeight:150,outline:"none",fontFamily:"inherit",opacity:runtime.fileData&&!loading?1:.45,transition:"border-color .15s"}}/>
          <button onClick={send} disabled={!canSend} style={{background:canSend?C.accent:C.hint,color:canSend?"#001a14":C.muted,border:"none",borderRadius:10,padding:"0 13px",cursor:canSend?"pointer":"not-allowed",fontWeight:700,fontSize:13,height:38,flexShrink:0,transition:"all .15s"}}>Send ↑</button>
        </div>
        <div style={{fontSize:10.5,color:C.hint,marginTop:4,display:"flex",gap:6}}>
          <span>Ctrl+Enter</span><span>·</span>
          <span style={{color:tmpl.accent,fontWeight:600}}>{tmpl.name}</span><span>·</span>
          <span>.docx + .tex</span>
        </div>
      </div>
    </div>
  );
}

/* ══ SIDEBAR ══ */
function Sidebar({chats,activeChatId,onNewChat,onSelect,onDelete,onRename}){
  const[renaming,setRenaming]=useState(null);
  const[renameVal,setRenameVal]=useState("");
  const[hov,setHov]=useState(null);
  const renRef=useRef(null);
  useEffect(()=>{if(renaming)renRef.current?.focus();},[renaming]);
  const groups=groupChats(chats);
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* logo */}
      <div style={{padding:"14px 12px 8px",display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
        <div style={{width:28,height:28,borderRadius:7,background:C.accentDim,border:"1px solid rgba(0,196,163,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✦</div>
        <div><div style={{fontSize:12.5,fontWeight:700,color:C.text}}>ATS Optimizer</div><div style={{fontSize:9.5,color:C.muted}}>Resume AI</div></div>
      </div>
      {/* new chat */}
      <div style={{padding:"0 8px 6px",flexShrink:0}}>
        <button onClick={onNewChat} style={{width:"100%",display:"flex",alignItems:"center",gap:7,background:"rgba(0,196,163,.1)",border:"1px solid rgba(0,196,163,.25)",borderRadius:8,padding:"7px 11px",cursor:"pointer",color:C.accent,fontSize:12,fontWeight:600}}>
          <span style={{fontSize:15,lineHeight:1}}>＋</span> New Chat
        </button>
      </div>
      {/* list */}
      <div style={{flex:1,overflowY:"auto",padding:"0 5px 8px",minHeight:0}}>
        {Object.entries(groups).map(([group,items])=>{
          if(!items.length)return null;
          return(
            <div key={group}>
              <div style={{fontSize:10,fontWeight:600,color:C.hint,padding:"7px 7px 3px",letterSpacing:".4px",textTransform:"uppercase"}}>{group}</div>
              {items.map(c=>{
                const active=c.id===activeChatId,isHov=hov===c.id;
                return(
                  <div key={c.id} onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
                    style={{position:"relative",borderRadius:7,marginBottom:1,background:active?"rgba(0,196,163,.1)":isHov?"rgba(255,255,255,.04)":"transparent",borderLeft:`2px solid ${active?C.accent:"transparent"}`,transition:"all .12s"}}>
                    {renaming===c.id?(
                      <div style={{padding:"5px 7px"}}>
                        <input ref={renRef} value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter"){onRename(c.id,renameVal);setRenaming(null);}if(e.key==="Escape")setRenaming(null);}}
                          onBlur={()=>{onRename(c.id,renameVal);setRenaming(null);}}
                          style={{width:"100%",boxSizing:"border-box",background:C.raised,border:`1px solid ${C.accent}`,borderRadius:4,padding:"3px 6px",color:C.text,fontSize:11.5,outline:"none"}}/>
                      </div>
                    ):(
                      <button onClick={()=>onSelect(c.id)} style={{width:"100%",textAlign:"left",background:"transparent",border:"none",padding:"6px 7px 4px",cursor:"pointer",display:"block"}}>
                        <div style={{fontSize:12,fontWeight:500,color:active?C.text:"#b0b8d0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:isHov?38:0,transition:"padding .1s"}}>{c.title}</div>
                        <div style={{fontSize:9.5,color:C.hint,marginTop:1}}>{c.messages.length} msg{c.messages.length!==1?"s":""} · {relTime(c.updatedAt)}</div>
                      </button>
                    )}
                    {isHov&&renaming!==c.id&&(
                      <div style={{position:"absolute",right:3,top:"50%",transform:"translateY(-50%)",display:"flex",gap:2}}>
                        <button title="Rename" onClick={e=>{e.stopPropagation();setRenaming(c.id);setRenameVal(c.title);}} style={{background:"rgba(255,255,255,.08)",border:"none",color:C.muted,width:20,height:20,borderRadius:4,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✎</button>
                        <button title="Delete" onClick={e=>{e.stopPropagation();if(confirm("Delete this chat?"))onDelete(c.id);}} style={{background:"rgba(224,90,90,.15)",border:"none",color:"#e06060",width:20,height:20,borderRadius:4,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {chats.length===0&&<div style={{padding:"20px 8px",textAlign:"center",color:C.hint,fontSize:11}}>No chats yet.<br/>Click <strong style={{color:C.accent}}>New Chat</strong> to start.</div>}
      </div>
    </div>
  );
}

/* ══ ROOT APP ══ */
export default function App(){
  const[chats,setChats]=useState([]);
  const[activeChatId,setActiveChatId]=useState(null);
  const[runtimes,setRuntimes]=useState({});
  const[manualCopy,setManualCopy]=useState(null);
  const[sidebarOpen,setSidebarOpen]=useState(true);
  const[jszipReady,setJszipReady]=useState(false);
  const[hydrated,setHydrated]=useState(false);

  /* load JSZip */
  useEffect(()=>{
    if(window.JSZip){setJszipReady(true);return;}
    const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";s.onload=()=>setJszipReady(true);document.head.appendChild(s);
  },[]);

  /* inject global styles into <head> so they don't fight the iframe layout */
  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=`
      html,body,#root{height:100%;overflow:hidden;}
      body{margin:0;padding:0;background:#090b13;}
      *{box-sizing:border-box;}
      @keyframes blink{0%,100%{opacity:.25;transform:scale(.75)}50%{opacity:1;transform:scale(1)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#2a2d3e;border-radius:4px}
      textarea:focus{border-color:rgba(0,196,163,.4)!important;box-shadow:0 0 0 2px rgba(0,196,163,.08)!important}
      textarea::placeholder{color:#3a3f56}
      [contenteditable]:focus{outline:2px solid rgba(0,196,163,.35)!important;border-radius:2px}
    `;
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  /* hydrate from artifact storage — never blocks render */
  useEffect(()=>{
    // Failsafe: always hydrate within 800ms even if storage hangs
    const timer=setTimeout(()=>setHydrated(true),800);
    (async()=>{
      try{
        const cr=await window.storage.get("chats");
        const ar=await window.storage.get("active_chat");
        const saved=cr?JSON.parse(cr.value):[];
        if(saved.length>0){
          setChats(saved);
          const active=ar?.value;
          if(active&&saved.find(c=>c.id===active))setActiveChatId(active);
          else setActiveChatId(saved[saved.length-1].id);
        }
      }catch{ /* first load or storage unavailable — fine, start fresh */ }
      clearTimeout(timer);
      setHydrated(true);
    })().catch(()=>{ clearTimeout(timer); setHydrated(true); });
    return()=>clearTimeout(timer);
  },[]);

  /* persist chats */
  useEffect(()=>{
    if(!hydrated)return;
    try{ window.storage.set("chats",JSON.stringify(chats)).catch(()=>{}); }catch{}
  },[chats,hydrated]);
  useEffect(()=>{
    if(!activeChatId)return;
    try{ window.storage.set("active_chat",activeChatId).catch(()=>{}); }catch{}
  },[activeChatId]);

  const newChat=useCallback(()=>{
    const id=uid(),now=new Date().toISOString();
    const c={id,title:"New Chat",selectedTemplate:"harshibar",fileInfo:null,messages:[],createdAt:now,updatedAt:now};
    setChats(p=>[...p,c]);setActiveChatId(id);
  },[]);
  const updateChat=useCallback((id,partial)=>{setChats(p=>p.map(c=>c.id===id?{...c,...partial}:c));},[]);
  const updateRuntime=useCallback((id,partial)=>{setRuntimes(p=>{const ex=p[id]??{fileData:null,dlState:{},texUrls:{}};return{...p,[id]:{...ex,...partial}};});},[]);
  const deleteChat=useCallback(id=>{
    setChats(p=>{const n=p.filter(c=>c.id!==id);if(activeChatId===id)setActiveChatId(n.length>0?n[n.length-1].id:null);return n;});
    setRuntimes(p=>{const n={...p};delete n[id];return n;});
  },[activeChatId]);
  const renameChat=useCallback((id,title)=>{if(title.trim())updateChat(id,{title:title.trim()});},[updateChat]);

  const activeChat=chats.find(c=>c.id===activeChatId)||null;
  const activeRuntime=activeChatId?(runtimes[activeChatId]??{fileData:null,dlState:{},texUrls:{}}):null;

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden",fontFamily:"-apple-system,'SF Pro Text',BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      {manualCopy&&<ManualCopyModal text={manualCopy} onClose={()=>setManualCopy(null)}/>}

      {/* ── Sidebar ── */}
      <div style={{width:sidebarOpen?242:0,minWidth:sidebarOpen?242:0,background:C.sidebar,borderRight:`1px solid ${C.border}`,flexShrink:0,overflow:"hidden",transition:"width .2s,min-width .2s"}}>
        <Sidebar chats={chats} activeChatId={activeChatId} onNewChat={newChat} onSelect={setActiveChatId} onDelete={deleteChat} onRename={renameChat}/>
      </div>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        {/* header */}
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <button onClick={()=>setSidebarOpen(p=>!p)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {sidebarOpen?"◂":"▸"}
          </button>
          <div style={{fontWeight:600,fontSize:13.5,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>
            {activeChat?.title||"ATS Resume Optimizer"}
          </div>
          {!activeChat&&(
            <button onClick={newChat} style={{display:"flex",alignItems:"center",gap:6,background:C.accentDim,border:"1px solid rgba(0,196,163,.25)",color:C.accent,padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0}}>
              ＋ New Chat
            </button>
          )}
        </div>

        {/* chat / empty state */}
        {activeChat&&activeRuntime?(
          <ChatWindow
            chat={activeChat} runtime={activeRuntime}
            onUpdateChat={p=>updateChat(activeChat.id,p)}
            onUpdateRuntime={p=>updateRuntime(activeChat.id,p)}
            onSetManualCopy={setManualCopy}
          />
        ):(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:36,textAlign:"center"}}>
            <div style={{fontSize:48}}>✦</div>
            <div style={{fontSize:20,fontWeight:700,color:C.text}}>ATS Resume Optimizer</div>
            <div style={{fontSize:13,color:C.muted,maxWidth:380,lineHeight:1.7}}>
              Start a new chat for each job application. Each chat keeps its own resume, template, and message history — just like Claude or ChatGPT.
            </div>
            <button onClick={newChat} style={{background:C.accent,color:"#001a14",border:"none",borderRadius:10,padding:"10px 26px",cursor:"pointer",fontWeight:700,fontSize:14,marginTop:4}}>
              ＋ Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
