import express from "express";
import * as TodoController from "./controller/Todo.js";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("API is ready.");
});

app.post("/todo", async (req, res) => {
  const todo = await TodoController.create(req.body);
  res.json(todo);
});

app.get("*", (req, res) => {
  res.status(404).send("Not found.");
});

// app.listen(() => console.log(`Example app listening on port ${port}`), port);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
