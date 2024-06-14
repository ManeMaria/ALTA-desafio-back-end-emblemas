import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IORedisConfig } from '@/libs/ioredis';
import Redis from 'ioredis';
import { MissingEnvVarException } from '@/core/application';

export interface RedisKey<Data = unknown> {
  key: string;
  data: Data;
  ttl?: number;
}

@Injectable()
export class IORedisService implements OnModuleInit {
  private redis: Redis;
  private prefix: string;

  constructor(private readonly configService: ConfigService<IORedisConfig>) {}

  onModuleInit(): void {
    const url = this.configService.get<string>('APP_REDIS_URL');

    if (!url) {
      throw new MissingEnvVarException(['APP_REDIS_URL']);
    }

    this.prefix = this.configService.get<string>('APP_REDIS_PREFIX', '');

    if (this.prefix) this.prefix += ':';

    this.redis = new Redis(url);
  }

  async set<Data = unknown>(key: RedisKey<Data>): Promise<void> {
    const pattern = `${this.prefix}${key.key}`;
    const data = JSON.stringify(key.data);
    const ttl = key.ttl;

    await this.redis.set(pattern, data, 'PX', ttl);
  }

  async get<Data = unknown>(pattern: string): Promise<RedisKey<Data>> {
    const key = `${this.prefix}${pattern}`;

    const data = await this.redis.get(key);
    const ttl = await this.redis.ttl(key);

    if (data && ttl < -2) {
      // -2 means the key is expired (not exists)
      return null;
    }

    return {
      key,
      data: JSON.parse(data),
      ttl,
    };
  }

  async delete(pattern: string): Promise<void> {
    const key = `${this.prefix}${pattern}`;

    await this.redis.del(key);
  }
}
