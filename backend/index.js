import express from 'express';
import { connectDatabase } from './db/connection.js';
import { config } from 'dotenv';
import morgan from 'morgan';
config();

const app = express();

//for middlewares
app.use(morgan("dev"))


//connect database
connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('listening on port 5000');
});

export default app;