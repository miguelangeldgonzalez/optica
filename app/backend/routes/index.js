import { Router } from "./router.js";
import { formTransform } from "./../middlewares/form.middleware.js";

import UsersRouter from "./user.router.js";

const router = new Router("api");

router.addMiddleware(formTransform);

router.addRoute(UsersRouter);

export default router;