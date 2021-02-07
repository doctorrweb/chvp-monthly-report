import { Schema, model } from 'mongoose'
import slugify from 'slugify'

const DeliverableSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot be more than 50 characters']
    },
    slug: String,
    comment: {
        type: String,
        trim: true,
        required: [
            function () {
                return this.type === 'initiative'
            },
            'Please add a comment'
        ],
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    startDate: {
        type: Date,
        // required: [true, 'Please add an Start Date']
    },
    endDate: {
        type: Date,
        // required: [true, 'Please add an End Date']
    },
    completionRate: {
        type: Number,
        min: [1, 'Completion rate must be at least 1'],
        max: [100, 'Completion rate cannot be more than 10'],
        required: [true, 'Please add an Completion rate'],
        default: 1,
    },
    type: {
        type: String,
        required: [true, 'Please choose a type'],
        enum: [
            'initiative',
            'milestone',
            'task'
        ],
        default: 'initiative'
    },
    status: {
        type: String,
        enum: [
            'on target',
            'with delays',
            'off target'
        ],
        default: 'on target'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    order: Number,
    updateDetails: {
        date: {
            type: Date,
            default: Date.now
        },
        by: {
            type: Schema.ObjectId,
            ref: 'User',
        }
    },
    initiative: {
        type: Schema.ObjectId,
        ref: 'Deliverable',
        required: [
            function () {
                return this.type !== 'initiative'
            },
            'The linked initiative is required'
        ]
    },
    lang: {
        type: String,
        enum: [ 'en', 'fr' ],
        required: [true, 'Please choose a language']
    },
    translation: {
        type: Schema.ObjectId,
        ref: 'Deliverable'
    },
    responsible: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'createdAt', updatedAt: 'updateDetails.date'}
})

// Create Event slug from the name
DeliverableSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// cascade delete posts when an event is deleted
DeliverableSchema.pre('remove', async function (next) {
    await this.model('Deliverable').deleteMany({ initiative: this._id })
    next()
})

// Reverse populate with virtuals
DeliverableSchema.virtual('actions', {
    ref: 'Deliverable',
    localField: '_id',
    foreignField: 'initiative',
    justOne: false
})

export default model('Deliverable', DeliverableSchema)