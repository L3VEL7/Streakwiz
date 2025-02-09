// In-memory storage for streaks and trigger words
const guildConfig = new Map();
const streaks = new Map();
const streakLimits = new Map(); // Store time limits for each guild
const lastStreakTime = new Map(); // Store last streak time for each user/word

module.exports = {
    setTriggerWords(guildId, words) {
        // Ensure all words are trimmed and lowercase when stored
        const processedWords = words.map(word => word.trim().toLowerCase());
        console.log(`Setting trigger words for guild ${guildId}:`, processedWords); // Debug log
        guildConfig.set(guildId, processedWords);

        // Initialize streak tracking for new words
        if (!streaks.has(guildId)) {
            streaks.set(guildId, new Map());
        }
        const guildStreaks = streaks.get(guildId);
        processedWords.forEach(word => {
            if (!guildStreaks.has(word)) {
                guildStreaks.set(word, new Map());
            }
        });

        return processedWords;
    },

    getTriggerWords(guildId) {
        const words = guildConfig.get(guildId) || [];
        console.log(`Retrieved trigger words for guild ${guildId}:`, words); // Debug log
        return words;
    },

    isValidTriggerWord(guildId, word) {
        const words = this.getTriggerWords(guildId);
        const processedWord = word.trim().toLowerCase();
        console.log(`Validating word "${processedWord}" against triggers:`, words); // Debug log
        return words.includes(processedWord);
    },

    setStreakLimit(guildId, minutes) {
        streakLimits.set(guildId, minutes);
    },

    getStreakLimit(guildId) {
        return streakLimits.get(guildId) || 0; // 0 means no limit
    },

    canUpdateStreak(guildId, userId, word) {
        const limit = this.getStreakLimit(guildId);
        if (limit === 0) return true; // No limit set

        const key = `${guildId}-${userId}-${word}`;
        const lastTime = lastStreakTime.get(key) || 0;
        const now = Date.now();
        const timeDiff = (now - lastTime) / (1000 * 60); // Convert to minutes

        return timeDiff >= limit;
    },

    incrementStreak(guildId, userId, word) {
        const processedWord = word.trim().toLowerCase();

        // Check time limit
        if (!this.canUpdateStreak(guildId, userId, processedWord)) {
            return -1; // Indicates rate limit
        }

        if (!streaks.has(guildId)) {
            streaks.set(guildId, new Map());
        }
        const guildStreaks = streaks.get(guildId);

        if (!guildStreaks.has(processedWord)) {
            guildStreaks.set(processedWord, new Map());
        }
        const wordStreaks = guildStreaks.get(processedWord);

        const currentStreak = wordStreaks.get(userId) || 0;
        wordStreaks.set(userId, currentStreak + 1);

        // Update last streak time
        const key = `${guildId}-${userId}-${processedWord}`;
        lastStreakTime.set(key, Date.now());

        return currentStreak + 1;
    },

    getStreaks(guildId, word) {
        const processedWord = word.trim().toLowerCase();
        if (!streaks.has(guildId)) return {};
        const guildStreaks = streaks.get(guildId);
        if (!guildStreaks.has(processedWord)) return {};

        const wordStreaks = guildStreaks.get(processedWord);
        return Object.fromEntries(wordStreaks);
    }
};