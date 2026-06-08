// storage.js — shared utility for saving and loading user progress
// All progress lives under one key in localStorage as a JSON string.

const STORAGE_KEY = 'igbo2learn-progress';

// Read the user's progress object from localStorage.
// Returns a fresh default object if nothing is saved yet.
function getProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { totalXP: 0, topics: {} };
        }
        return JSON.parse(raw);
    } catch (err) {
        // If data is corrupted, return a fresh object
        console.error('Failed to read progress, resetting:', err);
        return { totalXP: 0, topics: {} };
    }
}

// Save a quiz result for a specific topic.
// Updates the best score (only if new score is higher) and adds XP.
function saveLessonResult(topic, score, totalQuestions) {
    const progress = getProgress();
    const existing = progress.topics[topic];

    // XP earned this attempt
    const xpEarned = score * 10;
    progress.totalXP += xpEarned;

    // Update best score only if it's higher than what was there
    if (!existing || score > existing.bestScore) {
        progress.topics[topic] = {
            bestScore: score,
            total: totalQuestions,
            completedAt: new Date().toISOString().split('T')[0]
        };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Get total XP across all sessions
function getTotalXP() {
    return getProgress().totalXP;
}

// Get progress for a specific topic
// Returns null if topic was never completed
function getTopicProgress(topic) {
    return getProgress().topics[topic] || null;
}

// Wipe all stored progress
function resetAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
}