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

    if(localStorage.getItem("token") === null){
        aLog.classList.remove('hidden');
        aPg.classList.add('hidden');
    }else{
        aPg.classList.remove('hidden');
        aLog.classList.add('hidden');
    }
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
        const img = document.getElementById("course-img");

        if(title.value.trim() === "" || cost.value.trim() ===""){
            alert("EMPTY INPUT FIELD!!")
            return;
        }
        
        const response = await axios.post("http://localhost:3009/admin/course",{
            title: title.value,
            cost: cost.value,
            image: img.value
        });

        title.value = "";
        cost.value = "";
        img.value = "";

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
                <img class="object-cover h-[183px] w-[248px]" src=${c.image} 
                alt="/">
                <h2 class="text-red-400 font-bold p-1 bg-gray-300">${c.title}</h2>
                <p class="p-1 text-[#949494]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, praesentium?</p>
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
                    <input id="edit-img${c._id}" type="text" placeholder="Image Link" class="h-[184px] text-gray-100 text-center py-1 px-5 font-bold bg-gray-500 opacity-70">
                    <input id="edit-title${c._id}" type="text" placeholder="Title" class="text-red-400 text-center py-1 px-5 font-bold bg-gray-300">
                    <p class="p-1 bg-red-400 text-red-400 opacity-[50%]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, praesentium?</p>
                    <input id="edit-cost${c._id}" type="number" min="50" max="7999" placeholder="COST" class="text-red-400 text-center px-5 font-bold bg-[#333333] w-full">
                    <div class="flex justify-around border-t border-gray-100">
                        <button class="text-yellow-300 font-extrabold bg-[#333333] text-xl p-3 w-[50%] hover:bg-yellow-300 hover:text-[#333333] transition-all duration-300 ease-in-out"
                        onclick="editCourse('${c._id}'); toggleEdit('${c._id}')">
                            Save
                        </button>
                        <button class="text-white font-extrabold bg-[#333333] text-xl p-3 w-[50%] hover:bg-red-400 hover:text-white transition-all duration-300 ease-in-out"
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
        editsWindow.classList.add('top-0');
    }else{
        editsWindow.classList.remove('top-0');
        editsWindow.classList.add('bottom-[-50%]');
    }
}

async function editCourse(id) {
    try {
        const newTitle = document.getElementById(`edit-title${id}`);
        const newImg = document.getElementById(`edit-img${id}`);
        const newCost = document.getElementById(`edit-cost${id}`);
    
        if(newTitle.value.trim()==="" && newCost.value.trim()==="" && newImg.value.trim()===""){
            alert("INVALID INPUT: both input fields are empty!");
            return;
        }
    
        const response = await axios.put("http://localhost:3009/admin/course",{
            title: newTitle.value,
            cost: newCost.value,
            image: newImg.value,
            id: id
        })

        alert(`${response.data.message}`)

        loadcourses();
    } catch (error) {
        alert(`error occured while trying to update the task: ${error}`)
    }
}

init();