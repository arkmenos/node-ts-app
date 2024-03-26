import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import mongoose from "mongoose"
import { pokemonRouter } from "../routes/api/pokemon"
import { connectDB } from "../config/dbConn"
import corsOptions from "../config/corsOptions"
// import {Logger, LogEvents}  from  "../middleware/logEvents.js"
// import errorHandler from "../middleware/errorHandler"

dotevnv.config()

if (!process.env.PORT) {
    console.log(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10)

//connect to MongoDB
connectDB();
const app = express()
// app.use(Logger);

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors(corsOptions))
app.use(helmet())

app.use('/', pokemonRouter)


// app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Conneccted to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
})