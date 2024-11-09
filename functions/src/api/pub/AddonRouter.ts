import { Router } from 'express';
import { requestWithError } from '../utils';

export const AddonRouter = Router();

AddonRouter.post(
  '/external/:addonName/:addonFeature',
  requestWithError(async (req) => {
    const externalAddons = req.container.externalAddons.find(
      (addon) => addon.addonName === req.params.addonName
    );
    if (!externalAddons) throw new Error('Addon service not found');

    const response = await externalAddons.pub(
      req.params.addonFeature,
      req.body as never
    );

    req.response.json(response);
  })
);

AddonRouter.post(
  '/entity/:addonName/:addonFeature',
  requestWithError(async (req) => {
    const entityAddons = req.container.entityAddons.find(
      (addon) => addon.addonName === req.params.addonName
    );

    if (!entityAddons) throw new Error('Addon service not found');
    const response = await entityAddons.pub(
      req.params.addonFeature,
      req.body as never
    );

    req.response.json(response);
  })
);
