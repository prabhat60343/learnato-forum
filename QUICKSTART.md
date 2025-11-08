# Quick Start Guide

## Option 1: Local Development (Recommended for Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

4. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

5. **Open Browser**
   Navigate to http://localhost:5173

## Option 2: Docker Compose (Recommended for Production)

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Start Services**
   ```bash
   docker-compose up --build
   ```

2. **Access Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

3. **Stop Services**
   ```bash
   docker-compose down
   ```

## Option 3: Individual Docker Containers

### Backend

1. **Build Image**
   ```bash
   cd backend
   docker build -t learnato-forum-backend .
   ```

2. **Run Container**
   ```bash
   docker run -p 5000:5000 learnato-forum-backend
   ```

### Frontend

1. **Build Image**
   ```bash
   cd frontend
   docker build -t learnato-forum-frontend .
   ```

2. **Run Container**
   ```bash
   docker run -p 80:80 learnato-forum-frontend
   ```

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/learnato-forum  # Optional
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory (optional for local dev):

```env
VITE_API_URL=http://localhost:5000
```

## Testing the Application

1. **Create a Post**
   - Click "New Post" button
   - Fill in title and content
   - Submit

2. **Upvote a Post**
   - Click the upvote arrow (↑) on any post
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
   - The post and reply will be highlighted in green

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Node.js version is 18+
- Check backend/.env file exists (optional)

### Frontend won't start
- Check if port 5173 is already in use
- Verify all dependencies are installed
- Check if backend is running on port 5000

### Docker issues
- Make sure Docker is running
- Check if ports 80 and 5000 are available
- Try `docker-compose down` and `docker-compose up --build`

### Real-time updates not working
- Verify Socket.io connection in browser console
- Check CORS settings in backend
- Ensure frontend API_URL matches backend URL

## Features

✅ Create Post
✅ List Posts (sorted by votes)
✅ View Post with Replies
✅ Add Reply
✅ Upvote Post
✅ Search Posts
✅ Mark as Answered
✅ Real-time Updates (Socket.io)
✅ Responsive UI

Happy coding! 🚀

