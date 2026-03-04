import express from "express";

const app = express();

app.use(express.json());

app.use(require("./routes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});