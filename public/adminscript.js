function init() {
    togglepage();
    loadcourses();
}

function removetoken() {
    localStorage.removeItem("token");
    togglepage();
}

function togglepage() {
    const aLog = document.getElementById("admin-login");
    const aPg = document.getElementById("admin-page");

    // if(localStorage.getItem("token") === null){
    //     aLog.classList.remove('hidden');
    //     aPg.classList.add('hidden');
    // }else{
        aPg.classList.remove('hidden');
        aLog.classList.add('hidden');
    // }
}

async function signup() {
    try {
        const accessname = document.getElementById("admin-email");
        const password = document.getElementById("admin-password");
    
        const response = await axios.post("http://localhost:3009/admin/login",{
            accessname: accessname.value,
            password: password.value
        });

        alert("Logged in");

        localStorage.setItem("token",response.data.token);

        togglepage();
    } catch (error) {
        alert(`error logging in: ${error}`)
    }
}

async function courseAdd() {
    try {
        const title = document.getElementById("course-title");
        const cost = document.getElementById("course-cost");

        if(title.value.trim() === "" || cost.value.trim() ===""){
            alert("EMPTY INPUT FIELD!!")
            return;
        }
        
        const response = await axios.post("http://localhost:3009/admin/course",{
            title: title.value,
            cost: cost.value
        });

        title.value = "";
        cost.value = "";

        alert(`${response.data.message}`)

        loadcourses();
    } catch (error) {
        alert(`error in adding new course: ${error}`)
    }
}

async function loadcourses() {
    try {
        const response = await axios.get("http://localhost:3009/admin/course");

        document.getElementById("courses").innerHTML = "";
        response.data.courses.forEach(c => {
            document.getElementById("courses").innerHTML += courseDOM(c);
        });
    } catch (error) {
        alert(`error loading courses: ${error}`)
    }
}

async function deleteCourse(id) {
    try {
        const response = await axios.delete("http://localhost:3009/admin/course",{
            data: {
                id: id
            }
        });
        // axios.post(url, data, config) data is the 2nd parameter
        // axios.delete(url, config) config is the 2nd parameter(no seperate data parameter)
        // thus we put object inside a data key

        alert("course was deleted sucessfully")

        loadcourses();
    } catch (error) {
        alert(`the deletion was interrupted: ${error}`)
    }
}

function courseDOM(c) {
    return `<div class="group relative h-[375px] w-[250px] bg-gradient-to-b rounded-xl border border-gray-300 text-center overflow-hidden"> 
                <img class="object-cover transition-transform duration-700" src=${c.image} 
                alt="/">
                <h2 class="text-red-400 font-bold p-1 bg-gray-300">${c.title}</h2>
                <p class="p-1 text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, praesentium?</p>
                <h2 class="text-red-400 font-bold px-4 text-left hover:text-gray-300">COST: ₹${c.cost}/-</h2>
                <div class="flex justify-around border-t border-gray-100">
                    <button class="text-red-400 text-2xl p-3 w-[50%] hover:bg-red-400 hover:text-white transition-all duration-300 ease-in-out"
                    onclick="deleteCourse('${c._id}')">
                        <i class="ri-close-circle-line" on></i>
                    </button>
                    <button class="text-white text-2xl p-3 w-[50%] hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
                    onclick="toggleEdit('${c._id}')">
                        <i class="ri-edit-box-line"></i>
                    </button>
                </div>

                <div id='${c._id}' class="absolute bottom-[-50%] h-[50%] w-full rounded-b-xl bg-transparent transition-all duration-300 ease-in-out">
                    <input type="text" placeholder="Name" class="text-red-400 text-center py-1 px-5 font-bold bg-gray-300">
                    <p class="p-1 bg-red-400 text-red-400 opacity-[50%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, praesentium?</p>
                    <input type="text" placeholder="COST" class="text-red-400 text-center px-5 font-bold bg-black">
                    <div class="flex justify-around border-t border-gray-100">
                        <button class="text-yellow-300 font-extrabold bg-black text-xl p-3 w-[50%] hover:bg-yellow-300 hover:text-black transition-all duration-300 ease-in-out"
                        onclick="editCourse()">
                            Save
                        </button>
                        <button class="text-white font-extrabold bg-black text-xl p-3 w-[50%] hover:bg-red-400 hover:text-white transition-all duration-300 ease-in-out"
                        onclick="toggleEdit('${c._id}')">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>`
}

function toggleEdit(id) {
    editsWindow = document.getElementById(id);
    if (editsWindow.classList.contains('bottom-[-50%]')) {
        editsWindow.classList.remove('bottom-[-50%]');
        editsWindow.classList.add('bottom-0');
    }else{
        editsWindow.classList.remove('bottom-0');
        editsWindow.classList.add('bottom-[-50%]');
    }
}

// async function editCourse() {
    
// }

init();