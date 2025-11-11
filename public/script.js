const isLocal = window.location.origin.includes("localhost");
const apiBase = isLocal 
  ? "http://localhost:3009"
  : "https://api-coursez.onrender.com";

function init() {
    if(window.location.pathname.split('/')[1] === "home.html"){
        loadallCourses();
    }
    else if(window.location.pathname.split('/')[1] === "index.html"){
        loadMyCourses();
    }
    userInfo();
}

function toggleMaker() {
    const main = document.getElementById("Maker");
    const signup = document.getElementById("signupForm");
    const login = document.getElementById("loginForm");
    const homeBtn = document.getElementById("home-btn");

    if(main.classList.contains('hidden')){
        main.classList.remove('hidden');
        signup.classList.add('hidden');
        login.classList.add('hidden');
        homeBtn.classList.add('hidden');
    }else{
        main.classList.add('hidden');
        login.classList.remove('hidden');
        homeBtn.classList.remove('hidden');
    }
}

function toggleSL() {
    const signup = document.getElementById("signupForm");
    const login = document.getElementById("loginForm");

    if(signup.classList.contains('hidden')){
        signup.classList.remove('hidden');
        login.classList.add('hidden');
    }else{
        signup.classList.add('hidden');
        login.classList.remove('hidden');
    }
}

async function Signup() {
    try {
        const email = document.getElementById("signup-email-input");
        const name = document.getElementById("signup-name-input");
        const password = document.getElementById("signup-password-input");
        const response = await axios.post(`${apiBase}/user/signup`,{
            email: email.value,
            name: name.value,
            password: password.value
        });
    
        alert(`${response.data.message}`);

        email.value = "";
        name.value = "";
        password.value = "";

        toggleSL();
    } catch (error) {
        console.log(`Signup failed: ${error}`)
    }
}

async function Login() {
    try {
        const email = document.getElementById("login-email-input");
        const password = document.getElementById("login-password-input");
        const response = await axios.post(`${apiBase}/user/login`,{
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
        const response = await axios.get(`${apiBase}/user/profile`);

        if(window.location.pathname.split('/')[1] == "home.html"){
            document.getElementById("profile-pic").innerHTML = `
            <img class="h-[50px] w-[50px] rounded-full" 
                referrerpolicy="no-referrer"
                src="${response.data.Photo}" 
                alt="">`;

            // alert(response.data.Photo);
        }
        else if(window.location.pathname.split('/')[1] == "index.html"){
            document.getElementById("mycourse-profile").innerHTML = `
            <a href="#" class="flex items-center gap-2 border-2 border-gray-300 px-4 py-2 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                <span class="text-lg font-semibold text-gray-600 group-hover:text-green-600">Bal: </span>
                <span class="text-lg text-gray-700 group-hover:text-green-700">₹ ${response.data.Balance}</span>
            </a>
            <img src="${response.data.Photo}" alt="profile pic"
                class="h-[66px] w-[66px] rounded-full p-2">`;
        }
    } catch (error) {
        alert(`error was: ${error}`)
    }
}

async function loadallCourses() {
    try {
        const response  = await axios.get(`${apiBase}/course/all`);

        document.getElementById("course-container").innerHTML = "";
        response.data.courses.forEach(c => {
            document.getElementById("course-container").innerHTML += courseCard(c);
        });
    } catch (error) {
        alert(`error while loading courses: ${error}`);
    }
}

function courseCard(c){
    return`<div class="group rounded-xl shadow-md border border-gray-300 hover:border-gray-400 hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden ">
                <img class="object-cover h-[239px] w-[317px]"
                    src=${c.image}
                    alt="/">
                <div class="flex flex-col gap-4 p-4">
                    <h1 class="text-xl mb-[6%]">${c.title}</h1>
                    <p class="text-lg bg-gray-100 px-4 text-red-400">₹ ${c.cost}/-</p>
                    <div class="flex gap-1">
                        <button class="flex-1 bg-[#393E46] px-4 py-2 rounded-2xl text-white hover:bg-[#222831]"
                        onclick="purchaseCourse('${c._id}')">Buy Now <i
                            class="ri-arrow-right-line"></i>
                        </button>
                        <button class="border-2 border-red-400 rounded-full text-red-400 w-[10%] hover:text-red-300 focus:w-[15%] focus:text-white focus:bg-red-400 transition-all duration-300 ease-in-out">
                        <i class="ri-thumb-up-fill"></i>
                        </button>
                    </div>
                </div>
            </div>`;
}

async function purchaseCourse(id) {
    try {        
        const response = await axios.put(`${apiBase}/user/purchase`,{
            id: id
        });

        alert(response.data.message);
    } catch (error) {
        alert(`error purchasing course: ${error}`)
    }
}

async function loadMyCourses() {
    try {
        const courseContainer = document.getElementById("courses");
        const response = await axios.get(`${apiBase}/user/mycourses`);
    
        courseContainer.innerHTML = "";
        response.data.courses.forEach(c => {
            courseContainer.innerHTML += mycourseCard(c);
        });
    } catch (error) {
        alert(`error loading myCourses: ${error}`)
    }
}

function mycourseCard(c){
    return `<div class="group h-[250px] w-[300px] border border-gray-400 rounded-2xl hover:shadow-xl hover:border-0 overflow-hidden">
            <div class="text-3xl h-[58%] font-bold bg-[url(${c.image})] bg-cover bg-center rounded-t-2xl p-10 hover:underline"></div>
            <div class="rounded-[5px] text-xl p-4">${c.title}</div>
            <button class="absolute rounded-xl m-4 p-2 bg-[#393E46] text-white hover:bg-[#222831]"
            onclick="">Open<i class="ri-expand-diagonal-2-line"></i></button>
          </div>`
}

init();