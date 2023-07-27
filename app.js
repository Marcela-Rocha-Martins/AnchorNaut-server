require("./db");
require("dotenv/config");

const express = require("express");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();
app.use(express.json()); // Adicionar este middleware para analisar JSON no corpo das requisições

// Start handling routes here
const allRoutes = require("./routes/index");
app.use("/", allRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", isAuthenticated, taskRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const dreamAssistantRouter = require("./routes/dreamAssistant.routes");
app.use("/api", isAuthenticated, dreamAssistantRouter);

require("./error-handling")(app);

module.exports = app;

