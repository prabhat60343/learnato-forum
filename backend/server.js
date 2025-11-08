// backend/server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// CORS configuration - allow multiple origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:80",
    "http://localhost"
].filter(Boolean);

// In development, allow all localhost origins
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow any localhost origin
        if (isDevelopment && origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // In production, check against allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Connect to MongoDB or use in-memory fallback
let Post, Reply;
let useMongoDB = false;

// Schema definitions (always define schemas for potential MongoDB use)
const ReplySchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
    isAnswer: { type: Boolean, default: false }
});

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    isAnswered: { type: Boolean, default: false },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }]
});

// Try to connect to MongoDB if URI is provided
mongoose.set('strictQuery', false);
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        useMongoDB = true;
        // Set up Mongoose models after connection
        Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
        Reply = mongoose.models.Reply || mongoose.model("Reply", ReplySchema);
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        console.log("⚠️  Falling back to in-memory storage");
        useMongoDB = false;
    });
}

// Set up in-memory storage (default, will be overridden if MongoDB connects successfully)
// In-memory storage
let posts = [];
let replies = [];
let postIdCounter = 1;
let replyIdCounter = 1;

// Initialize in-memory models (default - will be used unless MongoDB connects)
// Mock models for in-memory storage
Post = {
        find: (query) => {
            // Return an object that supports chaining: find().sort().exec()
            return {
                populate: () => ({
                    sort: (sortObj) => ({
                        exec: async () => {
                            let result = [...posts];
                            if (query && query._id) {
                                const queryId = typeof query._id === 'object' ? query._id.toString() : query._id;
                                result = result.filter(p => {
                                    const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                                    return postId === queryId;
                                });
                            }
                            // Sort by votes descending, then by date descending
                            result.sort((a, b) => {
                                if (b.votes !== a.votes) return b.votes - a.votes;
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            });
                            // Attach replies
                            return result.map(p => {
                                const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                                return {
                                    ...p,
                                    replies: replies.filter(r => {
                                        const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                                        return replyPostId === postId;
                                    })
                                };
                            });
                        }
                    })
                }),
                sort: (sortObj) => ({
                    exec: async () => {
                        let result = [...posts];
                        // Filter by query if provided
                        if (query && query._id) {
                            const queryId = typeof query._id === 'object' ? query._id.toString() : query._id;
                            result = result.filter(p => {
                                const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                                return postId === queryId;
                            });
                        }
                        // Sort by votes descending, then by date descending
                        result.sort((a, b) => {
                            if (b.votes !== a.votes) return b.votes - a.votes;
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        });
                        // Attach replies
                        return result.map(p => {
                            const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                            return {
                                ...p,
                                replies: replies.filter(r => {
                                    const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                                    return replyPostId === postId;
                                })
                            };
                        });
                    }
                }),
                exec: async () => {
                    let result = [...posts];
                    // Filter by query if provided
                    if (query && query._id) {
                        const queryId = typeof query._id === 'object' ? query._id.toString() : query._id;
                        result = result.filter(p => {
                            const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                            return postId === queryId;
                        });
                    }
                    // Sort by votes descending, then by date descending
                    result.sort((a, b) => {
                        if (b.votes !== a.votes) return b.votes - a.votes;
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    // Attach replies
                    return result.map(p => {
                        const postId = typeof p._id === 'object' ? p._id.toString() : p._id;
                        return {
                            ...p,
                            replies: replies.filter(r => {
                                const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                                return replyPostId === postId;
                            })
                        };
                    });
                }
            };
        },
        findById: (id) => ({
            populate: (field) => ({
                exec: async () => {
                    const postId = typeof id === 'object' ? id.toString() : id;
                    const post = posts.find(p => {
                        const postIdStr = typeof p._id === 'object' ? p._id.toString() : p._id;
                        return postIdStr === postId;
                    });
                    if (!post) return null;
                    const postIdStr = typeof post._id === 'object' ? post._id.toString() : post._id;
                    return {
                        ...post,
                        replies: replies.filter(r => {
                            const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                            return replyPostId === postIdStr;
                        })
                    };
                }
            }),
            exec: async () => {
                const postId = typeof id === 'object' ? id.toString() : id;
                const post = posts.find(p => {
                    const postIdStr = typeof p._id === 'object' ? p._id.toString() : p._id;
                    return postIdStr === postId;
                });
                if (!post) return null;
                const postIdStr = typeof post._id === 'object' ? post._id.toString() : post._id;
                return {
                    ...post,
                    replies: replies.filter(r => {
                        const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                        return replyPostId === postIdStr;
                    })
                };
            }
        }),
        findByIdAndUpdate: async (id, update, options) => {
            const postId = typeof id === 'object' ? id.toString() : id;
            const index = posts.findIndex(p => {
                const postIdStr = typeof p._id === 'object' ? p._id.toString() : p._id;
                return postIdStr === postId;
            });
            if (index === -1) return null;
            if (update.$inc) {
                posts[index].votes += update.$inc.votes || 0;
            }
            if (update.isAnswered !== undefined) {
                posts[index].isAnswered = update.isAnswered;
            }
            if (update.$push && update.$push.replies) {
                if (!posts[index].replies) {
                    posts[index].replies = [];
                }
                posts[index].replies.push(update.$push.replies);
            }
            return { ...posts[index] };
        },
        create: async (data) => {
            const post = {
                _id: postIdCounter++,
                ...data,
                votes: data.votes || 0,
                createdAt: new Date(),
                isAnswered: false
            };
            posts.push(post);
            return { ...post };
        }
    };

    Reply = {
        find: (query) => ({
            exec: async () => {
                if (query && query.postId) {
                    return replies.filter(r => {
                        const replyPostId = typeof r.postId === 'object' ? r.postId.toString() : r.postId;
                        const queryPostId = typeof query.postId === 'object' ? query.postId.toString() : query.postId;
                        return replyPostId === queryPostId;
                    });
                }
                return [...replies];
            }
        }),
        create: async (data) => {
            const reply = {
                _id: replyIdCounter++,
                ...data,
                postId: data.postId, // Keep original postId format
                createdAt: new Date(),
                isAnswer: data.isAnswer || false
            };
            replies.push(reply);
            return { ...reply };
        },
        findByIdAndUpdate: async (id, update, options) => {
            const index = replies.findIndex(r => {
                const replyId = typeof r._id === 'object' ? r._id.toString() : r._id;
                const queryId = typeof id === 'object' ? id.toString() : id;
                return replyId === queryId;
            });
            if (index === -1) return null;
            if (update.isAnswer !== undefined) {
                replies[index].isAnswer = update.isAnswer;
            }
            return { ...replies[index] };
        }
    };

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// Broadcast helper
const broadcastUpdate = (event, data) => {
    io.emit(event, data);
};

// API Routes

// Get all posts
app.get("/api/posts", async (req, res) => {
    try {
        const { search } = req.query;
        let posts;
        
        // Check if MongoDB is connected (connection might be async)
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        // Check if Post is a Mongoose model (has populate method) vs in-memory model
        const testPost = Post.find();
        const isMongooseModel = testPost && typeof testPost.populate === 'function';
        
        if (isMongoConnected && useMongoDB && isMongooseModel) {
            // Use MongoDB
            posts = await Post.find()
                .populate("replies")
                .sort({ votes: -1, createdAt: -1 })
                .lean()
                .exec();
        } else {
            // Use in-memory storage
            posts = await Post.find({}).sort({ votes: -1 }).exec();
        }
        
        // Ensure posts is an array
        if (!Array.isArray(posts)) {
            posts = [];
        }
        
        // Convert replies to array if not already
        posts = posts.map(post => ({
            ...post,
            replies: post.replies || []
        }));

        // Filter by search query if provided
        if (search) {
            const searchLower = search.toLowerCase();
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower)
            );
        }

        if (!posts) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ 
            error: "Failed to fetch posts", 
            message: err.message 
        });
    }
});

