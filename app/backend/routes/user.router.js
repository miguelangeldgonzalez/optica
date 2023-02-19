import { Router } from "./router.js";
import User from '../models/index.js';
import { createUserSchema } from "../schemas/user.schema.js";
import { validator } from "../middlewares/validation.middleware.js";

const router = new Router("users");

router.addRoute(new Router("create", validator(createUserSchema), async (req, res) => {
    return User.create(req.body)
}))

export default router;