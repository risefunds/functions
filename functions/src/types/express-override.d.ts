import { ParamsDictionary } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request<P = ParamsDictionary> {
    params: P;
  }
}
