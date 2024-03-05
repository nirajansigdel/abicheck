const express = require('express');
const userRouter = require('./Router/router.js');
const stripe = require("stripe")('sk_test_51OqWfFCMM59Ao6V6mkmptxazmOIdbBazLGlaVio3OAfL2GC8722klJqm7BM4tS7CXzlZqS2uNA7NsQDp5afxzjso00umxBReef');

const app=express();
app.use(express());

const cors = require('cors');
// Use cors middleware
app.use(cors());

app.use(express.json());


let port = 3000
// Use the user router
app.use('/api', userRouter);
app.use(express.json());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
