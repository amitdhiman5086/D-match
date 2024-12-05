const express = require("express");
const app = express();
const port = process.env.PORT || 3010;

app.use((req, res) => {
  res.send("Hii I am Here");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
