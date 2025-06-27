import Redis from 'ioredis'

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost', // or 'my_redis' from Docker
    port: parseInt(process.env.REDIS_PORT || '6379'),
    // password: process.env.REDIS_PASSWORD, // optional
})

export default redis;