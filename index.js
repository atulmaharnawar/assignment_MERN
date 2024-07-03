require('dotenv').config()
const express= require('express');
const app=express();

const dbConnect=require('./db')
dbConnect();

const port=5000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use('/api/auth',require('./routes/auth'));

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`)
})