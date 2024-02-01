import express from "express";
import * as AuthController from "./controller/Auth.js";
import * as TodoController from "./controller/Todo.js";
import auth from "./middlewares/auth.js";
import error from "./middlewares/error.js";
import asyncHandler from "./middlewares/asyncHandler.js";

const app = express();
app.set("json spaces", 2);
app.use(express.json());

const port = process.env.PORT;

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

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const data = await AuthController.login({ user: req.user, ...req.body });
    res.json(data);
  })
);

app.get(
  "/api/todos/:id",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.get({ user: req.user, ...req.params });
    res.json(data);
  })
);

app.get(
  "/api/todos",
  auth,
  asyncHandler(async (req, res) => {
    console.log("req.user")
    console.log(req.user)
    const data = await TodoController.search({
      user: req.user,
      ...req.query,
      ...req.body,
    });
    
    res.json(data);
  })
  
);

app.post(
  "/api/todos",
  auth,
  asyncHandler(async (req, res) => {
    console.log("req.user")
    console.log(req.user)
    const data = await TodoController.create({ user: req.user, ...req.body });
    res.json(data);
  })
);

app.patch(
  "/api/todos/:id",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.update({
      user: req.user,
      ...req.params,
      ...req.body,
    });
    res.json(data);
  })
);

app.delete(
  "/api/todos/:id",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.remove({ user: req.user, ...req.params });
    res.json(data);
  })
);

app.post(
  "/api/todos/search",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.search({ user: req.user, ...req.body });
    res.json(data);
  })
);

app.post(
  "/api/todos/order",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.order({ user: req.user, ...req.body });
    res.json(data);
  })
);

app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

//app.listen(() => console.log(`Example app listening on port ${port}`), port);
app.listen(3000, '0.0.0.0');
app.use(error);
