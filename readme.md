#  Project Management & Health Monitoring System

## Project Overview

This project is a **Project Management and Monitoring System** designed to track project progress, employee check-ins, client feedback, risks, and overall project health.

The system automatically calculates a **Project Health Score (0–100)** based on real project data such as client satisfaction, employee confidence, progress vs timeline, and active risks or issues.  
Based on this score, each project is categorized as **On Track**, **At Risk**, or **Critical**.

The platform supports **role-based access** for Admins, Employees, and Clients, ensuring secure and relevant interactions for each user type.



##  Tech Stack Used

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod Resolver
  

### Backend
- Node.js
- Express.js (REST API)
- TypeScript
- Zod Validation
- MongoDB with Mongoose
- JWT Authentication





##  Backend Choice

**Backend Framework:**  Express.js (REST API)


## Setup Instructions

### Clone the Repository
```bash

git clone https://github.com/siam9192/Client-Feedback-Project-Health-Tracker.git

```
### Backend

#### Setup Environment Variables

Create a `.env` file in the root folder of the project and update it with your own values:

```bash
ENVIRONMENT="development" # or "production"
DATABASE_URL=your_mongodb_db_url
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRE= 7d
JWT_REFRESH_TOKEN_EXPIRE=30d
CLIENT_ORIGIN="client url"

```
```bash
cd project-name/backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev 
```

#### Setup Environment Variables

Create a `.env` file in the root folder of the project and update it with your own values:


```bash

NEXT_PUBLIC_API_BASE_URL = "server api url"

```

## Databse Seeding

The project includes a seed script to populate the database with **initial demo data** (users, projects, riks).

### Location
/backend/src/app/seed/script.ts


###  Run Seed Script

```bash
npm run seed
```

## API Endpoints

---

###  Authentication
| Method | Endpoint                     | Description                                      |
| ------ | ---------------------------- | ------------------------------------------------ |
| POST   | `/api/v1/auth/login`         | Authenticate user and return access & refresh tokens |
| GET    | `/api/v1/auth/accesstoken`  | Generate a new access token using a refresh token |



###  User Management
| Method | Endpoint                         | Description                                                         |
| ------ | -------------------------------- | ------------------------------------------------------------------- |
| GET    | `/api/v1/users/me`               | Get the currently logged-in user's profile                          |
| GET    | `/api/v1/users/clients`          | Get a list of clients                                               |
| GET    | `/api/v1/users/employees`        | Get a list of employees with **active** account status (auth required) |



###  Project Management
| Method | Endpoint                                        | Description                                               |
| ------ | ----------------------------------------------- | --------------------------------------------------------- |
| POST   | `/api/v1/projects`                              | Create a new project                                       |
| GET    | `/api/v1/projects/:id`                          | Get project details by ID                                  |
| GET    | `/api/v1/projects/assigned`                     | Get projects assigned to the current user                 |
| GET    | `/api/v1/projects/missing-checkins`            | Get projects missing recent employee check-ins            |
| GET    | `/api/v1/projects/high-risks`                  | Get projects with high-risk issues                        |
| GET    | `/api/v1/projects/:projectId/employee-feedbacks` | Get employee feedbacks for a project                       |
| GET    | `/api/v1/projects/:projectId/employee-checkins` | Get employee check-ins for a project                       |
| GET    | `/api/v1/projects/:projectId/activity-timelines` | Get activity timelines for a project                       |
| GET    | `/api/v1/projects/health-group`                          | Get health  group data                               |



###  Employee Check-in Management
| Method | Endpoint                                   | Description                           |
| ------ | ------------------------------------------ | ------------------------------------- |
| POST   | `/api/v1/employee-checkins`                | Create a new employee check-in        |
| GET    | `/api/v1/employee-checkins/pending`       | Get pending check-ins for employees   |



###  Client Feedback Management
| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/api/v1/client-feedbacks`       | Submit new client feedback        |
| GET    | `/api/v1/client-feedbacks`       | Get all client feedbacks          |



### Project Risk Management
| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| POST   | `/api/v1/project-risks`      | Create a new project risk        |
| GET    | `/api/v1/project-risks`      | Get all project risks            |



## Project Health Score Calculation
The **Project Health Score** is an automated metric (scaled 0–100) calculated by weighing four distinct performance pillars. This score determines the project's official status (e.g., Healthy, At Risk, or Critical).



## 1. Score Composition (Weights)
The final score is calculated as a weighted sum of the following four components.

| Pillar                | Weight | Data Source                                         |
|-----------------------|--------|---------------------------------------------------|
| Client Satisfaction   | 30%    | Average of recent `satisfactionRating` (1–5)     |
| Employee Confidence   | 25%    | Average of recent `confidenceLevel` (1–5)       |
| Project Progress      | 25%    | Actual progress vs. expected progress            |
| Risks & Issues        | 20%    | Count and severity of Open Risks & Flagged Issues |



## 2. Pillar Breakdown

###  Client & Employee Sentiment
These pillars convert qualitative feedback into a 0–100 score.

- **Active Reporting:**  
  `(Average Rating / 5) * 100` based on the last 2 weeks of data.
- **Missing Data Handling:**  
  - **New Projects:** If the project started this week → default 100 points.  
  - **No History:** If no feedback has ever been submitted → 0 points.  
  - **Lapsed Reporting:** If history exists but nothing in the last 2 weeks → 50 points.



###  Project Progress
This measures if the project is "on schedule" based on the calendar.

- **Expected Progress:** Where the project should be based on the elapsed time between start and end dates.
- **Calculation:**  
  - If `Actual % >= Expected %` → 100 points  
  - If `Actual % < Expected %` → `100 - (Difference * 2)`  
- **Example:**  
  If the project is 10% behind schedule → score = 80 points



###  Risks & Issues
This acts as a **penalty pillar** starting from 100 points.

- **Risk Deductions:**  
  - High Severity Risk → −15 pts  
  - Medium Severity Risk → −10 pts  
  - Low Severity Risk → −5 pts
- **Issue Deductions:** Each flagged client issue → −5 pts
- **Critical Deadline Penalty:**  
  If the project is >90% through its timeline and risk score ≤20 → additional −20 pts

### Final Score =  
(Client Satisfaction Points × 0.30) +  
(Employee Confidence Points × 0.25) +  
(Project Progress Points × 0.25) +  
(Risk Level Points × 0.20)

###  Automated Recalculation
- The system periodically recalculates the project health score by:
  - Fetching the **latest records** from the database
  - Re-evaluating all metric values
  - Generating an updated `finalScore`
- Recalculation is triggered when:
  - New client feedback or employee check-in is submitted
  - A scheduled cron job runs
  





## Live Links & Demo Login

###  Demo Login Credentials

#### 👑 Admin
- **Email:** admin@gmail.com  
- **Password:** adm123

#### 👨‍💼 Employees
1. **Email:** arif.emp@gmail.com  
   **Password:** emp123
2. **Email:** farhana.emp@company.com   
   **Password:** emp123

#### 🧑 Clients
1. **Email:** zubair.m@example.com  
   **Password:** cli123
2. **Email:** gh.admin@example.com
   **Password:** cli123

### Live Applications
- **Frontend:** https://project-pulse.up.railway.app
- **Backend:** https://project-pulse-server.up.railway.app

