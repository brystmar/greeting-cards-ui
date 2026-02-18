# 🧠 Greeting Cards App --- CONTEXT

## 🧩 Stack & Architecture

-   Frontend: React 19 + Vite + React Router v7
-   Backend: Python REST API
-   Database: Postgres v15
-   Search: Fuse.js
-   Styling: CSS/SASS
-   Deployment: Docker + Portainer stack + custom bash deploy script
-   Runs locally on Intel NUC server

## 🧱 Global Data Layer

AppDataProvider wraps the app and exposes: - householdData -
addressData - selectedHH - hhIndex (Fuse search index) - nextIds -
loading - error - refresh()

## 🏠 Household Feature Architecture

Main UI container: HouseholdContainer.jsx

Logic extracted into hook: useHouseholdSelection.js

Responsibilities: - Selection state - Search UX - Picklist rendering -
HHInfo + AddressArray rendering

## 🔎 Search UX

-   Fuse.js fuzzy search
-   Keyboard navigation
-   Auto-select when only 1 result

Implemented via useEffect --- never during render to avoid infinite
loops.

## 🧾 Components

-   HouseholdContainer: orchestration layer
-   HHInfo: household form
-   AddressArray: maps addresses
-   AddressFields: controlled form (no null values)

Rule: value={field ?? ""}

## ⚙️ Environment Variables (Vite)

Use: import.meta.env.VITE_BACKEND_URL

NOT: process.env.REACT_APP\_\*

## 🚀 Vite Migration Notes

-   CRA removed
-   JSX files use .jsx extension
-   index.html no longer uses %PUBLIC_URL%
-   vite-env.d.ts added for typing

## 🐳 Docker Notes

-   node:20-slim
-   npm ci during build
-   Version-tagged images pushed to Docker Hub

## 🧰 Database Workflow

Postgres databases: - cards (prod) - cards-dev (dev)

Dev refresh example: pg_dump cards \| psql cards-dev

## 🎯 UX Principles

-   Avoid loading flicker
-   Controlled inputs
-   Minimal rerenders
-   Hooks-first architecture

## 💻 Coding Preferences

-   No semicolons unless required
-   Prefer double quotes
-   Clean refactors over quick hacks

## 🧠 Current State

-   Vite migration complete
-   React 19 working
-   HouseholdContainer refactored
-   Search UX enhanced
