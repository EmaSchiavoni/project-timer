import type { Project } from "../types/Project"
import { get } from "svelte/store"
import { projects } from "../stores/projects"


class ProjectSubscriptionHandler {
    private projects = get(projects)
    private subscriptions: Map< Project["id"], Array<(p: Project) => void>> = new Map()


    constructor() {
        projects.subscribe(updatedProjects => {
            this.callSubscribersIfChanged(updatedProjects)
            this.removeSubscribersIfDeleted(updatedProjects)
        })
    }


    private callSubscribersIfChanged(updatedProjects: {[key: number]: Project}) {
        for (const [project_id, subscriptions] of this.subscriptions.entries()) {
            const updatedProject = updatedProjects[project_id]

            if (JSON.stringify(this.projects[project_id]) !== JSON.stringify(updatedProject)) {
                for (const callback of subscriptions)
                    callback(updatedProject)
            }
        }

        this.projects = JSON.parse( JSON.stringify(updatedProjects) )
    }


    private removeSubscribersIfDeleted(updatedProjects: {[key: number]: Project}) {
        if (Object.keys(this.projects).length == Object.keys(updatedProjects).length)
            return

        const savedProjectIds = Object.keys(this.projects)

        for (let project_id of Object.keys(updatedProjects))
            if (!savedProjectIds.includes(project_id))
                this.subscriptions.delete( parseInt(project_id) )
    }


    private removeSubscriber(project_id: Project["id"], callback: (p: Project) => void) {
        const subscribers = this.subscriptions.get(project_id)

        if (!subscribers)
            return

        for (let i = 0; i < subscribers.length; ++i) {
            const cb = subscribers[i]
            if (cb === callback) {
                subscribers.splice(i)
                
                if (subscribers.length === 0)
                    this.subscriptions.delete( (project_id) )

                break
            }
        }
    }


    /**
     * @returns a unsubscriber function for memory release
     */
    subscribe(project_id: Project["id"], callback: (p: Project) => void) {
        if (!this.projects[project_id])
            throw "Se intentó suscribir a un proyecto inexistente"

        const prevSubscriptions = this.subscriptions.get(project_id) || []
        this.subscriptions.set(
            project_id,
            prevSubscriptions.concat(callback)
        )
        callback(this.projects[project_id])

        return () => this.removeSubscriber(project_id, callback)
    }
}


export const projectSubscriptionsHandler = new ProjectSubscriptionHandler()