import express from "express";
import individualsRouter from "./profiles/individual.router";
import departmentsRouter from "./profiles/department.router";
import installationsRouter from "./profiles/installation.router";
import centralsRouter from "./profiles/central.router";

const profilesRouter = express.Router();

profilesRouter.use("/individuals", individualsRouter);

profilesRouter.use("/departments", departmentsRouter);

profilesRouter.use("/installations", installationsRouter);

profilesRouter.use("/centrals", centralsRouter);

export default profilesRouter;
