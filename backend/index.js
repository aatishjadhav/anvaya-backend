const { initializeDB } = require("./db/db.connect");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDB();

const authRoutes = require("./routes/auth.routes");
const commentRoutes = require("./routes/comments.routes");
const leadRoutes = require("./routes/leads.routes");
const salesAgentRoutes = require("./routes/salesAgent.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/lead", commentRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/agents", salesAgentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


