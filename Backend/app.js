require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnection = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());
dbConnection();

const frontendDir = path.join(__dirname, '..', 'Frontend');

app.use(express.static(frontendDir));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log('Server Running on Port', process.env.PORT);
});

