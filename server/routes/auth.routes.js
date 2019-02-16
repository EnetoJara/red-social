import { Router } from "express";
import { signin, signout } from "../constrollers/auth.controller";

const api = new Router();

api.post("/signin", signin);
api.get("/signout", signout);

export default api;
