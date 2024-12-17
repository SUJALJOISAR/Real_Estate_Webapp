import express from 'express';
import { connectDatabase } from './db/connection.js';
import { config } from 'dotenv';
import morgan from 'morgan';
config();
import appRouter from './routes/userroute.js';

const app = express();

//for middlewares
app.use(morgan("dev"))
app.use(express.json());

//connect database
connectDatabase();

//for routes
app.use('/api/user',appRouter); //like localhost:5000/api/user/signin

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('listening on port 5000');
});

export default app;