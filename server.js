const express = require('express');
const cors = require('cors');
require('dotenv').config();

//app
const app = express();
app.use(cors());

// DB Connection:
const dbconnection = require('./db');
dbconnection()

// middlewares
app.use(express.json());
app.use(cors());


// ROUETES 
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

const StaffSignUP = require('./routes/staff');  
const SatffAuth = require('./routes/staffAuth');  

app.use('/api/staff', StaffSignUP); 
app.use('/api/staff/auth', SatffAuth); 

 
//Port 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Port listening on "+ port)); 