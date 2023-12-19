const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Maktabatul Amzad Server");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://amzad-admin:nKN0sPdlGQF1IqjP@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("maktabatul-amzad");
    const books = database.collection("books");
    const writers = database.collection("writers");
    const editors = database.collection("editors");
    const publishers = database.collection("publishers");
    const categories = database.collection("categories");
    const subcategories = database.collection("subcategories");

    // ----------------------------------------------------------Book Route----------------------------------------------------------
    app.get("/api/books", async (req, res) => {
      const allBooks = await books.find().toArray();
      res.status(200).json(allBooks);
    });
    // ---------- Get book by id
    app.get("/api/books/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const book = await books.findOne(query);
      res.status(200).json(book);
    });
    // ---------- Add Book
    app.post("/api/addbook", async (req, res) => {
      const book = await books.insertOne(req.body);
      res.send(book);
    });
    // ----------------------------------------------------------Writer Route----------------------------------------------------------
    app.get("/api/writers", async (req, res) => {
      const allWriters = await writers.find().toArray();
      res.status(200).json(allWriters);
    });
    // ---------- Get writer by writerId
    app.get("/api/writers/:writerId", async (req, res) => {
      const writer = await writers.findOne({ writerId: req.params.writerId });
      res.status(200).json(writer);
    });
    // ----------------------------------------------------------Editor Route----------------------------------------------------------
    app.get("/api/editors", async (req, res) => {
      const allEditors = await editors.find().toArray();
      res.status(200).json(allEditors);
    });
    // ----------------------------------------------------------Publisher Route----------------------------------------------------------
    app.get("/api/publishers", async (req, res) => {
      const allPublishers = await publishers.find().toArray();
      res.status(200).json(allPublishers);
    });
    // ----------------------------------------------------------Category Route----------------------------------------------------------
    app.get("/api/categories", async (req, res) => {
      const allCategories = await categories.find().toArray();
      res.status(200).json(allCategories);
    });
    // ---------- Get category by categoryId
    app.get("/api/categories/:categoryId", async (req, res) => {
      const category = await categories.findOne({
        categoryId: req.params.categoryId,
      });
      res.status(200).json(category);
    });
    // ----------------------------------------------------------Sub Category Route----------------------------------------------------------
    app.get("/api/subcategories", async (req, res) => {
      const allSubCategories = await subcategories.find().toArray();
      res.status(200).json(allSubCategories);
    });
    // ---------- Get sub category by subCategoryId
    app.get("/api/subcategories/:subCategoryId", async (req, res) => {
      const subCategory = await subcategories.findOne({
        subCategoryId: req.params.subCategoryId,
      });
      res.status(200).json(subCategory);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database Connected");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
