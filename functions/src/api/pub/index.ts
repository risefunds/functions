import { Router } from 'express';
import { AddonRouter } from './AddonRouter';

export const pubRouter = Router();

pubRouter.use('/addon', AddonRouter);
