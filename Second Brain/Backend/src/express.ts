import express from "express";

const app = express()
const port = 3000

app.use(express.json())

const users: any = []

app.post('/api/v1/signup', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    // const user = users.find(user => user.username === username )

    users.push({
            username,
            password,
        })
        res.json({
            message: "You are signed up"
        })
})

app.listen(port, ()=>{
    console.log(`Listening at Port ${port}`)
})