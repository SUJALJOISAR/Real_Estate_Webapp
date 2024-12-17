import {Router} from "express";
import { test } from "../controllers/usercontroller.js";

const appRouter =Router();

appRouter.get('/test',test);

export default appRouter;