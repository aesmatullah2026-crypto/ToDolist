// ========================================
// Select Elements
// ========================================

const input = document.querySelector(".todo-input input");

const button = document.querySelector(".todo-input button");

const searchInput = document.querySelector("#search-input");

const themeToggle = document.querySelector("#theme-toggle");

const todoList = document.querySelector(".todo-list");

const taskCount = document.querySelector("#task-count");

const activeCount = document.querySelector("#active-count");

const completedCount = document.querySelector("#completed-count");

const filterButtons = document.querySelectorAll(".filter-btn");

const clearCompletedButton = document.querySelector("#clear-completed");


// ========================================
// Variables
// ========================================

let tasks = [];

let currentFilter = "all";

let searchText = "";

let currentTheme = "light";


// ========================================
// Save Tasks
// ========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// Load Tasks
// ========================================

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");


    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

}


// ========================================
// Save Theme
// ========================================

function saveTheme() {

    localStorage.setItem(
        "theme",
        currentTheme
    );

}


// ========================================
// Load Theme
// ========================================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");


    if (savedTheme) {

        currentTheme = savedTheme;

    }


    if (currentTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    }
    else {

        document.body.classList.remove("dark");

        themeToggle.textContent = "🌙";

    }

}


// ========================================
// Toggle Theme
// ========================================

function toggleTheme() {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        currentTheme = "dark";

        themeToggle.textContent = "☀️";

    }
    else {

        currentTheme = "light";

        themeToggle.textContent = "🌙";

    }


    saveTheme();

}


// ========================================
// Update Task Counter
// ========================================

function updateTaskCount() {

    const total = tasks.length;


    const completed = tasks.filter(function (task) {

        return task.completed;

    }).length;


    const active = total - completed;


    taskCount.textContent = total;

    activeCount.textContent = active;

    completedCount.textContent = completed;

}


// ========================================
// Format Task Date
// ========================================

function formatDate(date) {

    return new Date(date).toLocaleString();

}


// ========================================
// Delete Task
// ========================================

function deleteTask(id) {

    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


// ========================================
// Render Tasks
// ========================================

function renderTasks() {

    todoList.innerHTML = "";


    // ========================================
    // Filter Tasks
    // ========================================

    const filteredTasks = tasks

        .filter(function (task) {

            if (currentFilter === "active") {

                return !task.completed;

            }


            if (currentFilter === "completed") {

                return task.completed;

            }


            return true;

        })

        // ========================================
        // Search Tasks
        // ========================================

        .filter(function (task) {

            return task.text
                .toLowerCase()
                .includes(searchText.toLowerCase());

        });


    // ========================================
    // Sort Tasks
    // Newest Task First
    // ========================================

    filteredTasks.sort(function (a, b) {

        return new Date(b.createdAt) - new Date(a.createdAt);

    });


    // ========================================
    // Empty Message
    // ========================================

    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("p");


        if (searchText !== "") {

            emptyMessage.textContent =
                "No tasks found.";

        }
        else if (currentFilter === "active") {

            emptyMessage.textContent =
                "No active tasks.";

        }
        else if (currentFilter === "completed") {

            emptyMessage.textContent =
                "No completed tasks.";

        }
        else {

            emptyMessage.textContent =
                "No tasks yet.";

        }


        todoList.appendChild(emptyMessage);


        updateTaskCount();

        return;

    }


    // ========================================
    // Create Tasks
    // ========================================

    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");


        // ========================================
        // Checkbox
        // ========================================

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        // ========================================
        // Task Content
        // ========================================

        const taskContent = document.createElement("div");

        taskContent.classList.add("task-content");


        // ========================================
        // Task Text
        // ========================================

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        if (task.completed) {

            taskText.classList.add("completed");

        }


        // ========================================
        // Task Date
        // ========================================

        const taskDate = document.createElement("small");

        taskDate.classList.add("task-date");

        taskDate.textContent =
            "Created: " + formatDate(task.createdAt);


        // ========================================
        // Checkbox Change
        // ========================================

        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;


            taskText.classList.toggle(
                "completed",
                task.completed
            );


            saveTasks();

            updateTaskCount();

        });


        // ========================================
        // Edit Button
        // ========================================

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";


        editButton.addEventListener("click", function () {

            const newTask = prompt(
                "Edit your task:",
                task.text
            );


            if (newTask === null) {

                return;

            }


            const updatedTask = newTask.trim();


            if (updatedTask === "") {

                return;

            }


            task.text = updatedTask;


            saveTasks();

            renderTasks();

        });


        // ========================================
        // Delete Button
        // ========================================

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        // ========================================
        // Add Task Content
        // ========================================

        taskContent.appendChild(taskText);

        taskContent.appendChild(taskDate);


        // ========================================
        // Add Elements
        // ========================================

        li.appendChild(checkbox);

        li.appendChild(taskContent);

        li.appendChild(editButton);

        li.appendChild(deleteButton);


        todoList.appendChild(li);

    });


    // ========================================
    // Update Counter
    // ========================================

    updateTaskCount();

}


// ========================================
// Add Task
// ========================================

function addTask() {

    const task = input.value.trim();


    // Don't add empty task
    if (task === "") {

        return;

    }


    // ========================================
    // Create Task Object
    // ========================================

    const newTask = {

        id: Date.now().toString(),

        text: task,

        completed: false,

        createdAt: new Date().toISOString()

    };


    // ========================================
    // Add Task
    // ========================================

    tasks.push(newTask);


    // ========================================
    // Save
    // ========================================

    saveTasks();


    // ========================================
    // Render
    // ========================================

    renderTasks();


    // ========================================
    // Clear Input
    // ========================================

    input.value = "";

}


// ========================================
// Add Button Event
// ========================================

button.addEventListener(
    "click",
    addTask
);


// ========================================
// Enter Key Event
// ========================================

input.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ========================================
// Search Event
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        searchText = searchInput.value.trim();

        renderTasks();

    }
);


// ========================================
// Theme Button Event
// ========================================

themeToggle.addEventListener(
    "click",
    toggleTheme
);


// ========================================
// Filter Buttons
// ========================================

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            currentFilter = button.dataset.filter;


            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            renderTasks();

        }
    );

});


// ========================================
// Clear Completed Tasks
// ========================================

clearCompletedButton.addEventListener(
    "click",
    function () {

        const completedTasks = tasks.filter(
            function (task) {

                return task.completed;

            }
        );


        if (completedTasks.length === 0) {

            return;

        }


        const confirmed = confirm(
            "Are you sure you want to delete all completed tasks?"
        );


        if (!confirmed) {

            return;

        }


        tasks = tasks.filter(function (task) {

            return !task.completed;

        });


        saveTasks();

        renderTasks();

    }
);


// ========================================
// Start Application
// ========================================

loadTasks();

loadTheme();

renderTasks();