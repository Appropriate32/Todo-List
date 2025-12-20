import "./styles.css";



class ProjectManager {
    constructor() {
        this.projects = [
            {
                id : 1,
                title: "Default Project",
                todos: [
                    {title: "Buy Milk", due: "Jan 10", priority: "Low"},
                    {title: "Walk Dog", due: "Jan 11", priority: "High"}
                ]
            },
            {
                id : 2,
                title: "Work Project",
                todos: []
            }
        ];
    }
}

class DomStuff {
    constructor({ projectSectionSelector = ".project-section", addButtonSelector = ".add-project", buttonsSelector = ".buttons" } = {}) {
        this.projectSection = document.querySelector(projectSectionSelector);
        this.addButton = document.querySelector(addButtonSelector);
        this.buttons = document.querySelector(buttonsSelector);
        
        
        this.handleAddProject = this.handleAddProject.bind(this);
        this.handleProjectClick = this.handleProjectClick.bind(this);
        
        this.init();
    }

    init() {
        if (this.addButton) {
            this.addButton.addEventListener("click", this.handleAddProject);
        }

        if (this.projectSection) {
            this.projectSection.addEventListener("click", this.handleProjectClick)
        
            // Set first project to be active by default on load
            const firstProject = this.projectSection.querySelector(".project-container");
            if (firstProject) firstProject.classList.add("active");
        }
    }

    handleAddProject() {
        if (!this.projectSection || !this.buttons) return;
        const projectItem = document.createElement("div");
        projectItem.className = "project-container";
        const projectText = document.createElement("p");
        projectText.textContent = "Another Project";
        projectItem.appendChild(projectText);
        this.projectSection.insertBefore(projectItem, this.buttons);
    }

    handleProjectClick(e) {
        const projectClicked = e.target.closest(".project-container");

        // Safety check: ensure project was actually clicked
        if (!projectClicked) return;

        // Check if project is already active
        if (projectClicked.classList.contains("active")) {
            return;
        }

        // Remove active class from all other projects
        const allProjects = this.projectSection.querySelectorAll(".project-container");
        allProjects.forEach(project => {
            project.classList.remove("active");
        });

        // Add 'active' class to newly clicked project
        projectClicked.classList.add("active");

        const mainContent = document.querySelector("main");
        mainContent.innerHTML = "";
        
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

new DomStuff();