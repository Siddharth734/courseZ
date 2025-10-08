function toggleSL(){
    const signup = document.getElementById("signupForm");
    const login = document.getElementById("loginForm");
    if(signup.style.display === 'none'){
        signup.style.display = 'flex';
        login.style.display = 'none';
    }else{
        signup.style.display = 'none';
        login.style.display = 'flex';
    }
}

function toggleMaker() {
    const main = document.getElementById("Maker");
    const signup = document.getElementById("signupForm");
    const login = document.getElementById("loginForm");
    const homeBtn = document.getElementById("home-btn");

    if(main.style.display === '' || main.style.display === 'block'){
        main.style.display = 'none';
        signup.style.display = 'flex';
        homeBtn.style.display = 'block';
    }else{
        main.style.display = 'block';
        signup.style.display = 'none';
        login.style.display = 'none';
        homeBtn.style.display = 'none';
    }
}

async function Signup() {
    try {
        const email = document.getElementById("signup-email-input");
        const name = document.getElementById("signup-name-input");
        const password = document.getElementById("signup-password-input");
        const response = await axios.post("http://localhost:3009/signup",{
            email: email.value,
            name: name.value,
            password: password.value
        });
    
        alert(`${response.data.message}`);

        email.value = "";
        name.value = "";
        password.value = "";
    } catch (error) {
        console.log(`Signup failed: ${error}`)
    }
}

async function Login() {
    try {
        const email = document.getElementById("login-email-input");
        const password = document.getElementById("login-password-input");
        const response = await axios.post("http://localhost:3009/login",{
            email: email.value,
            password: password.value
        });
    
        alert("Logged in successfully");

        email.value = "";
        password.value = "";
    } catch (error) {
        console.log(`Login failed: ${error}`)
    }
}

async function userInfo() {
    try {
        const response = await axios.get('http://localhost:3009/profile');
        alert(response.data.Photo);
    } catch (error) {
        alert(`error was: ${error}`)
    }
}