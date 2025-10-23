# 🧠 Job Listing Platform

A full-stack web application for actuarial job listings, scraped from [Actuary List](https://www.actuarylist.com).  
The project demonstrates backend development with Flask, frontend with React, and automated web scraping using Selenium.

---

## 🚀 Project Overview

**Goal:**  
To build a job board that automatically scrapes actuarial job data from a public website, stores it in a backend database, and displays it via a frontend interface.

**Features:**
- Scrapes jobs using Selenium
- Stores job data in a Flask + SQLAlchemy backend
- Displays jobs in a React frontend
- Handles duplicates and cleans messy data (removes emojis, `N/A`s)
- Parses posting dates like `10h ago`, `2d ago` into proper datetime

---

## 🏗️ Project Structure

### 1. Backend (backend/)
- Receives job data from scraper or frontend.
- Stores jobs in the database (MySQL / SQLite) using SQLAlchemy.
- Provides API endpoints (GET /api/getAllJobs, POST /api/createJob, POST /api/jobs/bulk, Delete /api/removeJob, put/patch /api/updateJob) for frontend and scraper.

### 2. Scraper (scraper/scrape.py)
- Uses Selenium to get job data (title, company, location, salary, tags, posting date) from ActuaryList.
- Cleans and formats the data.
- Sends JSON payload to backend API (/api/jobs/bulk) via HTTP POST.

### 3. Frontend (frontend/)
- Fetches job data from backend API (GET /api/getAllJobs).
- Displays job listings in cards with filters, tags, and other info.
- Users interact with UI; frontend requests backend for data dynamically.

##  Setup Instructions

### 1. Backend and scrapper Setup (Flask)

#### Prerequisites
- Python 3.10+
- pip

### All backend and scrapper can be run with a single command. Go to the root folder you will find a file named "run.py", just run the file using python run.py. backend will up and after a while scrapper starts
 - Flask API server will at: http://localhost:5000
### 2. Frontend (React)

### For the frontend, go to frontend directory and run the commands
1. npm install
2. npm run dev (after installing the packages)

 - Frontend runs at: http://localhost:5173

# Assumptions
1. location and tags fields remove "N/A" entries
2. Posting dates default to today if missing or invalid
3. Duplicate jobs are skipped based on title + company combination
4. Scraper uses headless Chrome for speed and stability

# Technology Design
1. Flask + SQLAlchemy: Lightweight, easy to use for API + ORM
2. React + Tailwind: Quick, responsive frontend
3. Selenium: Best for dynamic scraping of JS-heavy sites
4. Clean Text Functions: Ensures consistent database entries