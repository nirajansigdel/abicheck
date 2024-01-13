const express = require('express');
const userRouter = require('./Router/router.js');
const app=express();
app.use(express());
const cors = require('cors');
// Use cors middleware
app.use(cors());

app.use(express.json());

// Use the user router
app.use('/api', userRouter);
app.use(express.json());

app.listen(3000, () => {
  console.log(`Server started on port`);
});
