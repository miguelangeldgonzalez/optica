import Init from "./init.js";

import router from "../../../backend/routes/index.js";

export default class Registro extends Init {
    constructor () {
        super();
    }

    events() {
        const data = new FormData();
        data.append("name", "Miguel");
        router.execRoute('api/users/create', data).then(response => {
            console.log(response)
        })

        const $btnSignIn= document.querySelector('.sign-in-btn'),
              $btnSignUp = document.querySelector('.sign-up-btn'),  
              $signUp = document.querySelector('.sign-up'),
              $signIn  = document.querySelector('.sign-in');
        
        document.addEventListener('click', e => {
            if (e.target === $btnSignIn || e.target === $btnSignUp) {
                $signIn.classList.toggle('active');
                $signUp.classList.toggle('active')
            }
        });

        const nombre = document.getElementById("name")
        const email = document.getElementById("email")
        const pass = document.getElementById("password")
        const form = document.getElementById("form")
        const parrafo = document.getElementById("warnings")

        form.addEventListener("submit", e=>{
            e.preventDefault()
            let warnings = ""
            let entrar = false
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
            parrafo.innerHTML = ""
            if(nombre.value.length <6){
                warnings += `El nombre no es valido <br>`
                entrar = true
            }
            if(!regexEmail.test(email.value)){
                warnings += `El email no es valido <br>`
                entrar = true
            }
            if(pass.value.length < 8){
                warnings += `La contraseña no es valida <br>`
                entrar = true
            }

            if(entrar){
                parrafo.innerHTML = warnings
            }else{
                parrafo.innerHTML = "Enviado"
            }
        })
    }
}


