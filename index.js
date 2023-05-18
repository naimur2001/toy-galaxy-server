const express=require('express');
const cors=require('cors');
const port=process.env.PORT || 5000;
const app=express()
app.use(express.json());
app.use(cors());
require('dotenv').config()
// basic get  method---start
app.get('/',(req,res)=>{
  res.send('Server is OK Dude.....')
})
app.listen(port,(req,res)=>{
  console.log(`Server port is : ${port}`)
})
// basic get  method---end
