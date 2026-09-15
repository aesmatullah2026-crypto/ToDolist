const input = document.querySelector(".todo-input input");
const button = document.querySelector(".todo-input button");
const todoList = document.querySelector(".todo-list");

button.addEventListener("click", function () {
    const task = input.value.trim();

    if (task === "") {
        return;
    }

    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        li.remove();
    });

    li.appendChild(taskText);
    li.appendChild(deleteButton);

    todoList.appendChild(li);

    input.value = "rrtr";
});