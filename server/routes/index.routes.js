import { Router } from "express";

import { HelloWorld } from "../constrollers/index.controller";
const api = new Router();

api.get("/", HelloWorld);

export default api;
