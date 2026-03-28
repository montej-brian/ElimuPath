const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 1, // Don't block requests if Redis is down
  retryStrategy: (times) => {
    // Only retry 3 times, then give up for a while
    if (times > 3) return null;
    return Math.min(times * 100, 3000);
  }
});

let isRedisConnected = false;
let redisWarnedOnce = false;

redis.on('connect', () => {
  isRedisConnected = true;
  redisWarnedOnce = false;
  console.log('✅ Redis Connected');
});

redis.on('error', (err) => {
  isRedisConnected = false;
  if (err.code === 'ECONNREFUSED') {
    if (!redisWarnedOnce) {
      redisWarnedOnce = true;
      const host = process.env.REDIS_HOST || '127.0.0.1';
      const port = process.env.REDIS_PORT || 6379;
      console.warn(`⚠️  Redis not available at ${host}:${port}. Caching disabled.`);
    }
  } else {
    console.error('❌ Redis error:', err.message);
  }
});

module.exports = { redis, isRedisConnected: () => isRedisConnected };
