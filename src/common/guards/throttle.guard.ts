import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ThrottleGuard implements CanActivate {
  private requests = new Map<string, number[]>();
  private readonly limit = 100; // requests
  private readonly ttl = 60000; // 1 minute

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const now = Date.now();

    if (!this.requests.has(ip)) {
      this.requests.set(ip, []);
    }

    const timestamps = this.requests.get(ip)!;
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(time => now - time < this.ttl);
    
    if (validTimestamps.length >= this.limit) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    validTimestamps.push(now);
    this.requests.set(ip, validTimestamps);

    return true;
  }
}
