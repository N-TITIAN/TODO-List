//stored todo list
let TODOS = [
  {
    id: 1,
    text: "Buy milk",
    isCompleted: false,
  },
  {
    id: 2,
    text: "Buy eggs",
    isCompleted: true,
  },
  {
    id: 3,
    text: "Buy bread",
    isCompleted: false,
  },
];
//load existing todos

function loadTodos() {
  // Load existing todos from localStorage (if any)
  const storedTodos = localStorage.getItem("todos");
  let todos = TODOS;

  // const todoList = document.getElementById("todoList");

  const todoItems = document.getElementById("todoItems");
  todoItems.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item", "w-full");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.classList.add("h-8", "w-8");
    checkbox.checked = todo.isCompleted; // Set checkbox state based on isCompleted
    checkbox.addEventListener("change", function (ev) {
      //to update statuses
      todo.isCompleted = ev.target.checked;
      countCompletedTasks();
    });

    const label = document.createElement("label");

    label.textContent = todo.text;
    label.setAttribute("for", "todo");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.id = "editButton" + todo.id;
    editButton.classList.add(
      "w-full",
      "border",
      "py-4",
      "hover:bg-black",
      "hover:text-white"
    );
    editButton.addEventListener("click", function (ev) {
      editTodoItem(todo.id);
    });
    // Add functionality for editing the task

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.id = "deleteButton" + todo.id;
    deleteButton.addEventListener("click", function (ev) {
      deleteTodoItem(todo.id);
    });
    deleteButton.classList.add(
      "w-full",
      "border",
      "py-4",
      "bg-red-600",
      "text-white",
      "hover:bg-black"
    );

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("flex", "items-center", "gap-3", "mb-2");
    taskContainer.id = "taskContainer" + todo.id;
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(label);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex", "flex-row", "w-full", "gap-3");
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    todoItem.appendChild(taskContainer);
    todoItem.appendChild(buttonContainer);

    todoItems.appendChild(todoItem); // Append to "todoItems" div
    // Add id to the todo item
    todoItem.id = "todoItem" + todo.id; // Combine "todoItem" with the todo's id
  });

  document.getElementById("myInput").value = "";
  countCompletedTasks();
  // Update total item count
  // const totalCount = document.getElementById("totalCount");
  // totalCount.textContent = todos.length;
}

window.onload = loadTodos();
function newTodo() {
  const userInput = document.getElementById("myInput").value.trim();
  if (userInput === "") {
    alert("You must enter a task to add!");
    return;
  }

  let newTodo = {
    id: Date.now(), // Generate unique ID using timestamp
    text: userInput,
    isCompleted: false,
  };

  TODOS.push(newTodo);
  loadTodos();
  // alert(TODOS); // Add new todo to TODOS array
  document.getElementById("myInput").value = "";
  alert("item was added ");
}
//counting
function countCompletedTasks() {
  const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
   let removeCompletedBox = document.getElementById("removeCompleted");
   let removeCheckAll = document.getElementById("checkAll");

  const completedCount = Array.from(allCheckboxes).filter(
    (checkbox) => checkbox.checked
  ).length;
  if (completedCount == 0) {
   
    removeCompletedBox.style.backgroundColor = "#4B5563";
    removeCheckAll.style.backgroundColor = "#4B5563";
  }else{
    removeCompletedBox.style.backgroundColor = "black";
  }

  const totalCount = allCheckboxes.length;

  const completionStats = document.querySelector("h1.text-3xl");
  completionStats.querySelector("span:first-child").textContent =
    completedCount;
  completionStats.querySelector("span:last-child").textContent = totalCount;
}
//checkallbutton
function checkAll() {
  let checkBox = document.getElementById("checkAll");
  if (checkBox.textContent === "Check All") {
    //checks all boxes while updating "isCompleted status"
    const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
    Array.from(allCheckboxes).forEach((checkbox) => (checkbox.checked = true)); //checks all checkboxes from the array fetched
    TODOS.forEach((todo) => {
      todo.isCompleted = true;
    });
    loadTodos();
    countCompletedTasks();

    checkBox.textContent = "Uncheck All"; // update the botton text
  } else {
    //uncheck allboxes while updating "isCompleted status"
    const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
    Array.from(allCheckboxes).forEach((checkbox) => (checkbox.checked = false));
    TODOS.forEach((todo) => {
      todo.isCompleted = false;
    });

    loadTodos();
    countCompletedTasks();
    checkBox.textContent = "Check All";
    checkBox.style.backgroundColor="black";
  }
}

