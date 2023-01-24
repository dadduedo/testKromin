import express from "express";
import * as AuthController from "./controller/Auth.js";
import * as TodoController from "./controller/Todo.js";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

const port = 3000;

/**
 * ROUTES
 */
app.get("/", (req, res) => {
  res.send("API is ready.");
});

app.post("/auth/register", async (req, res) => {
  const data = await AuthController.register(req.body);
  res.json(data);
});

app.post("/auth/login", async (req, res) => {
  const data = await AuthController.login(req.body);
  res.json(data);
});

app.get("/todo/:id", async (req, res) => {
  const data = await TodoController.get(req.params);
  res.json(data);
});

app.get("/todo", async (req, res) => {
  const data = await TodoController.getAll();
  res.json(data);
});

app.post("/todo", async (req, res) => {
  const data = await TodoController.create(req.body);
  res.json(data);
});

app.post("/todo/search", async (req, res) => {
  const data = await TodoController.search(req.body);
  res.json(data);
});

app.get("*", (req, res) => {
  res.status(404).send("Not found.");
});

// app.listen(() => console.log(`Example app listening on port ${port}`), port);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
