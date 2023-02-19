import { Router } from "./router.js";
import User from '../models/users.model.js';
import AuthService from "../services/auth.service.js";

const router = new Router('auth');

router.addRoute(new Router('startSessionWithId', async (req, res) => {
    const auth = await AuthService.startSessionWithId(req.body.id)

    return auth;
}))

export default router;