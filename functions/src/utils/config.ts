import * as functions from 'firebase-functions';

export const env = functions.config().env as {
  environment: {
    type: string;
  };
  frontend: {
    url: string;
  };
  api: {
    url: string;
  };
  cors: {
    whitelist: string;
  };
  calendly: {
    token: string;
  };
};
