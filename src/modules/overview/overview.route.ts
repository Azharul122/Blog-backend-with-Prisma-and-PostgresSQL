import expresss from "express";
import { overviewController } from "./overview.controller";

const router = expresss.Router();

router.get("/", overviewController.getAllOverview);

export const overviewRouter = router;
