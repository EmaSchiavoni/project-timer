export type Project = {
    id: number
    title: string
    description: string
    running?: boolean
    elapsedTime: number
    playTimestamp?: number
    lastUse: number
    created: number
}