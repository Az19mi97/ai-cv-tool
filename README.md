# Project - AI CV Engine

An AI-powered full-stack application that generates optimized CVs and cover letters tailored to specific job descriptions.  

Built with React, Express, and Cohere AI.

---

## Overview

AI CV Engine helps users instantly transform their existing CV into a **professional** and a **natural, human-written cover letter** based on a job description.

The system uses prompt engineering and structured AI outputs to ensure consistent, reliable results that can be edited and exported as PDF.

---

## Features

### AI Generation
- Converts raw CV + job description into:
  - Natural cover letter (human tone, no bullet points)
- Uses Cohere AI (`command-a-reasoning-08-2025`)
- Strict prompt engineering for high-quality structured output

---

### Backend Processing
- Parses and validates AI response from Cohere
- Ensures consistent and reliable JSON structure
- Filters and extracts only valid text output from the model
- Handles parsing errors and prevents malformed responses from breaking the frontend

---

### Frontend Rendering
- Receives structured JSON from backend (`cv` + `coverLetter`)
- Dynamically renders each document based on user selection
- Uses Markdown parsing for CV formatting and readability
- Supports live editing via `contentEditable`
- Updates UI state in real-time without page reloads

---

### System Reliability
- Ensures predictable frontend rendering through strict backend output control
- Prevents UI crashes caused by invalid or unstructured AI responses
- Maintains separation between CV and cover letter data models

---

### PDF Generation
- Converts active document view (CV or cover letter) into a downloadable PDF
- Uses `html2pdf.js` for client-side rendering
- Maintains A4 formatting and clean document styling
- Allows users to export application-ready documents instantly

---

### UX Flow
- User inputs CV + job description
- AI generates structured output via backend
- Frontend renders editable documents
- User toggles between CV and cover letter
- Final result can be exported as PDF or improved further via AI

---

### Live Editing
- Generated CV and cover letter are fully editable in-browser
- Real-time content updates using `contentEditable`
- Markdown rendering for CV formatting

---

### Iterative Improvement
- “Improve Again” feature allows users to re-optimize results
- AI refines existing CV and cover letter based on previous output

---

### Toggle Interface
- Switch between:
  - CV view
  - Cover letter view
- Clean UX similar to SaaS document editors

---

## Tech Stack

### Frontend
- React (Vite)
- Marked.js (Markdown parsing)
- html2pdf.js (PDF export)
- CSS (custom SaaS-style UI)

### Backend
- Node.js
- Express
- Cohere AI API
- CORS + JSON middleware

---

## System Architecture

User Input (CV + Job)  
↓  
React Frontend  
↓  
Express Backend (/generate)  
↓  
Cohere AI (Prompt Engine)  
↓  
Structured JSON Response  
↓  
Backend Parsing & Validation  
↓  
Frontend Rendering (CV + Cover Letter)  
↓  
Live Editing + PDF Export  

---

## AI Prompt Design

The system uses carefully engineered prompts to enforce:
- No hallucinated experience
- Clean section formatting (Summary, Experience, Skills, Education)
- Natural language cover letters (3–5 paragraphs, no bullet points)
- Strict JSON-only output format

---

## Key Design Decisions

- Structured JSON output ensures frontend reliability
- Separation of CV and cover letter improves UX clarity
- Markdown rendering allows flexible CV formatting
- Editable output makes it feel like a real document editor
- PDF export turns app into a full “apply package generator”

---

## Future Improvements

- ATS scoring system (job match %)
- Skill gap analysis
- One-click 'Apply Package' (CV + letter + email)
- User accounts + saved CV versions
- Template selection system

---

## Author

Built as a full-stack AI project focusing on:
- Prompt engineering
- SaaS UI/UX design
- Structured AI outputs
- End-to-end product thinking