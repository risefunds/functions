import { Request } from 'express';

// for

declare module 'express' {
  interface Request {
    params: Record<string, string>;
  }
}
