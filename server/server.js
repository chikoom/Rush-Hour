const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()

app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, '../node_modules')))

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`SERVER UP AND AWAY : ${PORT}`)
})
