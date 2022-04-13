import 'dotenv/config'
import express from 'express'
import './freshdesk.js'

const app = express()

app.get("/", (req, res) => {})

app.listen(process.env.PORT)