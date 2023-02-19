import { Router } from "./router.js";
import { formTransformObject, formTransformElement } from "./../middlewares/form.middleware.js";

import UsersRouter from "./user.router.js";
import AuthRotuer from "./auth.router.js";

const router = new Router("api");

router.addMiddleware(formTransformObject);
router.addMiddleware(formTransformElement);

router.addRoute(UsersRouter);
router.addRoute(AuthRotuer);

export default router;