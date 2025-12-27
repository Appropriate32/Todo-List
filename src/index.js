import "./styles.css";



class ProjectManager {
    constructor() {
        this.projects = [
            {
                id : 1,
                title: "Default Project",
                todos: []
            },
            {
                id : 2,
                title: "Work Project",
                todos: []
            }
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

    addTodoToProject(projectId, title, due, priority, description) {
        const newTodo = { title, due, priority, description};
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.todos.push(newTodo);
        }
        return newTodo;
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

        this.init();
    }

    init() {
        // Todo Listener
        this.todoButton.addEventListener("click", () => this.renderNewToDo());
        
        // Project Listeners
        if (this.addProjectBtn) {
            this.addProjectBtn.addEventListener("click", () => this.handleAddProject());
        }

        if (this.projectSection) {
            this.projectSection.addEventListener("click", (e) => this.handleProjectClick(e));
        }
    }

    renderNewToDo() {
        const data = this.ProjectManager.addTodoToProject(1, "New Task", "Jan 10", "Low", "Desc");

        const todoItem = document.createElement("div");

        todoItem.classList.add("todo-item");
        
        todoItem.innerHTML = `
            <h2 class="todo-heading">${data.title}</h2>
            <p class="due">Due: ${data.due}</p>
            <p class="priority">Priority: ${data.priority}</p>
            <p class="description">${data.description}</p>
        `;

        this.mainContent.prepend(todoItem);
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

        this.mainContent.innerHTML = '<button class="add-todo">Add Todo</button>';
        
        // Re-select button because innerHTML was wiped
        this.todoButton = document.querySelector(".add-todo");
        this.todoButton.addEventListener("click", () => this.renderNewToDo());
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