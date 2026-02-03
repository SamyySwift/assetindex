# AssetIndex 📊

A modern, full-stack asset management application built with Next.js and Express. Track, manage, and organize your assets with a beautiful, responsive interface and robust backend API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-9.1.5-green?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey?style=flat-square&logo=express)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📦 **Asset Management** - Create, read, update, and delete assets with ease
- 👥 **User Management** - Comprehensive user profile and account management
- 📞 **Contact Management** - Store and manage contact information
- ⏰ **Scheduled Tasks** - Automated cron jobs for recurring operations
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- ⚡ **Real-time Updates** - Smooth animations with Framer Motion and GSAP
- 🔒 **Protected Routes** - Middleware-based route protection
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 3.4.19
- **Animations**: Framer Motion 12.31.0, GSAP 3.14.2
- **Smooth Scrolling**: Lenis 1.3.17
- **Icons**: Lucide React 0.563.0
- **Language**: TypeScript 5.x

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.1.5
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcryptjs 3.0.3
- **Security**: Helmet 8.1.0, CORS 2.8.6
- **Logging**: Morgan 1.10.1
- **Language**: TypeScript 5.9.3

## 📁 Project Structure

```
assetindex/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── dashboard/   # Dashboard pages
│   │   │   └── disclosure/  # Disclosure pages
│   │   ├── components/      # Reusable React components
│   │   └── lib/             # Utility functions and helpers
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route controllers
│   │   │   ├── assetController.ts
│   │   │   ├── authController.ts
│   │   │   ├── contactController.ts
│   │   │   ├── cronController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Asset.ts
│   │   │   ├── Contact.ts
│   │   │   └── User.ts
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Express server entry point
│   └── package.json
│
└── README.md
```




