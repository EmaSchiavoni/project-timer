import type { Writable } from "svelte/store"
import type { Project } from "../types/Project"
import { localStorageStore } from "../utils/LocalStorageStore"


export const projects: Writable<{[key: Project["id"]]: Project}> = localStorageStore(
    "projects",
    {
        0: {
            id: 0,
            title: "Unnamed project",
            description: "",
            created: Date.now(),
            lastUse: Date.now(),
            elapsedTime: 0
        }
    }
)