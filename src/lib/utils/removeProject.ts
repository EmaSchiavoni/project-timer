import type { Project } from "../types/Project"
import { get } from "svelte/store"
import { projects } from "../stores/projects"
import { currentProjectId } from "../stores/currentProject"
import { addNewProject } from "./addNewProject"


export const removeProject = (id: Project["id"]) => {
    if (id == get(currentProjectId))
        if ( Object.keys(get(projects)).length > 1 ) {
            const projectsOrderedByLastUse = Object.values( get(projects)).sort((a, b) => (b.lastUse - a.lastUse))
            
            for (const project of projectsOrderedByLastUse)
                if (project.id != id) {
                    currentProjectId.set(project.id)
                    break
                }
        }
        else
            addNewProject()

    projects.update(liveProjects => {
        let updatedProjects = {...liveProjects}
        delete updatedProjects[id]
        return updatedProjects
    })
}