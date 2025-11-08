import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'

// Use environment variable or default to localhost for development
// In production with nginx proxy, use relative URL
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:5000')

// Socket connection - use same URL as API
const socket = io(API_URL || window.location.origin)

// Header Component
function Header({ onNewPost }) {
  return (
    <header className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">💬 Learnato Forum</h1>
          </Link>
          <button
            onClick={onNewPost}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Post</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// Search Bar Component
function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            onSearch(e.target.value)
          }}
          placeholder="Search posts..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>
  )
}

// Post Card Component
function PostCard({ post, onUpvote }) {
  const navigate = useNavigate()
  const replyCount = post.replies?.length || 0
  const timeAgo = new Date(post.createdAt).toLocaleDateString()

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/posts/${post._id}`)}>
              {post.title}
            </h2>
            {post.isAnswered && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                ✓ Answered
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>👤 {post.author || 'Anonymous'}</span>
            <span>📅 {timeAgo}</span>
            <span>💬 {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <button
            onClick={() => onUpvote(post._id)}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-lg font-semibold text-gray-800">{post.votes || 0}</span>
          </button>
        </div>
      </div>
      <button
        onClick={() => navigate(`/posts/${post._id}`)}
        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        View Discussion →
      </button>
    </div>
  )
}

// Post List Component
function PostList() {
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    
    // Socket.io listeners
    socket.on('newPost', (newPost) => {
      setPosts(prev => [newPost, ...prev])
    })

    socket.on('postUpvoted', ({ postId, votes }) => {
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, votes } : post
      ))
    })

    socket.on('postAnswered', ({ postId }) => {
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, isAnswered: true } : post
      ))
    })

    return () => {
      socket.off('newPost')
      socket.off('postUpvoted')
      socket.off('postAnswered')
    }
  }, [])

  const fetchPosts = async (search = '') => {
    try {
      setLoading(true)
      const url = search 
        ? `${API_URL}/api/posts?search=${encodeURIComponent(search)}`
        : `${API_URL}/api/posts`
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch posts' }))
        console.error('Error fetching posts:', errorData)
        setPosts([]) // Set empty array on error
        return
      }
      
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPosts(data)
      } else {
        console.error('Invalid response format:', data)
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    fetchPosts(term)
  }

  const handleUpvote = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/upvote`, {
        method: 'POST'
      })
      if (response.ok) {
        const updated = await response.json()
        setPosts(prev => prev.map(post => 
          post._id === postId ? { ...post, votes: updated.votes } : post
        ))
      }
    } catch (error) {
      console.error('Error upvoting post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setShowCreateModal(true)} />
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No posts found. Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onUpvote={handleUpvote} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchPosts(searchTerm)
          }}
        />
      )}
    </div>
  )
}

// Post Detail Component
function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()

    // Socket.io listeners
    socket.on('newReply', ({ postId, reply }) => {
      if (postId === id) {
        setReplies(prev => [...prev, reply])
      }
    })

    socket.on('postUpvoted', ({ postId, votes }) => {
      if (postId === id) {
        setPost(prev => prev ? { ...prev, votes } : null)
      }
    })

    socket.on('postAnswered', ({ postId, replyId }) => {
      if (postId === id) {
        setPost(prev => prev ? { ...prev, isAnswered: true } : null)
        setReplies(prev => prev.map(r => 
          r._id === replyId ? { ...r, isAnswer: true } : r
        ))
      }
    })

    return () => {
      socket.off('newReply')
      socket.off('postUpvoted')
      socket.off('postAnswered')
    }
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/posts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        setReplies(data.replies || [])
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/upvote`, {
        method: 'POST'
      })
      if (response.ok) {
        const updated = await response.json()
        setPost(prev => prev ? { ...prev, votes: updated.votes } : null)
      }
    } catch (error) {
      console.error('Error upvoting post:', error)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyContent,
          author: author || 'Anonymous'
        })
      })

      if (response.ok) {
        const newReply = await response.json()
        setReplies(prev => [...prev, newReply])
        setReplyContent('')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  const handleMarkAsAnswered = async (replyId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ replyId })
      })

      if (response.ok) {
        setPost(prev => prev ? { ...prev, isAnswered: true } : null)
        setReplies(prev => prev.map(r => 
          r._id === replyId ? { ...r, isAnswer: true } : r
        ))
      }
    } catch (error) {
      console.error('Error marking as answered:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => navigate('/')} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Posts</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
                {post.isAnswered && (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    ✓ Answered
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👤 {post.author || 'Anonymous'}</span>
                <span>📅 {new Date(post.createdAt).toLocaleString()}</span>
                <span>💬 {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
              </div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <button
                onClick={handleUpvote}
                className="flex flex-col items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-2xl font-bold text-gray-800">{post.votes || 0}</span>
                <span className="text-xs text-gray-500">votes</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a Reply</h2>
          <form onSubmit={handleReply}>
            <div className="mb-4">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Post Reply
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Replies ({replies.length})
          </h2>
          {replies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No replies yet. Be the first to reply!</p>
          ) : (
            <div className="space-y-4">
              {replies.map(reply => (
                <div
                  key={reply._id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reply.isAnswer
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {reply.isAnswer && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        ✓ Accepted Answer
                      </span>
                    </div>
                  )}
                  <p className="text-gray-800 whitespace-pre-wrap mb-2">{reply.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>👤 {reply.author || 'Anonymous'}</span>
                      <span>📅 {new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    {!post.isAnswered && !reply.isAnswer && (
                      <button
                        onClick={() => handleMarkAsAnswered(reply._id)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        Mark as Answer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Create Post Modal Component
function CreatePostModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          author: author || 'Anonymous'
        })
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                required
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Post content..."
                rows="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  )
}

export default App
