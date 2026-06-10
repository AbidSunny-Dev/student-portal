# Academic Management Platform

A web-based academic management platform designed for university students and administrators. This project centralizes routines, notices, assignments, faculty information, study materials, and automates semester-wise GPA and CGPA calculations using the Bangladesh University Grants Commission (UGC) grading system.

Built with **React (Vite)**, **Tailwind CSS**, and **Lucide React**, this project also includes a comprehensive **MySQL schema** to showcase database management systems (DBMS) concepts.

---

## 🚀 Key Features

### 👤 Student Portal
- **Dashboard**: Quick stats showing upcoming deadlines, latest notices, GPA trend graph using Recharts, and today's classes.
- **Notice Board**: Displays announcements tagged with priority levels (High 🔴, Medium 🟡, Low 🟢) and searchable by category.
- **Assignment Tracker**: Features active countdown timers, status tracking (Pending/Submitted/Overdue), and submission options.
- **Class Routine**: Interactive weekly grid showing class times, rooms, courses, and faculty names.
- **Study Materials**: Searchable resource list sorted by subject and semester.
- **My Results**: Visual grade distribution donut chart, semester GPA calculation, and overall CGPA calculation.
- **CGPA Calculator & Predictor**: Add/edit mock semester results to perform "what-if" calculations for future semesters.
- **Question Bank**: Repository of past mid-term and final exam papers.

### ⚙️ Admin Panel
- **Manage Students & Results**: View registrations, add grades, and update student records.
- **Notice Board & Assignment CRUD**: Post and edit notices (with priority settings) and assignments.
- **Routine Editor**: Manage timeslots, subjects, rooms, and assigned faculty.
- **Faculty & Course Management**: Maintain instructor list and configure course credit loads.
- **Study Materials & Question Bank Upload**: Distribute resources and archive past exam questions.

---

## 💻 Tech Stack

- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS, CSS Grid, Glassmorphism
- **Routing**: React Router v7
- **Data Visualization**: Recharts (Donut & Area Charts)
- **Icons**: Lucide React
- **Database**: MySQL (5.7.8+ for JSON support)

---

## 🗄️ Database Design (DBMS)

The platform represents a robust relational model mapping 10 core entities. Database assets are stored in the `/database` directory:

1. [schema.sql](file:///d:/Dbms%20project%20by%20gemini/database/schema.sql): Contains the full DDL (Data Definition Language) with primary keys, foreign keys (`ON DELETE CASCADE` and `ON DELETE SET NULL` constraints), indexes for performance optimization, and `CHECK` constraints (e.g., credit validation, grade points, sections).
2. [sample_data.sql](file:///d:/Dbms%20project%20by%20gemini/database/sample_data.sql): Seed data containing demo users, faculty, courses, past semester results, notices, assignments, and sample question banks.
3. [ER_diagram.md](file:///d:/Dbms%20project%20by%20gemini/database/ER_diagram.md): Contains the Mermaid Entity-Relationship diagram showing how entities interconnect.

---

## 🛠️ Installation & Setup

### 1. Frontend Setup
1. Clone or extract this repository into your workspace.
2. In the project directory, run to install dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### 2. Database Schema Import
If using MySQL (via Command Line, Workbench, or phpMyAdmin):
1. Create the database:
   ```sql
   CREATE DATABASE academic_management;
   ```
2. Import the schema file first:
   ```bash
   mysql -u root -p academic_management < database/schema.sql
   ```
3. Import the sample data:
   ```bash
   mysql -u root -p academic_management < database/sample_data.sql
   ```

---

## 🔑 Demo Login Credentials

You can use the built-in quick demo buttons on the login screen or type the following:

### 👤 Student Account (Full mock history)
- **Email**: `arif.hossain@student.metrouni.edu.bd`
- **Password**: `student123`

### ⚙️ Admin Account (Write/Edit privileges)
- **Email**: `admin@metrouni.edu.bd`
- **Password**: `admin123`

---

## 🌐 Deployment

Since this is a Single Page Application (SPA) utilizing React Router, redirect configurations have been pre-configured:

### Deploying to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or connect your GitHub repository to Vercel.
2. Build Settings are automatically detected:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Single Page Application routing redirects are handled via the configured [vercel.json](file:///d:/Dbms%20project%20by%20gemini/vercel.json).

### Deploying to Netlify
1. Connect your repository to Netlify.
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. SPA routing is managed via the configured [netlify.toml](file:///d:/Dbms%20project%20by%20gemini/netlify.toml).

