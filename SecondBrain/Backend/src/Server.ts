require('dotenv').config({ path: `Backend/../../.env` })
import express from 'express'
import jwt from 'jsonwebtoken'
import { UserModel } from './db/User';
import { ContentModel } from './db/Content';
import { ShareModel } from './db/Share';
import { randoms } from './utils/randoms';

const app = express();
app.use(express.json())

const port = process.env.PORT;
const jwt_key = process.env.JWT_PASS!;

app.post('/api/v1/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({ "username": username })

    try {
        if (user) {
            res.status(403).json({
                message: "User Already Exist"
            })
        } else if (!user) {

            await UserModel.create({
                username,
                password
            })

            res.status(200).json({
                message: "Signed UP"
            })
        } else {
            res.status(403).json({
                message: "Username should be 3-10 long and password should be 8-20 long"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error Signing UP.", error });
    }

})

app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({ "username": username, "password": password })

    try {
        if (user) {
            const token = jwt.sign({
                "username": username
            }, jwt_key)

            res.status(200).json({
                message: "Signed IN",
                token: token
            })
        } else {
            res.status(403).json({
                message: "Signed UP First or Incorrect credentials"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error Signing IN.", error });
    }
})

app.post('/api/v1/content', async (req, res) => {
    const type = req.body.type;
    const title = req.body.title;
    const link = req.body.link;
    const tags = req.body.tags;
    const token = req.headers.token as string;

    const verified = jwt.verify(token, jwt_key)

    try {
        if (verified) {
            await ContentModel.create({
                type,
                link,
                title,
                tags
            })

            res.status(200).send({
                messsage: "Content pushed to db"
            })
        } else (
            res.status(411).send({
                message: "Error in inputs"
            })
        )
    } catch (error) {
        res.status(500).json({ message: "Error Pushing content.", error });
    }
})

app.get('/api/v1/content', async (req, res) => {
    try {
        const contents = await ContentModel.find();
        res.status(200).json({
            "content": contents
        })
    }
    catch {
        res.status(500).send({
            message: "error While fetching contents"
        })
    }


})
app.delete('/api/v1/content', async (req, res) => {
    const id = req.body.id;
    try {
        const user = await ContentModel.findOne({ _id: id });

        if (user) {
            await ContentModel.deleteOne({ _id: id });
            res.status(200).json({ message: "Content deleted successfully." });
        } else {
            res.status(404).json({ message: "Content not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting content.", error });
    }

})
app.post('/api/v1/brain/share', async (req, res) => {
    const {share} = req.body;
    const {userId} =req.body;
    if(share){
        await ShareModel.create({
            hash: randoms(10),
            "userId": userId
        })
        res.status(200).json({
            message: "Link Generated"
        })
    }else{
        await ShareModel.deleteOne({
            "userId": userId
        })
        res.status(200).json({
            message: "Link Deleated"
        })
    }

    
})
app.get('/api/v1/brain/share', (req, res) => {

})


app.listen(port, () => {
    console.log(`Listen at ${port}`)
})