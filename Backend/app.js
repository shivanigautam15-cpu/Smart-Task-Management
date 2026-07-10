require("dotenv").config();

const express=require("express");
const path = require("path");
const dbConnection= require("./config/db")
const app=express();

app.use(express.json());
dbConnection();

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('*any', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
app.listen(process.env.PORT,()=>{

console.log("Server Running on Port",process.env.PORT);

});

