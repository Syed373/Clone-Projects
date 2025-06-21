require('dotenv').config({ path: `Backend/../../.env` })
import mongoose from 'mongoose'

const url = process.env.DB_URL

mongoose.connect(url!)

const ShareSchema = new mongoose.Schema({
    hash: { type:String, required:true},
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel', unique:true}
})

export const ShareModel = mongoose.model("ShareModel", ShareSchema)