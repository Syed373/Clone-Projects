require('dotenv').config({ path: `Backend/../../.env` })
import mongoose from 'mongoose'

const url = process.env.DB_URL

mongoose.connect(url!);

const UserSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true, min:3, max:10},
    password: {type: String, required:true, min:8, max:20}
})

export const UserModel = mongoose.model("UserModel", UserSchema)