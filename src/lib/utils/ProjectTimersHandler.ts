import type { Project } from "../types/Project"
import { ProjectTimer, type ProjectTimerSubscriber } from "./ProjectTimer"


class ProjectTimersHandler {
    private projectTimers: Map<Project["id"], ProjectTimer> = new Map()

    private removeTimersWithoutSubscriptions() {
        for (const [project_id, timer] of this.projectTimers)
            if (timer.subscribedCallbacks.size == 0)
                this.projectTimers.delete(project_id)
    }

    /**
     * @param project_id 
     * @returns a unsubscribe function for memory release
     */
    subscribeToProject(project_id: Project["id"], callback: ProjectTimerSubscriber): () => void {
        if (!this.projectTimers.has(project_id)) {
            const timer = new ProjectTimer(project_id)
            this.projectTimers.set(project_id, timer)
        }

        const timer = this.projectTimers.get(project_id)
        const timerUnsubscriber = timer?.subscribe(callback)
        return () => {
            timerUnsubscriber && timerUnsubscriber()
            this.removeTimersWithoutSubscriptions()
        }
    }
}

export const projectTimersHandler = new ProjectTimersHandler()