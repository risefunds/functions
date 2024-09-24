/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '../backendContainer/Container';
declare global {
  namespace Express {
    interface Request {
      firebaseUser: {
        uid?: string;
        jwt?: unknown;
      };
      container: Container;
      body: unknown;
      rawBody: unknown;
      params: Record<string, any>;
      query: Record<string, any>;
      response: {
        unauthorized: () => void;
        json: (data: unknown) => void;
        success: (message?: string) => void;
        error: (message?: string) => void;
        badRequest: () => void;
      };
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_APPLICATION_CREDENTIALS: string;
    }
  }
}
