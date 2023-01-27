import express from "express";
import * as AuthController from "./controller/Auth.js";
import * as TodoController from "./controller/Todo.js";
import auth from "./middlewares/auth.js";
import error from "./middlewares/error.js";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

const port = 3000;

/**
 * Routes
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

app.get("/todo/:id", auth, async (req, res) => {
  const data = await TodoController.get(req.params);
  res.json(data);
});

app.get("/todo", auth, async (req, res) => {
  const data = await TodoController.getAll();
  res.json(data);
});

app.post("/todo", auth, async (req, res) => {
  const data = await TodoController.create(req.body);
  res.json(data);
});

app.patch("/todo/:id", auth, async (req, res) => {
  const data = await TodoController.update({ ...req.params, ...req.body });
  res.json(data);
});

app.delete("/todo/:id", auth, async (req, res) => {
  const data = await TodoController.remove(req.params);
  res.json(data);
});

app.post("/todo/search", auth, async (req, res) => {
  const data = await TodoController.search(req.body);
  res.json(data);
});

app.get("*", (req, res) => {
  res.sendStatus(404);
});

app.use(error);

// app.listen(() => console.log(`Example app listening on port ${port}`), port);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
