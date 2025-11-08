# 💬 Learnato Forum - Discussion Forum Microservice

A modern, real-time discussion forum built with Node.js, React.js, and Tailwind CSS. This microservice is designed to plug into the Learnato ecosystem, enabling learners and instructors to post questions, share insights, and reply in real time.

![Learnato Forum](https://img.shields.io/badge/Learnato-Forum-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-purple)

## 🎯 Features

### Core Features (MVP)
- ✅ **Create Post** - Add new questions or topics with title and content
- ✅ **List Posts** - View all posts sorted by votes or date
- ✅ **View Post** - See post details and all replies
- ✅ **Add Reply** - Add replies beneath posts
- ✅ **Upvote Post** - Increment vote count for posts
- ✅ **Responsive UI** - Works smoothly on desktop and mobile

### Stretch Goals (Bonus)
- ✅ **Live Updates** - Real-time updates using Socket.io (new posts, replies, upvotes)
- ✅ **Search Bar** - Filter posts by keyword in title or content
- ✅ **Mark as Answered** - Instructors can mark questions as resolved
- ✅ **Beautiful UI** - Modern, intuitive design with Tailwind CSS
- ✅ **Real-time Notifications** - Instant updates when new posts or replies are added

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket server
- **MongoDB/Mongoose** - Database (optional, falls back to in-memory)
- **CORS** - Cross-origin resource sharing

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server (production)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Docker (optional, for containerized deployment)
- MongoDB (optional, for persistent storage)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learnato-forum
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/learnato-forum  # Optional
   ```

   Create a `.env` file in the `frontend` directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   docker-compose up --build
   ```

   This will start both backend and frontend services. Access the application at:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000

2. **Individual Docker Containers**

   **Backend:**
   ```bash
   cd backend
   docker build -t learnato-forum-backend .
   docker run -p 5000:5000 learnato-forum-backend
   ```

   **Frontend:**
   ```bash
   cd frontend
   docker build -t learnato-forum-frontend .
   docker run -p 80:80 learnato-forum-frontend
   ```

## 🚀 API Endpoints

### Posts
- `GET /api/posts` - Get all posts (optional query: `?search=keyword`)
- `GET /api/posts/:id` - Get single post with replies
- `POST /api/posts` - Create a new post
  ```json
  {
    "title": "Post title",
    "content": "Post content",
    "author": "Author name (optional)"
  }
  ```

### Replies
- `POST /api/posts/:id/reply` - Add a reply to a post
  ```json
  {
    "content": "Reply content",
    "author": "Author name (optional)"
  }
  ```

### Upvotes
- `POST /api/posts/:id/upvote` - Upvote a post

### Answers
- `POST /api/posts/:id/answer` - Mark a post as answered
  ```json
  {
    "replyId": "reply-id-to-mark-as-answer"
  }
  ```

## 📡 Real-time Events (Socket.io)

The application uses Socket.io for real-time updates:

- `newPost` - Broadcasted when a new post is created
- `newReply` - Broadcasted when a new reply is added
- `postUpvoted` - Broadcasted when a post is upvoted
- `postAnswered` - Broadcasted when a post is marked as answered

## 🎨 UI Features

- **Modern Design** - Clean, intuitive interface with gradient headers
- **Responsive Layout** - Works on desktop, tablet, and mobile devices
- **Real-time Updates** - See new posts and replies instantly
- **Search Functionality** - Quick search across all posts
- **Vote System** - Upvote posts with visual feedback
- **Answer System** - Mark best answers with green highlighting
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error handling and user feedback

## 📁 Project Structure

```
learnato-forum/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   ├── package.json       # Backend dependencies
│   ├── Dockerfile         # Backend Docker configuration
│   └── .env.example       # Environment variables example
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Custom styles
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   ├── Dockerfile         # Frontend Docker configuration
│   ├── nginx.conf         # Nginx configuration
│   └── vite.config.js     # Vite configuration
├── docker-compose.yml     # Docker Compose configuration
├── .dockerignore          # Docker ignore file
└── README.md              # This file
```

## 🔧 Configuration

### Database Options

The application supports two storage options:

1. **In-Memory Storage** (Default)
   - No configuration needed
   - Data is lost on server restart
   - Perfect for development and testing

2. **MongoDB** (Optional)
   - Set `MONGO_URI` in backend `.env` file
   - Persistent storage
   - Production-ready

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `MONGO_URI` - MongoDB connection string (optional)

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## 🚢 Deployment

### Quick Deployment Options

1. **Docker (Local/Production)**
   ```bash
   docker-compose up --build
   ```

2. **Render (Free Tier)**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
   - Deploy backend and frontend as separate services
   - Use `render.yaml` for blueprint deployment

3. **Vercel + Railway**
   - Frontend on Vercel
   - Backend on Railway
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions

4. **Railway (Full Stack)**
   - Deploy both services on Railway
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Docker deployment
- Render deployment
- Vercel + Railway deployment
- Google Cloud Run
- Environment variables setup
- Troubleshooting guide

## 🧪 Testing

1. **Create a Post**
   - Click "New Post" button
   - Fill in title and content
   - Submit

2. **Upvote a Post**
   - Click the upvote arrow on any post
   - Watch the vote count update in real-time

3. **Add a Reply**
   - Click "View Discussion" on a post
   - Scroll to "Add a Reply" section
   - Write and submit a reply

4. **Search Posts**
   - Use the search bar at the top
   - Type keywords to filter posts

5. **Mark as Answered**
   - View a post with replies
   - Click "Mark as Answer" on a reply
   - The post and reply will be highlighted

## 📝 License

This project is part of the Learnato Hackathon.

## 🙏 Acknowledgments

- Built for Learnato Hackathon
- Theme: "Empower learning through conversation"
- Tech Stack: Node.js, React.js, Tailwind CSS

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Happy Learning! 💬🚀**

