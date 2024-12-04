import type { Writable } from "svelte/store"
import type { Project } from "../types/Project"
import { localStorageStore } from "../utils/LocalStorageStore"


export const newProjectId: Writable<Project["id"]> = localStorageStore("new_project_id", 1)