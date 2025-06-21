import dotenv from 'dotenv'
dotenv.configDotenv({path: 'Backend/../../../.env'})
import express from 'express'
import jwt from 'jsonwebtoken'
import { UserModel } from '../db/User';
import { ContentModel } from '../db/Content';
import { ShareModel } from '../db/Share';
import { randoms } from '../utils/randoms.js';
import { userMiddleware } from './middleware.js';

const app = express();
app.use(express.json())

export const port = process.env.PORT;
export const jwt_key = process.env.JWT_PASS!;

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
            const token = jwt.sign({ id: user._id }, jwt_key);

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

app.post('/api/v1/content', userMiddleware, async (req, res) => {
    const type = req.body.type;
    const title = req.body.title;
    const link = req.body.link;
    const userId = req.userId;

    try {
        await ContentModel.create({
            type,
            link,
            title,
            userId
        })

        res.status(200).send({
            messsage: "Content pushed to db",
            userId
        })
    } catch (error) {
        res.status(500).json({ message: "Error Pushing content.", error });
    }
})

app.get('/api/v1/content', userMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const contents = await ContentModel.find({
            userId: userId
        }).populate("userId", "username")
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
app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    try {
        const user = await ContentModel.findOne({ userId: req.userId });

        if (user) {
            await ContentModel.deleteOne({ userId: req.userId });
            res.status(200).json({ message: "Content deleted successfully." });
        } else {
            res.status(404).json({ message: "Content not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting content.", error });
    }

})
app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const share = req.body.share;
    const userId = req.userId;

    if (share) {
        const existinguser = await ShareModel.findOne({
            userId: userId
        })

        if(existinguser){
            res.json({
                hash: existinguser.hash
            })
            return;
        }

        const hash = randoms(10)
        await ShareModel.create({
            hash: hash,
            "userId": userId
        })
        res.status(200).json({
            message: "Link Generated",
            link: hash
        })
    } else {
        await ShareModel.deleteOne({
            "userId": userId
        })
        res.status(200).json({
            message: "Link Deleated"
        })
    }


})
app.get('/api/v1/brain/:share', async (req, res) => {
    const hash = req.params.share

    try {
        const link = await ShareModel.findOne({
            hash
        })

        if(!link){
            res.status(411).json({
                message: " Sorry incorrect input"
            })
            return;
        }

        const content = await ContentModel.find({
            userId: link.userId
        })
        const user = await UserModel.findOne({
            _id: link.userId
        })

        res.status(200).json({
            username: user?.username,
            content: content
        })
    }catch(err){
        res.status(500).json({
            message: "Error: " + err
        })
    }
})


app.listen(port, () => {
    console.log(`Listen at ${port}`)
})