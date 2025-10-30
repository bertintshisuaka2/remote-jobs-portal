# Remote Tech Jobs Portal

A professional job search portal featuring curated remote software engineering positions with tailored application materials.

![Divalaser Software Solutions](https://img.shields.io/badge/Powered%20by-Divalaser%20Software%20Solutions-yellow?style=for-the-badge)

## Overview

The Remote Tech Jobs Portal is a comprehensive web application designed to streamline the job search process for software engineers and developers. It features 26 carefully curated remote job opportunities, each accompanied by professionally tailored resumes and cover letters.

## Features

### 🎯 Job Listings
- **26 Active Remote Positions** across various technologies and experience levels
- **Detailed Job Information** including salary, requirements, and benefits
- **Direct Application Links** to original job postings
- **Advanced Search & Filtering** by keywords, category, and job type

### 📄 Application Materials
- **Tailored Resumes** - Custom resume for each position highlighting relevant skills
- **Custom Cover Letters** - Personalized cover letter for every job
- **Letter of Recommendation** - Professional reference letter
- **PDF Preview** - View documents in-browser before downloading
- **One-Click Download** - Download all application materials instantly

### 🎨 Professional Design
- **Divalaser Branding** - Black and yellow corporate theme
- **Dark Mode Interface** - Easy on the eyes with sky blue accents
- **Responsive Layout** - Works perfectly on all devices
- **Modern UI** - Built with React and Tailwind CSS

### 🔐 Security
- **PIN Authentication** - Secure access with 4-digit PIN
- **Session Management** - Automatic logout functionality
- **Protected Routes** - Login required to access job listings

## Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Wouter** - Lightweight routing
- **shadcn/ui** - Beautiful component library

### Build Tools
- **Vite** - Fast development and build
- **pnpm** - Efficient package management

### Deployment
- **Static Hosting** - Optimized for CDN deployment
- **Auto-scaling Infrastructure** - Global CDN support

## Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bertintshisuaka2/remote-jobs-portal.git
cd remote-jobs-portal
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Default Login
- **PIN:** 2384

## Project Structure

```
remote-jobs-portal/
├── client/
│   ├── public/
│   │   ├── resumes/           # PDF resumes for all jobs
│   │   ├── cover_letters/     # PDF cover letters
│   │   ├── jobs.json          # Job listings data
│   │   └── business_card_enhanced.png
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx      # Main job listings page
│   │   │   ├── Documents.tsx # Document library
│   │   │   └── Login.tsx     # Authentication page
│   │   ├── contexts/         # React contexts
│   │   └── App.tsx           # Main application component
│   └── index.html
├── package.json
└── README.md
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run TypeScript type checking

## Job Categories

The portal features positions in the following categories:

- **Full Stack Development** - React, Node.js, Ruby on Rails, Python
- **Cloud Engineering** - AWS, Azure, DevOps
- **Backend Development** - Python, Node.js, Java
- **Frontend Development** - React, TypeScript, JavaScript
- **AI & Machine Learning** - LLMs, RAG, Automation
- **Quality Assurance** - Software Testing, QA Engineering

## Application Materials

Each job listing includes three professionally crafted documents:

### Resume
- Tailored to specific job requirements
- Highlights relevant technical skills
- Emphasizes transferable experience from 18+ years in maintenance engineering
- Showcases education: BS in Software Engineering, Georgia Tech Bootcamp, QA Certification

### Cover Letter
- Customized for each company and position
- Demonstrates understanding of job requirements
- Explains career transition and unique value proposition
- Professional tone and formatting

### Letter of Recommendation
- Universal reference letter
- Highlights professional qualities and achievements
- Suitable for all applications

## Contact Information

**KABUNDI Tshisuaka**
- **Location:** 365 Starbuck Parkway, GA 30567
- **Phone:** (678) 979-6811
- **Email:** bertintshisuaka2025@gmail.com
- **LinkedIn:** [linkedin.com/in/bertintshisuaka](https://linkedin.com/in/bertintshisuaka)

## About Divalaser Software Solutions

This portal is powered by Divalaser Software Solutions, showcasing expertise in:
- Full-stack web development
- Modern React applications
- Professional UI/UX design
- Document management systems
- Secure authentication systems

## License

This project is private and proprietary.

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Developed by Divalaser Software Solutions

---

**© 2025 Divalaser Software Solutions. All rights reserved.**

