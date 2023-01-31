import router from "../../../backend/routes/index.js";
import Init from "./init.js";

function login() {
    document.querySelector("#login-form").addEventListener("submit", e => {
        e.preventDefault();

        const formData = FormData.extract("#login-form");
        
        const res = router.execRoute("api/users/create", formData);
    });
}

export default class Login extends Init {
    constructor() {
        super();
    }

    events() {
        login();
    }
}