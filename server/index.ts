import express, { NextFunction, Request, Response } from "express";
import adminRouter from "../routes/admin";
import asignaturasRouter from "../routes/asignaturas";
import authRouter from "../routes/auth";
import docenteRouter from "../routes/docente";
import estudiantesRouter from "../routes/estudiantes";
import filesRouter from "../routes/files";
import geminiRouter from "../routes/gemini";
import materialsRouter from "../routes/materials";
import newsRouter from "../routes/news";
import statsRouter from "../routes/stats";
import studentsRouter from "../routes/students";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use("/api/auth", authRouter);
app.use("/api/asignaturas", asignaturasRouter);
app.use("/api/admin", adminRouter);
app.use("/api/docente", docenteRouter);
app.use("/api/estudiantes", estudiantesRouter);
app.use("/api/files", filesRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/news", newsRouter);
app.use("/api/gemini", geminiRouter);
app.use("/api/stats", statsRouter);
app.use("/api/students", studentsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error in Express server:", err);
  res.status(500).json({
    message: "Ha ocurrido un error inesperado.",
    detail: err.message,
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

export default app;
