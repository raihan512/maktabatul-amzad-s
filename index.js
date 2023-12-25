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
    // ---------- Get book categoryId by push method
    app.post("/api/books/getcategory", async (req, res) => {
      const query = req.body;
      console.log(query);
      const getBooks = await books.find(query).toArray();
      res.status(200).json(getBooks);
    });
    // ---------- Get book subcategoryid by push method
    // app.post("/api/books/getcategory", async (req, res) => {
    //   const query = req.body;
    //   const getBooks = await books.find(query).toArray();
    //   res.status(200).json(getBooks);
    // });
    // ---------- Add Book
    app.post("/api/addbook", async (req, res) => {
      const book = await books.insertOne(req.body);
      res.send(book);
    });
    // ---------- Delete Book
    app.delete("/api/deletebook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deleteBook = await books.deleteOne(query);
      res.send(deleteBook);
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
    // ---------- Get writer by post method
    app.post("/api/writers/getwriters", async (req, res) => {
      const writerIds = req.body;
      const query = { writerId: { $in: writerIds } };
      const writer = await writers.find(query).toArray();
      res.status(200).json(writer);
    });
    // ---------- Add Writer
    app.post("/api/addwriter", async (req, res) => {
      const writer = await writers.insertOne(req.body);
      res.send(writer);
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
    // ---------- Get publisher by id
    app.get("/api/publishers/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { publisherId: req.params.id };
      const publisher = await publishers.findOne(query);
      res.status(200).json(publisher);
    });
    // ---------- Get publisher by post method
    app.post("/api/publishers/getpublisher", async (req, res) => {
      const queryArray = req.body;
      const query = {};
      queryArray.forEach((item) => {
        const [field, value] = item.split(":");
        query[field] = value;
      });
      const publisher = await publishers.find(query).toArray();
      res.status(200).json(publisher);
    });
    // ----------------------------------------------------------Category Route----------------------------------------------------------
    app.get("/api/categories", async (req, res) => {
      const allCategories = await categories.find().toArray();
      res.status(200).json(allCategories);
    });
    // ---------- Get category by post method
    app.post("/api/categories/getcategory", async (req, res) => {
      const query = req.body;
      const category = await categories.find(query).toArray();
      res.status(200).json(category);
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
    // ---------- Get subcategory by post method
    app.post("/api/subcategories/getsubCategory", async (req, res) => {
      const query = req.body;
      const subCategory = await subcategories.find(query).toArray();
      res.status(200).json(subCategory);
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
