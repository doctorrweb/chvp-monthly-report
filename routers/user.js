import { Router } from 'express'
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user'
import User from '../models/user'
import advancedFiltering from '../middleware/adavancedFiltering'
import { protect, authorize } from '../middleware/auth'

const userRouter = Router()

 userRouter.use(protect)
 userRouter.use(authorize('administrator'))

userRouter.route('/')
    .get(advancedFiltering(User), getUsers) 
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default userRouter