require('dotenv').config({ path: `Backend/../../.env` })
import mongoose from 'mongoose'

const url = process.env.DB_URL

mongoose.connect(url!)

const ContentTypes = ['image', 'video', 'article', 'audio']

const ContentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: ContentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TagModel' }],
    userId: { type: mongoose.Schema.Types.ObjectId, required:true, ref: 'UserModel' }
})

export const ContentModel = mongoose.model("ContentModel", ContentSchema)