function init() {
    loadallCourses();
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
        const response = await axios.post("http://localhost:3009/user/signup",{
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
        const response = await axios.post("http://localhost:3009/user/login",{
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

async function loadallCourses() {
    try {
        const response  = await axios.get("http://localhost:3009/course/all");

        document.getElementById("course-container").innerHTML = "";
        response.data.courses.forEach(c => {
            document.getElementById("course-container").innerHTML += courseCard(c);
        });
    } catch (error) {
        alert(`error while loading courses: ${error}`);
    }
}

function courseCard(c){
    return`<div class="group rounded-xl shadow-md border border-gray-300 hover:border-gray-500 hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden ">
                <img class="object-cover h-[239px] w-[317px]"
                    src=${c.image}
                    alt="/">
                <div class="flex flex-col gap-4 p-4">
                    <h1 class="text-xl mb-[6%]">${c.title}</h1>
                    <p class="text-lg bg-gray-100 px-4 text-red-400">₹ ${c.cost}/-</p>
                    <div class="flex gap-1">
                        <button class="flex-1 bg-[#393E46] px-4 py-2 rounded-2xl text-white hover:bg-[#222831]">Buy Now <i
                            class="ri-arrow-right-line"></i>
                        </button>
                        <button class="border-2 border-red-400 rounded-full text-red-400 w-[10%] hover:text-red-300 focus:w-[15%] focus:text-white focus:bg-red-400 transition-all duration-300 ease-in-out">
                        <i class="ri-thumb-up-fill"></i>
                        </button>
                    </div>
                </div>
            </div>`;
}

init();