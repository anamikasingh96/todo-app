const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
});

// let todo = {
//   title: "shopping",
//   posting_date: "15/06/22",
//   description: "this is a list of groceries",
//   state: "true",
// };

// 1-GET Get All Task
app.get("/task", async (req, res) => {
  //res.send(todo);
  let task = await pool.query("select * from todo");
  res.send({ data: task.rows });
});

// 2- GET Get Task by Id
app.get("/task/:id", async (req, res) => {
  let idReceived = req.params.id;
  let queryRes = await pool.query("select * from todo where id=$1", [
    idReceived,
  ]);
  res.send({ data: queryRes.rows });
});

// 3-GET Get Task by status
app.get("/task/:status", async (req, res) => {
  let statusReceived = req.params.status;
  let queryRes = await pool.query("select * from todo where status=$1", [
    statusReceived,
  ]);
  res.send({ data: queryRes.rows });
});

// 4-POST Add Task
app.post("/task", async (req, res) => {
    let {title, description } = req.body;
  await pool.query(
    "insert into todo (title, description) values($1,$2)",[title, description]
  );
  res.send({ data: "task added" });
});

// 5- PUT Update Task by Id
app.put("/task/:id", async (req, res) => {
  let idReceived = req.params.id;
  let { title, description} = req.body;
  await pool.query("update todo set title=$1, description=$2 where id=$3", [
    title,
    description,
    idReceived,
  ]);
  res.send("updated");
});

// 6- PUT Complete task by Id
app.put("/task/complete/:id", async (req, res) => {
  let idReceived = req.params.id;
  await pool.query("update todo set state=true where id=$1",[idReceived]);
  res.send("completed");
});

// 7-DEL Delete Task by Id
app.delete("/task/:id", async (req, res) => {
  let idReceived = req.params.id;
  await pool.query("delete from todo where id=$1", [idReceived]);
  res.send("deleted");
});

app.listen(port, () => {
  console.log("listening to localhost:3000");
});
