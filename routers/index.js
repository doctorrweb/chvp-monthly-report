import { Router } from 'express'

// Import All routers
import userRouter from './user'
import authRouter from './auth'
import deliverableRouter from './deliverable'

const appRouter = Router()

// appRouter.use(/* name of the router  */)
appRouter.use('/users', userRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/deliverable', deliverableRouter)

export default appRouter