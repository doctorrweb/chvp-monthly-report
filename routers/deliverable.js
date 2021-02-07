import { Router } from 'express'
import {
    createDeliverable,
    getDeliverables,
    getDeliverable,
    updateDeliverable,
    deleteDeliverable
} from '../controllers/deliverable'
import Deliverable from '../models/deliverable'
import { protect, authorize } from '../middleware/auth'
import advancedFiltering from '../middleware/adavancedFiltering'


const deliverableRouter = Router()
    deliverableRouter.use(protect)
    deliverableRouter.use(authorize('administrator'))

    const populateDeliverables = [
        { path: 'translation',
            select: 'name startDate endDate completionRate type' },
        { path: 'responsible',
            select: 'surname firstname email' },
    ]

deliverableRouter.route('/')
    .get(advancedFiltering(Deliverable, populateDeliverables), getDeliverables) 
    .post(createDeliverable)


deliverableRouter.route('/:id')
    .get(getDeliverable)
    .put(updateDeliverable)
    .delete(deleteDeliverable)




export default deliverableRouter