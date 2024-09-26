import { Request } from 'express';

declare module 'express' {
  interface Request {
    params: Record<string, string>;
  }
}
