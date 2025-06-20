require('dotenv').config({ path: `Backend/../../.env` })
import mongoose from 'mongoose'

const url = process.env.DB_URL

mongoose.connect(url!)

const TagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true},
})

export const TagModel = mongoose.model("TagModel", TagSchema)