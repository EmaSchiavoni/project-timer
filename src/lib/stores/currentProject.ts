import type { Writable } from "svelte/store"
import type { Project } from "../types/Project"
import { localStorageStore } from "../utils/LocalStorageStore"
import { projects } from "./projects"


export const currentProjectId: Writable<Project["id"]> = localStorageStore("currentProject", 0)


currentProjectId.subscribe(newCurrentProject => {
    projects.update(liveProjects => ({
        ...liveProjects,
        [newCurrentProject]: {
            ...liveProjects[newCurrentProject],
            lastUse: Date.now()
        }
    }))
})