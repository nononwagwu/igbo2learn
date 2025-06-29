const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const mongoUri = 'mongodb+srv://igbouser:Nnonye2007@cluster0.hhcq2vs.mongodb.net/igbo2learn?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const JWT_SECRET = 'your_jwt_secret_key_here';

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// QuizProgress Schema & Model
const quizProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: Number,
  score: Number,
  dateTaken: { type: Date, default: Date.now }
});
const QuizProgress = mongoose.model('QuizProgress', quizProgressSchema);

// Load quiz.json questions
let quizQuestions = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'quiz.json'), 'utf8');
  quizQuestions = JSON.parse(data).map((q, index) => ({
    id: index + 1,
    ...q
  }));
  console.log(`Loaded ${quizQuestions.length} quiz questions`);
} catch (err) {
  console.error('Error reading quiz.json:', err);
}

// Routes

// Register new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// User profile
app.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Get quiz questions
app.get('/quiz', (req, res) => {
  const questionsForClient = quizQuestions.map(({ id, question, options }) => ({
    id,
    question,
    options
  }));
  res.json(questionsForClient);
});

// Submit quiz answers
app.post('/quiz/submit', authenticateToken, (req, res) => {
  const { answers } = req.body;
  const userId = req.user.userId;
  if (!answers) {
    return res.status(400).json({ error: 'Missing answers' });
  }
  let correctCount = 0;
  const totalCount = Object.keys(answers).length;
  for (const [qid, selectedOption] of Object.entries(answers)) {
    const question = quizQuestions.find(q => q.id === Number(qid));
    if (question && question.answer === selectedOption) {
      correctCount++;
    }
  }
  const progress = new QuizProgress({
    userId,
    quizId: 1,
    score: correctCount
  });
  progress.save().catch(err => console.error('Error saving quiz progress:', err));
  res.json({
    message: 'Quiz results',
    correctCount,
    totalCount
  });
});

//  Progress route - get user's quiz history
app.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const progress = await QuizProgress.find({ userId }).sort({ dateTaken: -1 });
    res.json({
      user: req.user.username,
      progress: progress.map(p => ({
        quizId: p.quizId,
        score: p.score,
        dateTaken: p.dateTaken,
      })),
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

app.post('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.get('/', (req, res) => {
  res.send('Igbo2Learn Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
