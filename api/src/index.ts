import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import NamesRouter from "./routers/NamesRouter"

// Conditionally import dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const PORT = process.env.PORT || 8080

// Create app
const app = express()

// Add middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(NamesRouter)


// Start server
mongoose.connect("mongodb://localhost:27017/names").then(res => {
  if (res) {
    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
  }
}).catch(err => {
  console.error(err)
});