// Get single post with replies
app.get("/api/posts/:id", async (req, res) => {
    try {
        let post;
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected && useMongoDB && Post && typeof Post.findById === 'function') {
            post = await Post.findById(req.params.id).populate("replies").lean().exec();
        } else {
            post = await Post.findById(req.params.id).populate("replies").exec();
        }

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Ensure replies is an array
        post.replies = post.replies || [];
        res.json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ error: "Failed to fetch post", details: err.message });
    }
});

// Create post
app.post("/api/posts", async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const post = await Post.create({ title, content, author: author || "Anonymous" });
        
        // Broadcast new post
        broadcastUpdate("newPost", post);
        
        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Failed to create post", details: err.message });
    }
});

// Add reply to post
app.post("/api/posts/:id/reply", async (req, res) => {
    try {
        const { content, author } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const postId = req.params.id;
        
        // Verify post exists
        let post = await Post.findById(postId).exec();

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const reply = await Reply.create({
            content,
            author: author || "Anonymous",
            postId: postId
        });

        // Add reply to post's replies array (MongoDB only)
        const isMongoConnectedForReply = mongoose.connection.readyState === 1;
        if (isMongoConnectedForReply && useMongoDB && Post && typeof Post.findByIdAndUpdate === 'function') {
            await Post.findByIdAndUpdate(postId, {
                $push: { replies: reply._id }
            });
        }
        // For in-memory, replies are already linked via postId, no need to update

        // Broadcast new reply
        broadcastUpdate("newReply", { postId, reply });

        res.status(201).json(reply);
    } catch (err) {
        res.status(500).json({ error: "Failed to create reply" });
    }
});

// Upvote post
app.post("/api/posts/:id/upvote", async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { votes: 1 } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Broadcast upvote
        broadcastUpdate("postUpvoted", { postId: req.params.id, votes: updated.votes });

        res.json(updated);
    } catch (err) {
        console.error("Error upvoting post:", err);
        res.status(500).json({ error: "Failed to upvote post", details: err.message });
    }
});

// Mark post as answered
app.post("/api/posts/:id/answer", async (req, res) => {
    try {
        const { replyId } = req.body;
        
        // Update reply to mark as answer
        if (replyId) {
            await Reply.findByIdAndUpdate(replyId, { isAnswer: true }, { new: true });
        }

        // Update post to mark as answered
        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            { isAnswered: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Broadcast update
        broadcastUpdate("postAnswered", { postId: req.params.id, replyId });

        res.json(updated);
    } catch (err) {
        console.error("Error marking as answered:", err);
        res.status(500).json({ error: "Failed to mark as answered", details: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
    console.log(`📡 Socket.io server ready`);
    if (!useMongoDB) {
        console.log("💾 Using in-memory storage (set MONGO_URI to use MongoDB)");
    }
});
