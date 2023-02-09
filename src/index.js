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
  res.json({ message: "API is ready." });
});

app.post("/api/auth/signup", async (req, res) => {
  const data = await AuthController.register({ user: req.user, ...req.body });
  res.json(data);
});

app.post("/api/auth/login", async (req, res) => {
  const data = await AuthController.login({ user: req.user, ...req.body });
  res.json(data);
});

app.get("/api/todos/:id", auth, async (req, res) => {
  const data = await TodoController.get({ user: req.user, ...req.params });
  res.json(data);
});

app.get("/api/todos", auth, async (req, res) => {
  console.log(req.query);
  const data = await TodoController.search({ user: req.user, ...req.query, ...req.body });
  res.json(data);
});

app.post("/api/todos", auth, async (req, res) => {
  const data = await TodoController.create({ user: req.user, ...req.body });
  console.log(data);
  res.json(data);
});

app.patch("/api/todos/:id", auth, async (req, res) => {
  const data = await TodoController.update({ user: req.user, ...req.params, ...req.body });
  res.json(data);
});

app.delete("/api/todos/:id", auth, async (req, res) => {
  const data = await TodoController.remove({ user: req.user, ...req.params });
  res.json(data);
});

app.post("/api/todos/search", auth, async (req, res) => {
  const data = await TodoController.search({ user: req.user, ...req.body });
  res.json(data);
});

app.post("/api/todos/order", auth, async (req, res) => {
  const data = await TodoController.order({ user: req.user, ...req.body });
  res.json(data);
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.use(error);

// app.listen(() => console.log(`Example app listening on port ${port}`), port);
app.listen(port, () => console.log(`Example app listening on port ${port}`));
