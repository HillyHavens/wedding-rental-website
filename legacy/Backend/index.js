import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/userRoute.js"
import router from "./routes/blog.js"


const app = express();

app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;
mongoose.connect(MONGOURL);
const conn = mongoose.connection

conn.once('open',()=>{
    console.log("Database connected successful.");
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})

app.use("/api/user", route);
app.use("/api/user",router)