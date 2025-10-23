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

job-listing-platform/
│
├── backend/
│ ├── app.py # Flask app entry point
│ ├── models.py # SQLAlchemy models
│ ├── controllers/
│ │ └── job_controller.py # CRUD and bulk insert functions
│ ├── requirements.txt
│ └── .env.example
│
├── scraper/
│ └── scrape.py # Selenium scraper
├── frontend/
│ ├── src/
│ ├── components/
| |      ├── JobForm.jsx
| |      ├── JobCard.jsx
| |      ├── Message.jsx
| |      ├── FilterBar.jsx
│ │ └── App.jsx
│ ├── package.json
│ └── vite.config.js
│
└── README.md

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