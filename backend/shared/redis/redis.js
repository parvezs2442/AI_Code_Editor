import Redis from "ioredis"

let redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
if (redisUrl.startsWith("http://")) {
  redisUrl = redisUrl.replace("http://", "redis://");
} else if (redisUrl.startsWith("https://")) {
  redisUrl = redisUrl.replace("https://", "rediss://");
}
if (redisUrl.includes("localhost")) {
  redisUrl = redisUrl.replace("localhost", "127.0.0.1");
}

let lastLogTime = 0;

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 500, 5000);
    return delay;
  },
  lazyConnect: false,
})

redis.on("connect", () => {
  console.log("Redis connected successfully")
})

redis.on("error", (err) => {
  const now = Date.now();
  if (now - lastLogTime > 5000) {
    console.error("Redis error:", err.message);
    lastLogTime = now;
  }
})

export default redis

