const { MongoClient } = require('mongodb');

// Replace YOUR_PASSWORD with your actual password
const uri = "mongodb+srv://igbouser:Nnonye2007@cluster0.hhcq2vs.mongodb.net/?retryWrites=true&w=majority";




async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (e) {
    console.error("❌ Connection error:", e);
  } finally {
    await client.close();
  }
}

run();
