import { get } from "svelte/store"
import { newProjectId } from "../stores/newProjectId"
import { projects } from "../stores/projects"
import { currentProjectId } from "../stores/currentProject"


export const addNewProject = () => {
    let id = get(newProjectId)

    projects.update(currentProjects => {
        const newProject = {
            id,
            title: "Unnamed project",
            description: "",
            elapsedTime: 0,
            running: false,
            created: Date.now(),
            lastUse: Date.now()
        }
        return {...currentProjects, [id]: newProject}
    })

    currentProjectId.set( id )
    newProjectId.set( ++id )
}

