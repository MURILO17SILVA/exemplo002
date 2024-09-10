import express from "express";
import cors from "cors";
import logger from "morgan";
import { AppDataSource } from "./data-source";
import trabalhosRouter from "./routes/trabalhos";

const app = express();

AppDataSource.initialize()
  .then(() => console.log("Data source inicializado"))
  .catch((erro) =>
    console.error("Erro ao tentar inicializar o data source", erro),
  );

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

app.use("/trabalhos", trabalhosRouter);
app.get("/", (req, res) => res.send("Feciaq API"));

export default app;
