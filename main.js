let localTodoDatabase = [];

function personalizer() {
  const display = document.getElementById("personalizer");
  const key = "username";
  const username = localStorage.getItem(key);
  const input = document.getElementById("personal-presser");

  // Check Local storage for stored username
  if (username) {
    display.innerHTML = `<h2>Hello <b>${username}</b></h2>`;
  } else {
    /* html */
    display.innerHTML = `
    <div class="card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">What is your name?</label>
          <input type="text" class="form-control" name="username" />
        </div>
        <button type="submit" class="btn btn-primary" onclick="storeName()">Save</button>
      </div>
    </div>
    `;
  }

  // Check local storage for saved Tasks
  let todoDB = localStorage.getItem("todoDB");
  if (todoDB) {
    todoDB = JSON.parse(todoDB);
    if (todoDB.length > 0) {
      localTodoDatabase = todoDB;

      todoDB.forEach((todo) => {
        displayer(todo, true);
      });
    }
  }
}

function storeName() {
  let username = document.querySelector('[name="username"]').value;
  localStorage.setItem("username", username);
  personalizer();
}

personalizer();

// TODO Management Section
let todolist = localTodoDatabase;

const todoForm = document.getElementById("todo-form");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const todoForm = document.getElementById("todo-form");
  const task = document.querySelector('[name="task"]').value.trim();
  const priority = document.querySelector('[name="priority"]').value;
  const done = false;
  if (task === "") {
    // alert("Task input cannot empty.");
    document.querySelector('[name="task"]').classList.add("border-danger");
    document
      .querySelector("#todo-form .invalid-feedback")
      .classList.add("d-block");
  } else {
    document.querySelector('[name="task"]').classList.remove("border-danger");
    todoForm.querySelector(".invalid-feedback").classList.remove("d-block");
    const taskObject = {
      task: task,
      priority: priority,
      status: done,
      id: Date.now(),
    };
    todolist.push(taskObject);
    localStorage.setItem("todoDB", JSON.stringify(todolist));

    console.log(todolist);
    displayer(todolist);

    todoForm.reset();

    // document.getElementById("addNewTask").modal("hide");
  }
});

// Display tasks
function displayer(array, existing = false) {
  let taskDisplay = document.getElementById("task-display");
  const node = document.createElement("li");
  node.setAttribute("class", "mb-3 col");

  let element = array;
  if (!existing) {
    element = array[array.length - 1];
  }

  /* html */
  node.innerHTML = `
  <div class="list-item-content bg-info bg-gradient shadow p-3" id="${element.id}">
  <div class="row">
    <div class="col-1">
      <input class="form-check-input" type="checkbox" id="cb${element.id}" onchange="taskStateChecker(event)" />
    </div>
    <div class="col-11">
      <div class="row">
        <div class="col-10">
          <div class="row">
            <div class="col-12 col-md-8">
              <span class="fw-bold text-uppercase">${element.task}</span>
            </div>
            <div class="col-12 col-md-4"><span class="fst-italic"> Priority is ${element.priority}</span></div>
          </div>
        </div>
        <div class="col-2"><button onclick="itemDeleter(event)" class="btn-close"></button></div>
      </div>
    </div>
  </div>
</div>
  `;

  taskDisplay.prepend(node);
}

// Delete tasks
function itemDeleter(e) {
  let confirmation = confirm("Are you sure?");
  if (confirmation) {
    const parentEl = e.target.closest(".list-item-content");
    let parentID = parentEl.getAttribute("id");
    parentID = parseInt(parentID);
    todolist = todolist.filter((e) => e.id !== parentID);
    localStorage.setItem("todoDB", JSON.stringify(todolist));
    parentEl.closest("li").remove();
  }
}

// Apply style to list depending on checkbox state
function taskStateChecker(box) {
  if (box.target.checked) {
    box.target
      .closest("li")
      .classList.add("text-decoration-line-through", "text-white");
    box.target.closest(".list-item-content").classList.add("bg-secondary");
    box.target.closest(".list-item-content").classList.remove("bg-info");
  } else {
    box.target
      .closest("li")
      .classList.remove("text-decoration-line-through", "text-white");
    box.target.closest(".list-item-content").classList.remove("bg-secondary");
    box.target.closest(".list-item-content").classList.add("bg-info");
  }
}
