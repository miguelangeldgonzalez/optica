import { Router } from "./router.js";
import { validator } from "./../validation.middleware.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = new Router("users");

router.addRoute(new Router("create", validator(createUserSchema), (req, res) => {
    console.log(req)
}))

export default router;