import "./styles.css";



class ProjectManager {
    constructor() {
        const savedProjects = localStorage.getItem("myTodoApp_data");

        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
        } else {
            this.projects = [
                {
                    id : 1,
                    title: "Default Project",
                    todos: []
                },
            
            ];
        }
    }

    saveToStorage() {
        localStorage.setItem("myTodoApp_data", JSON.stringify(this.projects));
    }

    addProject(title) {
        const newProject = {
            id: Date.now(),
            title: title,
            todos: []
        };
        this.projects.push(newProject);

        this.saveToStorage();

        return newProject; // Return data object to DOM handler
    }

    deleteProject(projectId) {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex != -1) {
            this.projects.splice(projectIndex, 1);
            this.saveToStorage();
        }
        
    }

    addTodoToProject(projectId, todoId, title, due, priority, description) {
        const newTodo = {todoId, title, due, priority, description};
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.todos.push(newTodo);
            this.saveToStorage();
        }
        return newTodo;
    }

    getTodo(projectId, todoId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;
        return project.todos.find(t => t.todoId === todoId);
    }

    editTodo(projectId, todoId, newData) {
        const project = this.projects.find(p => p.id === projectId);

        if (project) {
            const todo = project.todos.find(t => t.todoId === todoId);
            if (todo) {
                // Updates the properties with new values
                todo.title = newData.title;
                todo.due = newData.due;
                todo.priority = newData.priority;
                todo.description = newData.description;

                this.saveToStorage();
            }
        }
    }

    removeTodoFromProject(projectId, todoId) {
        const project = this.projects.find(p => p.id === projectId);
        
        if (project) {
            const todoIndex = project.todos.findIndex(todo => todo.todoId === todoId);
            
            if (todoIndex !== -1) {
                project.todos.splice(todoIndex, 1);
                this.saveToStorage();
            }
            
        }
    }
}

const maxTodos = 9;

class DomStuff {
    
    constructor(ProjectManager) {
        this.ProjectManager = ProjectManager;

        // Selectors
        this.mainContent = document.querySelector("main");
        this.todoButton = document.querySelector(".add-todo");
        this.projectSection = document.querySelector(".project-section");
        this.addProjectBtn = document.querySelector(".add-project");
        this.buttonsContainer = document.querySelector(".buttons");
        this.removeTodo = document.querySelector(".remove-todo");
        this.doneButton = document.querySelector(".done");
        this.xButton = document.querySelector(".x");
        
        this.init();

        this.renderInitialPage();
    }

    renderInitialPage() {
        this.ProjectManager.projects.forEach(project => {
            const projectItem = document.createElement("div");
            projectItem.className = "project-container";

            projectItem.setAttribute("data-id", project.id);

            if (project.id === 1 || project === this.ProjectManager.projects[0]) {
                projectItem.classList.add("active");

                this.refreshMainContent(project.id);
            }

            projectItem.innerHTML = `
            <p>${project.title}</p>
            <button class = "delete-project-btn">X</button>
            `;
            this.projectSection.insertBefore(projectItem, this.buttonsContainer);
        });
    }

    init() {
        // Todo Listeners
        this.todoButton.addEventListener("click", () => {
            const activeProject = document.querySelector(".project-container.active");
            const projectId = activeProject ? Number(activeProject.dataset.id) : 1;

            this.safeAddToDo(projectId);
            
        });
        
        this.mainContent.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-todo")) {
                this.handleRemoveTodo(e);
            }

