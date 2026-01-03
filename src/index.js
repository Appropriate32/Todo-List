import "./styles.css";



class ProjectManager {
    constructor() {
        this.projects = [
            {
                id : 1,
                title: "Default Project",
                todos: []
            },
            
        ];
    }

    addProject(title) {
        const newProject = {
            id: Date.now(),
            title: title,
            todos: []
        };
        this.projects.push(newProject);
        return newProject; // Return data object to DOM handler
    }

    addTodoToProject(projectId, todoId, title, due, priority, description) {
        const newTodo = {todoId, title, due, priority, description};
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.todos.push(newTodo);
        }
        return newTodo;
    }

    removeTodoFromProject(projectId, todoId) {
        const project = this.projects.find(p => p.id === projectId);
        
        if (project) {
            const todoIndex = project.todos.findIndex(todo => todo.todoId === todoId);
            
            if (todoIndex !== -1) {
                project.todos.splice(todoIndex, 1);
            }
            
        }
    }
}

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
    }

    init() {
        // Todo Listeners
        this.todoButton.addEventListener("click", () => this.renderNewToDo());
        
        this.mainContent.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-todo")) {
                this.handleRemoveTodo(e);
            }

            if (e.target.classList.contains("edit-todo")) {
                this.disableHidden();
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
            this.doneButton.addEventListener("click", () => this.enableHidden());
        }

        if (this.xButton) {
            this.xButton.addEventListener("click", () => this.enableHidden());
        }
    }


    renderNewToDo(projectId = 1, todoId) {
        const data = this.ProjectManager.addTodoToProject(projectId, todoId ,"New Task", "Jan 10", "Low", "Desc");
        this.createTodoElement(data);
    }

    handleAddProject() {
        const projectName = prompt("Enter project name:") || "New Project";
        const newProjectData = this.ProjectManager.addProject(projectName);
        
        const projectItem = document.createElement("div");
        projectItem.className = "project-container";
        
        projectItem.setAttribute("data-id", newProjectData.id);
        projectItem.innerHTML = `<p>${newProjectData.title}</p>`;
        
        this.projectSection.insertBefore(projectItem, this.buttonsContainer);
    }

    handleProjectClick(e) {
        const projectClicked = e.target.closest(".project-container");

        // Safety check: ensure project was actually clicked or if active
        if (!projectClicked || projectClicked.classList.contains("active")) return;

        // Remove active class from all other projects
        const allProjects = this.projectSection.querySelectorAll(".project-container");
        allProjects.forEach(project => {
            project.classList.remove("active");
        });

        // Add 'active' class to newly clicked project
        projectClicked.classList.add("active");
        
        const projectId = Number(projectClicked.dataset.id) || 1;

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

        this.todoButton.addEventListener("click", () => this.renderNewToDo(projectId, crypto.randomUUID()));

        const project = this.ProjectManager.projects.find(p => p.id === projectId);

        if (project && project.todos) {
            project.todos.forEach(todo => {
                this.createTodoElement(todo);
            })
        }
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

    destroy() {
        if (this.addButton) {
            this.addButton.removeEventListener("click", this.handleAddProject);
        }
        if (this.projectSection) {
            this.projectSection.removeEventListener("click", this.handleProjectClick);
        }
    }
}

const myProjectManager = new ProjectManager();
new DomStuff(myProjectManager);