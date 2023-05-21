const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express()
app.use(express.json());
app.use(cors());
require('dotenv').config()
// basic get  method---start
app.get('/',(req,res)=>{
  res.send('Server is OK Dude.....')
})
app.listen(port,()=>{
  console.log(`Server port is : ${port}`)
})
// basic get  method---end

// Database start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlkc9pb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   client.connect();
    const toyCarCollection=client.db('toy-car-data').collection('toy-car-data')
    // post method
app.post('/toycars',async(req,res)=>{
  const carInfo=req.body;
  console.log(carInfo);
  const result=await toyCarCollection.insertOne(carInfo);
  res.send(result)
})
// get method
app.get('/toycars',async(req,res)=>{

  const limit = parseInt(req.query.limit) || 20
  const page= parseInt(req.query.page) || 0
  const skip=page*limit
    const searchQuery = req.query.search || '';
      const query = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
  const result=await toyCarCollection.find(query).skip(skip).limit(limit).toArray();
  res.send(result)
})
// limit get method
app.get('/totaltoycars',async(req,res)=>{
  const result=await toyCarCollection.estimatedDocumentCount();
  res.send({totaltoycars:result})
})
// detail get method
app.get('/toycars/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await toyCarCollection.findOne(query);
  res.send(result)
})
// delete method
app.delete('/toycars/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await toyCarCollection.deleteOne(query);
  res.send(result)
})
// patch method

app.patch('/toycars/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)}
  const option={upsert: true}
  const updating=req.body;
  const carInfo={
    $set:{
   name: updating.name,
   quantity:updating.quantity,
   price:updating.price,
   rating:updating.rating,
   detail:updating.detail
  }};
  const result= await toyCarCollection.updateOne(filter,carInfo,option);
  res.send(result)
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Database end