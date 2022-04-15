import 'dotenv/config'
import express from 'express'
import './freshdesk.js'

const app = express()

app.get("/", (req, res) => {
    res.send("HI!")
})

app.get("/lol", (req, res) => {
    res.send("WORLOLOL")
})

app.listen(process.env.PORT)