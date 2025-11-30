import "./styles.css";

class DomStuff {
    constructor({ projectSectionSelector = ".project-section", addButtonSelector = ".add-project", buttonsSelector = ".buttons" } = {}) {
        this.projectSection = document.querySelector(projectSectionSelector);
        this.addButton = document.querySelector(addButtonSelector);
        this.buttons = document.querySelector(buttonsSelector);
        this.handleAddProject = this.handleAddProject.bind(this);
        this.init();
    }

    init() {
        if (this.addButton) {
            this.addButton.addEventListener("click", this.handleAddProject);
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

    destroy() {
        if (this.addButton) {
            this.addButton.removeEventListener("click", this.handleAddProject);
        }
    }
}

new DomStuff();