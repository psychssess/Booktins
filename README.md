# 📚 BookTins

> **BookTins** is a browser-based publishing studio that transforms raw manuscripts or simple book ideas into polished, publish-ready eBooks and print files—all without installing desktop software.

---

## ✨ Overview
BookTins lets authors, educators, and indie publishers **upload**, **edit**, **design**, and **publish** books directly in the browser.  
From Word document parsing to AI-powered content generation and one-click export to PDF or EPUB, BookTins removes the technical barriers to professional publishing.

---

## 🚀 Key Features
- **Word-to-HTML Conversion:** Drag-and-drop `.doc`/`.docx` files; clean conversion via **Mammoth.js**.
- **Rich Editor & Layout:** WYSIWYG editing with live pagination and typography controls.
- **Design & Cover Studio:** Global themes, fonts, spacing options, and a built-in HTML5 Canvas cover designer.
- **AI-Powered Creation:** Generate outlines, chapters, or entire books using Qwen/OpenAI APIs.
- **Export & Publish:** One-click export to PDF/EPUB or direct push to Amazon KDP and Gumroad.
- **Cloud Storage & Auth:** Backed by **Supabase** (PostgreSQL database, Storage, and Auth).

---

## 🖼 Screenshots
_Add screenshots or GIFs here once you have them—UI, editor, and cover designer previews._

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express
- **Database & Auth:** Supabase (PostgreSQL + Storage + Auth)
- **AI Layer:** Qwen API / OpenAI API
- **File Handling:** Mammoth.js, jsPDF, EPUB.js

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- Supabase project & API keys
- (Optional) Qwen/OpenAI API key for AI features

### Installation
```bash
git clone https://github.com/your-username/booktins.git
cd booktins
npm install
