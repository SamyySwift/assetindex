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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamyySwift/assetindex.git
   cd assetindex
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/assetindex
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assetindex

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# CORS (optional)
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
Create a `.env.local` file in the `frontend` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:8000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

#### Production Mode

1. **Build the backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Cron Jobs
- `GET /api/cron/jobs` - Get scheduled jobs
- `POST /api/cron/jobs` - Create new scheduled job

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Samuel Okon**
- GitHub: [@SamyySwift](https://github.com/SamyySwift)
- Email: samueludofia94@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database
- All contributors and users of this project

---

Made with ❤️ by [Samuel Okon](https://github.com/SamyySwift)
