import express from 'express';
import { connectDatabase } from './db/connection.js';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
config();
import appRouter from './routes/userroute.js';
import authRouter from './routes/authroutes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';


// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//for middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
app.use('/user-images', express.static(path.join(__dirname, 'user-images'))); // Ensure the path is correct
console.log('Serving user-images at /user-images');
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

//connect database
connectDatabase();

//for routes
app.use('/api/user',appRouter); //like localhost:5000/api/user/test
app.use('/api/auth',authRouter); //like localhost:5000/api/auth/signup

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('listening on port 5000');
});

export default app;