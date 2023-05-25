import Init from "./init.js";

import UserController from "../../../backend/controllers/user.controller.js";

export default class Registro extends Init {
    singUpActive = true;

    constructor () {
        super();
    }

    async login() {
        document.querySelector("#login_form").addEventListener('submit', async e => {
            e.preventDefault();
            
            const data = FormData.extractFromElement('#login_form');
            const session = await UserController.startSession(data);

            if(session) {
                window.location = '/ventas';
            } else {
                alert('Usuario o contraseña no valido');
            }
        })
    }

    async singUp() {
        this.registerForm.addEventListener('submit', async e => {
            e.preventDefault();
            let error = false;
            document.querySelectorAll('.label_error').forEach(label => {
                if(!label.classList.contains('invisible')) label.classList.add('invisible');
            })

            document.querySelectorAll('#label_error_email > *').forEach(span => {
                if(!span.classList.contains('display_none')) span.classList.add('display_none');
            })

            const result = await UserController.createAndStartUser(FormData.extractFromElement('#singup_form'))

            if(typeof result.error == 'string') {
                error = true;
                if(result.error.includes('Duplicate entry')) {
                    if(result.error.includes("for key 'correo'")) {
                        document.querySelector('#label_error_email').classList.remove('invisible');
                        document.querySelector('#label_error_email #duplicate').classList.remove('display_none');
                    }
                    if(result.error.includes("for key 'nombre_usuario'")) document.querySelector('#label_error_username').classList.remove('invisible');
                }
            }

            if (result.validationError) {
                error = true;
                if(result.validationError.password) {
                    this.labelErrorPassword.classList.remove('invisible');

                    if (result.validationError.password.lengthMin) {
                        document.querySelector('#minLength').classList.remove('check');
                    } else {
                        document.querySelector('#minLength').classList.add('check');
                    }

                    if (result.validationError.password.alphanumeric) {
                        document.querySelector('#alphanumeric').classList.remove('check');
                    } else {
                        document.querySelector('#alphanumeric').classList.add('check');
                    }

                }

                if (result.validationError.correo) {
                    document.querySelector('#label_error_email').classList.remove('invisible');
                    document.querySelector('#label_error_email #wrong').classList.remove('display_none');
                }
            }

            if(!error) window.location = '/ventas';
        })
    }

    async loginOrSingUp() {
        const eventFunction = e => {
            if (this.singUpActive) {
                this.registerButton.classList.add('display_none')
                this.loginButton.classList.remove('display_none')

                this.loginForm.style.transform = 'translateY(250%)';
                this.loginForm.style.transition = '.75s';
                setTimeout(() => {
                    this.registerForm.style.transform = 'translateY(0)';
                    this.registerForm.style.transition = '.75s';
                    
                }, 400)
            } else {
                this.registerButton.classList.remove('display_none')
                this.loginButton.classList.add('display_none')

                this.registerForm.style.transform = 'translateY(250%)';
                this.registerForm.style.transition = '.75s';
                setTimeout(() => {
                    this.loginForm.style.transform = 'translateY(130%)';
                    this.loginForm.style.transition = '.75s';
                    
                }, 400)
            }
            this.singUpActive = !this.singUpActive;
        }

        this.loginButton.addEventListener('click', e => eventFunction(e));
        this.registerButton.addEventListener('click', e => eventFunction(e));
    }

    load() {
        UserController.recoverSession().then(user => {
            if (user.length != 0) window.location = '/ventas';
        })
        
        this.loginButton = document.querySelector('#login_button');
        this.loginForm = document.querySelector('.form_login__container');
        this.loginFormButton = document.querySelector('#login_form_button');

        this.registerButton = document.querySelector('#register_button');
        this.registerForm = document.querySelector('.form_singup__container');
        this.registerFormButton = document.querySelector('#register_form_button');

        this.labelErrorUsername = document.querySelector('#label_error_username');
        this.labelErrorPassword = document.querySelector('#label_error_password');

        this.loginOrSingUp();
        this.singUp();
        this.login();
    }


}


