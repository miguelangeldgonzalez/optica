import { Router } from "./router.js";
import { createUserSchema } from "../schemas/user.schema.js";
import { validator } from "../middlewares/validation.middleware.js";

const router = new Router("users");

router.addRoute(new Router("create", validator(createUserSchema), (req, res) => {
    console.log(req)
}))

export default router;