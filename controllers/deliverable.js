import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import Deliverable from '../models/deliverable'
import { config as dotenvConfig } from 'dotenv'

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
    // console.log(Object.keys(req))
    res.status(200).json(res.advancedFiltering)
})


/*
@desc       Get single deliverable
@route      GET /api/v1/deliverables/:id
@access     Private
*/
export const getDeliverable = asyncHandler( async (req, res, next) => {
    const deliverable = await Deliverable
        .findById(req.params.id)

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

    deliverable.update(req.body)

    res.status(200).json({
        success: true,
        data: deliverable
    })

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

})