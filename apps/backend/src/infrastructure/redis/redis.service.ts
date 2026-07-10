import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit(): Promise<void> {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    await this.client.ping();

    this.logger.log('Redis connected');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis disconnected');
    }
  }

  async set(
    key: string,
    value: string,
    ttlInSeconds?: number,
  ): Promise<'OK'> {
    if (ttlInSeconds) {
      return this.client.set(key, value, 'EX', ttlInSeconds);
    }

    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async expire(key: string, ttlInSeconds: number): Promise<number> {
    return this.client.expire(key, ttlInSeconds);
  }
}