// edit a task
function editTodoItem(todoId) {
  const todo = TODOS.find((todo) => todo.id === todoId);
  const todoItem = document.getElementById("todoItem" + todo.id);
  // const label = todoItem.querySelector("label");
  const inputdiv = document.createElement("div");

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("p-4", "border-4", "w-full", "mb-2");
  const taskContainer = document.getElementById("taskContainer" + todo.id);

  input.type = "text";
  input.value = todo.text;
  //append input to inputdiv
  inputdiv.appendChild(input);
  inputdiv.classList.add("flex", "items-center", "gap-3", "mb-2");

  // Replace label with input
  todoItem.replaceChild(inputdiv, taskContainer);

  // Change buttons to "Save" and "Cancel"
  const editButton = document.getElementById("editButton" + todo.id);
  editButton.textContent = "Save";
  editButton.removeEventListener("click", editTodoItem);
  editButton.addEventListener("click", function (ev) {
    saveEditedItem(todo.id, input.value);
  });

  const deleteButton = document.getElementById("deleteButton" + todo.id);
  deleteButton.textContent = "Cancel";
  deleteButton.removeEventListener("click", deleteTodoItem);
  deleteButton.addEventListener("click", function () {
    loadTodos(); // Reload todos to cancel editing

    alert("cancle");
  });
}
// function to save edited todo item
function saveEditedItem(id, newText) {
  const todo = TODOS.find((todo) => todo.id === id);
  if (todo) {
    todo.text = newText;
    // localStorage.setItem('todos', JSON.stringify(TODOS));

    loadTodos(); // Reload todos to reflect the changes
    alert("item was edited ");
  }
}

//deleteitem
function deleteTodoItem(todoId) {
  // const todo = TODOS.find((todo) => todo.id === todoId);
  // const todoItem = document.getElementById("todoItem" + todo.id);
  let todos = TODOS;
  todos.forEach((todo) => {
    if (todo.id === todoId) {
      todos.splice(todos.indexOf(todo), 1);
    }
  });
  loadTodos();
  alert("item was deleted");
}


function setActiveFilter(filterType) {
  // First, remove the active class from all filter buttons
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.classList.remove("activefilter", "bg-black", "text-white");
  });

  // Apply the active styles to the selected filter button
  filterType.classList.add("activefilter", "bg-black", "text-white");
}




function filterAll() {
  let filterType = document.getElementById("filterAll");
  loadTodos();
  setActiveFilter(filterType);
}

function filterByActive() {
  let filterType = document.getElementById("filterActive");
  let todos = TODOS;
  loadTodos();
  if (filterType.textContent === "Active") {
    todos.forEach((todo) => {
      if (todo.isCompleted) {
        todoItem = document.getElementById("todoItem" + todo.id);
        todoItem.style.display = "none";
      }
    });
  }
  setActiveFilter(filterType);
}

function filterByCompleted() {
  let filterType = document.getElementById("filterCompleted");
  let todos = TODOS;
  loadTodos();
  if (filterType.textContent === "Completed") {
    todos.forEach((todo) => {
      if (!todo.isCompleted) {
        todoItem = document.getElementById("todoItem" + todo.id);
        todoItem.style.display = "none";
      }
    });
  }
  setActiveFilter(filterType);
}
// remove completed
function removeCompleted() {


  
    TODOS = TODOS.filter((todo) => !todo.isCompleted);
    loadTodos();


}

window.onload = filterAll();
