const { redis, isRedisConnected } = require('../config/redis');

const CACHE_TTL = {
  REQUIREMENTS: 3600 * 24, // 24 hours
  MATCHES: 3600, // 1 hour
};

const cache = {
  // Course Requirements Cache
  async getRequirements(courseId) {
    if (!isRedisConnected()) return null;
    try {
      const data = await redis.get(`course:requirements:${courseId}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  },

  async setRequirements(courseId, requirements) {
    if (!isRedisConnected()) return;
    try {
      await redis.set(
        `course:requirements:${courseId}`, 
        JSON.stringify(requirements), 
        'EX', 
        CACHE_TTL.REQUIREMENTS
      );
    } catch (err) {
      // Ignore
    }
  },

  async invalidateRequirements(courseId) {
    if (!isRedisConnected()) return;
    try {
      await redis.del(`course:requirements:${courseId}`);
    } catch (err) {}
  },

  // Match Results Cache
  async getMatches(studentResultId) {
    if (!isRedisConnected()) return null;
    try {
      const data = await redis.get(`match:results:${studentResultId}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  },

  async setMatches(studentResultId, matches) {
    if (!isRedisConnected()) return;
    try {
      await redis.set(
        `match:results:${studentResultId}`, 
        JSON.stringify(matches), 
        'EX', 
        CACHE_TTL.MATCHES
      );
    } catch (err) {}
  },

  async invalidateMatches(studentResultId) {
    if (!isRedisConnected()) return;
    try {
      await redis.del(`match:results:${studentResultId}`);
    } catch (err) {}
  },

  // Global Helpers
  async clearAll() {
    if (!isRedisConnected()) return;
    try {
      await redis.flushall();
    } catch (err) {}
  }
};

module.exports = cache;
