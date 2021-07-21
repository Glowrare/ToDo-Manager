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
    <div class="card mb-4 rounded-0 shadow-sm">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">What is your name?</label>
          <input type="text" class="form-control rounded-0" name="username" />
        </div>
        <button type="submit" class="btn btn-outline-primary rounded-0" onclick="storeName()">Save</button>
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

//Fetch input and store Username to local storage for personalizer
function storeName() {
  const username = document.querySelector('[name="username"]').value;
  localStorage.setItem("username", username);
  personalizer();
}

personalizer();

// TODO Management Section
let todolist = localTodoDatabase;

const todoForm = document.getElementById("todo-form");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = document.querySelector('[name="task"]').value.trim();
  // const priority = document.querySelector('[name="priority"]').value;
  const priority = document.querySelector(
    'input[name="priority"]:checked'
  ).value;
  // const done = false;

  if (task === "") {
    document.querySelector('[name="task"]').classList.add("border-danger");
    todoForm.querySelector(".invalid-feedback").classList.add("d-block");
  } else {
    document.querySelector('[name="task"]').classList.remove("border-danger");
    todoForm.querySelector(".invalid-feedback").classList.remove("d-block");

    const taskObject = {
      task: task,
      priority: priority,
      done: false,
      id: Date.now(),
    };

    todolist.push(taskObject);
    localStorage.setItem("todoDB", JSON.stringify(todolist));

    console.log(todolist);
    displayer(todolist);

    todoForm.reset();
  }
});

// Display tasks
function displayer(array, existing = false) {
  const taskDisplay = document.getElementById("task-display");
  const node = document.createElement("li");
  node.setAttribute("class", "mb-3 col");

  let element = array;
  if (!existing) {
    element = array[array.length - 1];
  }

  //Set priority color text
  let priorityIndicator = "";

  if (element.priority === "high") {
    priorityIndicator = "danger";
  } else if (element.priority === "medium") {
    priorityIndicator = "warning";
  } else {
    priorityIndicator = "success";
  }

  //Set list format based on last checked state
  let checkedState;

  if (element.done) {
    node.classList.add("text-decoration-line-through", "text-muted");
    checkedState = "checked";
  }

  /* html */
  node.innerHTML = `
  <div class="list-item-content shadow-sm p-3" id="${element.id}">
  <div class="row">
    <div class="col-1">
      <input class="form-check-input" type="checkbox" id="cb${element.id}" onchange="taskStateChecker(event)" ${checkedState} />
    </div>
    <div class="col-11">
      <div class="row">
        <div class="col-10 col-sm-11">
          <div class="row">
            <div class="col-12 col-md-8">
              <span class="fw-bold text-uppercase">${element.task}</span>
            </div>
            <div class="col-12 col-md-4"><span class="fst-italic text-${priorityIndicator}"> Priority is ${element.priority}</span></div>
          </div>
        </div>
        <div class="col-2 col-sm-1"><button onclick="itemDeleter(event)" class="btn-close"></button></div>
      </div>
    </div>
  </div>
</div>
  `;

  taskDisplay.prepend(node);
}

// Delete tasks
function itemDeleter(e) {
  const confirmation = confirm("Are you sure?");
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
  const taskID = box.target.closest(".list-item-content").getAttribute("id");
  const taskIndex = todolist.findIndex((item) => item.id == taskID);

  const parentWrapper = document.getElementById("task-display");
  const parentLi = box.target.closest("li");

  if (box.target.checked) {
    parentLi.classList.add("text-decoration-line-through", "text-muted");

    todolist[taskIndex].done = true;

    //move item to end of list in DOM
    parentWrapper.appendChild(parentLi);

    //move item to end of stored array
    const targetEl = todolist[taskIndex]; //store checked List Item object in variable

    todolist = todolist.filter((list) => list.id !== parseInt(taskID)); //filter out current checked list item

    todolist.unshift(targetEl); //Re-add current checked List item to array at index 0
  } else {
    parentLi.classList.remove("text-decoration-line-through", "text-muted");

    todolist[taskIndex].done = false;

    //If inbetween other checked items, move current uchecked item just above all checked list item
    const firstCheckedItem = document.querySelector(
      ".text-decoration-line-through.text-muted"
    );

    if (firstCheckedItem) {
      parentWrapper.insertBefore(parentLi, firstCheckedItem);
    }

    //Check and move unchecked item out from true done status in stored array
    const statusArray = todolist.map((item) => item.done); //generate array of item ids

    const lastChecked = statusArray.lastIndexOf(true); //get the last index of item where done status is true

    if (lastChecked >= 0) {
      const targetEl = todolist[taskIndex]; //store unchecked List Item object in variable
      todolist = todolist.filter((list) => list.id !== parseInt(taskID)); //filter out current unchecked list item

      todolist.splice(lastChecked, 0, targetEl); //add current unchecked item right after last checked list item
    }
  }
  localStorage.setItem("todoDB", JSON.stringify(todolist));
}

function deleteAllTasks(confirmed) {
  if (confirmed) {
    todolist = [];
    localStorage.setItem("todoDB", JSON.stringify(todolist));

    //Remove all task from the DOM
    document.querySelectorAll(".list-item-content").forEach((el) => {
      el.closest("li").remove();
    });
  }
}

function deleteDoneTasks(confirmed) {
  if (confirmed) {
    todolist = todolist.filter((item) => !item.done);
    localStorage.setItem("todoDB", JSON.stringify(todolist));

    //Remove all task from the DOM
    document
      .querySelectorAll(".text-decoration-line-through.text-muted")
      .forEach((el) => {
        el.remove();
      });
  }
}

document.getElementById("clearDoneTasks").addEventListener("click", () => {
  const confirmation = confirm(
    "Are you sure you want to delete all items marked as done?"
  );
  deleteDoneTasks(confirmation);
});

document.getElementById("clearAllTasks").addEventListener("click", () => {
  const confirmation = confirm("Are you sure you want to delete all items?");
  deleteAllTasks(confirmation);
});
