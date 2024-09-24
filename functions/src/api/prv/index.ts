import { Router } from 'express'
import { AddonRouter } from './AddonRouter'

export const prvRouter = Router()

prvRouter.use('/addon', AddonRouter)
