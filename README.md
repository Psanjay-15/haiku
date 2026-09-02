# Hair & Scalp Intake

A patient-friendly medical intake that turns a fixed 16-question hair and scalp form into a guided, visual experience that works on both phones and laptops.

**Live app:** [https://haiku-neon.vercel.app](https://haiku-neon.vercel.app)

---

## Overview

This is a full-stack intake application designed for patients visiting a hair clinic. It collects the clinic's required answers without presenting one long, tiring form.

The experience follows a simple five-part journey:

1. Share hair-loss history and select the closest visual pattern
2. Answer relevant hormonal and health questions
3. Add lifestyle and environmental triggers
4. Record products, treatments, and their outcomes
5. Choose a sample type, provide consent, review, and submit

The form definition and answer options come from the backend. The frontend focuses on choosing the right interaction for each question and keeping the experience clear and forgiving.

---

## Features

**Patient experience**

- Five focused sections instead of one long form
- Large tap targets and responsive layouts for phone and desktop
- Visual cards for identifying common hair-loss patterns
- Conditional questions: menstrual, pregnancy, and PCOS/PCOD fields are skipped for patients who select Male
- Progressive disclosure for treatment details and follow-up questions
- Automatic progress saving in `localStorage`, so an accidental refresh does not erase answers
- Clear loading, error, validation, submission, and success states

**Accuracy and review**

- Fixed options are served by the backend instead of being duplicated in the frontend
- Pydantic validates the complete medical payload and its conditional rules
- “Other” answers preserve information that does not fit a fixed option
- Patients can review every answer and return directly to the relevant section to edit it
- The final doctor-friendly summary can be printed or saved as a one-page PDF
- Answers are sent to the backend only after final submission

---

## Architecture

```mermaid
flowchart LR
    P[Patient] --> R[React intake UI]
    R -->|GET /intake-form| F[FastAPI]
    F -->|Active versioned form| S[(Supabase Postgres)]
    R -->|Draft progress| L[(Browser localStorage)]
    R -->|POST /intakes after review| F
    F -->|Pydantic validation| V[Validated intake]
    V --> S
    R -->|Print / Save as PDF| D[Doctor-friendly summary]
```

The browser keeps unfinished answers locally. FastAPI serves the current form definition and accepts one final, complete submission. Supabase provides hosted PostgreSQL storage.

| Piece             | Responsibility                                                      |
| ----------------- | ------------------------------------------------------------------- |
| React client      | Patient journey, interactions, local progress, review, print layout |
| FastAPI API       | Form delivery, payload validation, persistence, health checks       |
| Pydantic          | Fixed schema and conditional validation                             |
| SQLAlchemy        | Database models and queries                                         |
| Supabase Postgres | Versioned form definitions and submitted intakes                    |

---

## Important product rules

- A submitted intake must contain all 16 required answers in the fixed schema.
- Selecting **No known family history** excludes every other family-history option.
- Selecting **None** for diagnosed conditions excludes every diagnosed condition.
- Male patients do not see menstrual or pregnancy questions; both are recorded as **Not applicable**.
- Treatment details are required only when a product was used or a procedure was done.
- A side-effect description is required only when the patient answers **Yes**.
- Consent is never preselected and is stored exactly as answered.
- Unfinished progress stays on the patient's device and is removed after successful submission.

---

## Tech stack

| Layer       | Stack                                             |
| ----------- | ------------------------------------------------- |
| Frontend    | React, JavaScript, Vite, styled-components, Axios |
| Backend     | Python, FastAPI, Pydantic                         |
| Data access | SQLAlchemy, Psycopg                               |
| Database    | Supabase PostgreSQL                               |

---

## Run locally

### Prerequisites

- Node.js 20+
- Python 3.11+
- A Supabase project

### 1. Configure the backend

```bash
cd server
cp .env.example .env
```

Set these values in `server/.env`:

```env
PORT=8000
DATABASE_URL=postgresql+psycopg://postgres.PROJECT_REF:URL_ENCODED_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require
FRONTEND_URL=http://localhost:5173
```

Use the Supabase transaction or session pooler connection string and replace its password placeholder with a URL-encoded database password.

### 2. Start the API

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI creates the required tables and seeds the active form definition on startup. The API is available at `http://localhost:8000`, with Swagger at `http://localhost:8000/docs`.

### 3. Configure and start the client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The client environment contains:

```env
VITE_API_URL=http://localhost:8000
```

Open `http://localhost:5173`.

---

## Design decisions

- **Question-specific interactions:** visual cards, chip grids, yes/no controls, and expanding treatment rows are easier to scan than repeating text boxes.
- **Backend-driven form:** labels, options, ordering, and the active form version have one source of truth.
- **Local draft, final API submission:** refresh recovery is provided without building draft-session APIs or storing incomplete medical records.
- **Explicit confirmation:** the patient sees a readable summary and can edit any section before data leaves the device.
- **Simple deployment:** Vercel, Render, and Supabase provide a working hosted product without custom infrastructure.

---
