import express from "express";
import bodyParser from "body-parser";
import pkg from 'pg';
import 'dotenv/config';

const app = express();
const port = 3000;

const {Pool} = pkg;
const db = new Pool (
  {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", (req, res) => {
  db.query("SELECT * FROM items ORDER BY id ASC", (err, result) => {
    if(err){
      console.log("Error executing query", err.stack);
      return res.status(500).send("Database error");
    }
    else{
      res.render("index.ejs", {
        listTitle: "Things TO Do",
        listItems: result.rows,
      });
    }
    
  });
  
});


app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("INSERT INTO items (title) VALUES ($1) ", [item], (err) => {
    if(err){
      console.log("Error executing query", err.stack);
      return res.status(500).send("Database error");
    }
    else{
      res.redirect("/");;
    }
  });
  
});

app.post("/edit", (req, res) => {
  const {updatedItemId, updatedItemTitle} = req.body;
  db.query("UPDATE items SET title = $1 WHERE id = $2 ", [updatedItemTitle, updatedItemId], (err) => {
    if(err){
      console.log("Error executing query", err.stack);
      return res.status(500).send("Database error");
    }
    else{
      res.redirect("/");
    }
  } );
});

app.post("/delete", (req, res) => {
  const {deleteItemId} = req.body;
  db.query("DELETE FROM items WHERE id = $1", [deleteItemId], (err) => {
    if(err){
      console.log("Error executing query", err.stack);
      return res.status(500).send("Databse error");
    }
    else{
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
