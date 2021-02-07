import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Deliverable from '../models/deliverable'
import { config as dotenvConfig } from 'dotenv'
import { clearHash } from '../utils/cache'

dotenvConfig()
const env = process.env


/*
@desc       Create a new Deliverable
@route      POST /api/v1/deliverables
@access     Private
*/
export const createDeliverable = asyncHandler( async (req, res, next) => {

    const deliverable = await Deliverable.create(req.body)
    res.status(200).json({ 
        success: true,
        data: deliverable
    })

})


/*
@desc       Get all deliverables
@route      GET /api/v1/deliverables
@access     Private
*/
export const getDeliverables = asyncHandler( async (req, res, next) => {
    
    const deliverables = await Deliverable.find({})

    res.status(200).json({
        success: true,
        count: deliverables.length,
        data: deliverables
    })
    
})


/*
@desc       Get single deliverable
@route      GET /api/v1/deliverables/:id
@access     Private
*/
export const getDeliverable = asyncHandler( async (req, res, next) => {
    const deliverable = await Deliverable
        .findById(req.params.id)
        // .cache({ key: req.originalUrl })

    res.status(200).json({
        success: true,
        data: deliverable
    })
})


/*
@desc       Update deliverable
@route      PUT /api/v1/deliverables/:id
@access     Private
*/
export const updateDeliverable = asyncHandler( async (req, res, next) => {

    let deliverable = await Deliverable.findById(req.params.id)

    if(!deliverable) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(deliverable.responsible.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorize to update this content`, 401))
    }

    deliverable = await Deliverable.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: deliverable
    })

    // clearHash(req.originalUrl)

})


/*
@desc       Delete deliverable
@route      DELETE /api/v1/deliverables/:id
@access     Private
*/
export const deleteDeliverable = asyncHandler( async (req, res, next) => {
    
    const deliverable = await Deliverable.findById(req.params.id)

    if(!deliverable) return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404))

    // Make sure User is the event owner
    if(deliverable.responsible.toString() !== req.user.id && req.user.role !== 'administrator') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorize to delete this content`, 401))
    }

    deliverable.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

    // clearHash(req.originalUrl)

})