            if (e.target.classList.contains("edit-todo")) {
                const todoItem = e.target.closest(".todo-item");
                const todoId = todoItem.getAttribute("data-todo-id");
                this.openEditModal(todoId);
            }
        });

        // Project Listeners
        if (this.addProjectBtn) {
            this.addProjectBtn.addEventListener("click", () => this.handleAddProject());
        }

        if (this.projectSection) {
            this.projectSection.addEventListener("click", (e) => this.handleProjectClick(e));
        }

        if (this.doneButton) {
            this.doneButton.addEventListener("click", (e) => this.handleEditSubmit(e));
        }

        if (this.xButton) {
            this.xButton.addEventListener("click", () => this.enableHidden());
        }
    }

    openEditModal(todoId) {
        const activeProject = document.querySelector(".project-container.active");
        if (!activeProject) return;
        const projectId = Number(activeProject.dataset.id);

        const todoData = this.ProjectManager.getTodo(projectId, todoId);

        if (todoData) {
            document.querySelector("#task").value = todoData.title;
            document.querySelector("#due").value = todoData.due;
            document.querySelector("#priority").value = todoData.priority;
            document.querySelector("#description").value = todoData.description;

            const editOverlay = document.querySelector(".edit-overlay");
            editOverlay.dataset.editingId = todoId;

            this.disableHidden();
        }
    }

    handleEditSubmit(e) {
        e.preventDefault();

        const activeProject = document.querySelector(".project-container.active");
        const projectId = Number(activeProject.dataset.id);

        const editOverlay = document.querySelector(".edit-overlay");
        const todoId = editOverlay.dataset.editingId;

        const newData = {
            title: document.querySelector("#task").value,
            due: document.querySelector("#due").value,
            priority: document.querySelector("#priority").value,
            description: document.querySelector("#description").value
        };

        this.ProjectManager.editTodo(projectId, todoId, newData);

        this.refreshMainContent(projectId);

        this.enableHidden();
    }

    renderNewToDo(projectId = 1, todoId = crypto.randomUUID()) {
        const data = this.ProjectManager.addTodoToProject(projectId, todoId ,"New Task", "Jan 10", "Low", "Desc");
        this.createTodoElement(data);
    }

    handleAddProject() {
        const projectName = prompt("Enter project name:") || "New Project";
        const newProjectData = this.ProjectManager.addProject(projectName);
        
        const projectItem = document.createElement("div");
        projectItem.className = "project-container";
        
        projectItem.setAttribute("data-id", newProjectData.id);
        projectItem.innerHTML = `
        <p>${newProjectData.title}</p>
        <button class = "delete-project-btn">X</button>
        `;
        
        this.projectSection.insertBefore(projectItem, this.buttonsContainer);
    }

    handleProjectClick(e) {
        const projectClicked = e.target.closest(".project-container");
        const deleteBtnClicked = e.target.closest(".delete-project-btn");
        

        if (!projectClicked) return;

        const projectId = Number(projectClicked.dataset.id);

        if (deleteBtnClicked) {
            
            this.ProjectManager.deleteProject(projectId);

            projectClicked.remove();

            if (projectClicked.classList.contains("active")) {
                this.refreshMainContent(1);

                const defaultProject = document.querySelector(`[data-id="1"]`);
                if (defaultProject) defaultProject.classList.add("active");
            }
            return;
        }

        // Safety check: ensure project isn't active
        if (projectClicked.classList.contains("active")) return;
       

        // Remove active class from all other projects
        const allProjects = this.projectSection.querySelectorAll(".project-container");
        allProjects.forEach(project => {
            project.classList.remove("active");
        });

        // Add 'active' class to newly clicked project
        projectClicked.classList.add("active");
        
       

        this.refreshMainContent(projectId);
    }

    handleRemoveTodo(e) {
        const todoItem = e.target.closest(".todo-item");
        const todoId = todoItem.getAttribute("data-todo-id");

        const activeProject = document.querySelector(".project-container.active");
        const projectId = Number(activeProject.dataset.id);

        this.ProjectManager.removeTodoFromProject(projectId, todoId);

        todoItem.remove();
    }
    
    refreshMainContent(projectId) {
        this.mainContent.innerHTML = '<button class="add-todo">Add Todo</button>';

        this.todoButton = document.querySelector(".add-todo");

        this.todoButton.addEventListener("click", () => this.safeAddToDo(projectId));

        const project = this.ProjectManager.projects.find(p => p.id === projectId);

        if (project && project.todos) {
            project.todos.forEach(todo => {
                this.createTodoElement(todo);
            })
        }
    }

    safeAddToDo(projectId) {
        const project = this.ProjectManager.projects.find(p => p.id === projectId);

        if (project && project.todos.length >= maxTodos) {
            alert("Limit reached! You cannot add more than 9 tasks.");
            return;
        }

        this.renderNewToDo(projectId, crypto.randomUUID());
    }

    createTodoElement(data) {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        
        todoItem.setAttribute("data-todo-id", data.todoId);
        
        todoItem.innerHTML = `
            <h2 class="todo-heading">${data.title}</h2>
            <p class="due">Due: ${data.due}</p>
            <p class="priority">Priority: ${data.priority}</p>
            <p class="description">${data.description}</p>
            <div class="todo-buttons-container">
                <button class="edit-todo">Edit</button>
                <button class="remove-todo">Remove</button>
            </div>
        `;
        this.mainContent.prepend(todoItem);
    }

    enableHidden() {
        const blur = document.querySelector(".blur");
        const editOverlay = document.querySelector(".edit-overlay");

        blur.classList.add("hidden");
        editOverlay.classList.add("hidden");
    }

    disableHidden() {
        const blur = document.querySelector(".blur");
        const editOverlay = document.querySelector(".edit-overlay");

        blur.classList.remove("hidden");
        editOverlay.classList.remove("hidden");
    }

}

const myProjectManager = new ProjectManager();
new DomStuff(myProjectManager);