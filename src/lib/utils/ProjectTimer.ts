import type { Project } from "../types/Project"
import { projects } from "$lib/stores/projects"
import { get } from "svelte/store"
import { projectSubscriptionsHandler } from "./ProjectSubscriptionsHandler"


type TimeNumber = {
    num: number
    str: string
}


export type ProjectTimerSubscriber = (timer: {hours: TimeNumber, minutes: TimeNumber, seconds: TimeNumber}) => any


export class ProjectTimer {
    project_id: number
    elapsed_time: number
    is_running: boolean

    hours: TimeNumber = {num: 0, str: "00"}
    minutes: TimeNumber = {num: 0, str: "00"}
    seconds: TimeNumber = {num: 0, str: "00"}

    subscribedCallbacks: Set<ProjectTimerSubscriber> = new Set()

    private update_running_timer_interval_id?: number
    private lastProjectDataReceived: Project

    
    constructor (project_id: number) {
        this.project_id = project_id
        this.lastProjectDataReceived = get(projects)[project_id]
        this.elapsed_time = this.lastProjectDataReceived.elapsedTime
        this.is_running = Boolean(this.lastProjectDataReceived.running)
    }


    private updateRunningTimer() {
        if (this.lastProjectDataReceived.playTimestamp)
            this.elapsed_time = this.lastProjectDataReceived.elapsedTime + (Date.now() - this.lastProjectDataReceived.playTimestamp)

        this.callToCallbacks()
    }


    private createUpdateRunningTimerInterval() {
        if (this.update_running_timer_interval_id)
            return

        this.update_running_timer_interval_id = setInterval(() => {this.updateRunningTimer()}, 1000)
    }


    private removeUpdateRunningTimerInterval() {
        clearInterval(this.update_running_timer_interval_id)
        this.update_running_timer_interval_id = undefined
    }


    private subscribeToProject() {
        return projectSubscriptionsHandler.subscribe(this.project_id, updatedProject => {
            this.lastProjectDataReceived = {...updatedProject}
            const project = this.lastProjectDataReceived

            if (project.running != this.is_running) {
                this.is_running = Boolean(project.running)

                if (this.is_running)
                    this.createUpdateRunningTimerInterval()
                else
                    this.removeUpdateRunningTimerInterval()
            }

            if (project.playTimestamp)
                this.elapsed_time = project.elapsedTime + (project.running ? (Date.now() - project.playTimestamp) : 0)

            this.callToCallbacks()
        })
    }


    private formatTime (value: number) {
        return value.toString().padStart(2, "0");
    }


    private updateTime() {
        let totalSeconds = Math.trunc(this.elapsed_time / 1000)

        this.hours.num = Math.trunc(totalSeconds / 3600)
        this.minutes.num = Math.trunc((totalSeconds % 3600) / 60)
        this.seconds.num = totalSeconds % 60

        this.hours.str = this.formatTime(this.hours.num)
        this.minutes.str = this.formatTime(this.minutes.num)
        this.seconds.str = this.formatTime(this.seconds.num)
    }


    private async callToCallbacks() {
        this.updateTime()
        for (const callback of this.subscribedCallbacks)
            callback({hours: this.hours, minutes: this.minutes, seconds: this.seconds})
    }


    /**
     * @param callback callback to get the timer in hours, min, sec
     * @returns a function to remove the subscription
     */
    subscribe(callback: ProjectTimerSubscriber) {
        this.subscribedCallbacks.add(callback)
        const unsubscriber = this.subscribeToProject()

        return () => {
            this.subscribedCallbacks.delete(callback)
            if (this.subscribedCallbacks.size === 0) {
                this.removeUpdateRunningTimerInterval()
                unsubscriber()
            }
        }
    }
}

