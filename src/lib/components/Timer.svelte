<script lang="ts">
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { projects } from '../stores/projects'
	import { currentProjectId } from './../stores/currentProject'
    import { projectTimersHandler } from '../utils/ProjectTimersHandler'

    let lastCurrentProjectId = get(currentProjectId)
    let running: boolean = $state( Boolean($projects[$currentProjectId].running) )

    let timer = $state({
        hours: {num: 0, str: "00"},
        minutes: {num: 0, str: "00"},
        seconds: {num: 0, str: "00"}
    })

    const onPause = () => {
        projects.update(liveProjects => {
            const project = liveProjects[lastCurrentProjectId]
            return ({
                ...liveProjects,
                [project.id]: {
                    ...project,
                    playTimestamp: undefined,
                    running: false,
                    elapsedTime: project.elapsedTime + Date.now() - (project.playTimestamp || 0)
                }
            })
        })
    }

    const onPlay = () => {
        projects.update(liveProjects => ({
            ...liveProjects,
            [$currentProjectId]: {
                ...liveProjects[$currentProjectId],
                playTimestamp: Date.now(),
                running: true
            }
        }))
    }

    const changeRunningState = () => {
        if (running = !running) onPlay()
        else onPause()
    }
    

    let unsubscribeToTimer: () => void

    const subscribeToTimer = () => {
        unsubscribeToTimer = projectTimersHandler.subscribeToProject(lastCurrentProjectId, (liveTimer) => timer = liveTimer)
    }

    currentProjectId.subscribe(newCurrentProject => {
        if (running && lastCurrentProjectId != newCurrentProject)
            onPause()

        unsubscribeToTimer && unsubscribeToTimer()
        const currentProject = $projects[newCurrentProject]

        running = Boolean(currentProject.running)
        lastCurrentProjectId = newCurrentProject
        subscribeToTimer()
    })

    onDestroy(() => {
        unsubscribeToTimer && unsubscribeToTimer()
    })
</script>


<h1>
    {timer.hours.str}:{timer.minutes.str}:{timer.seconds.str}
</h1>
<button class="timer-button" aria-label="Start timer" onclick={changeRunningState}>
    {#if running}
        <svg id="pause-icon" viewBox="0 0 100 100" width=18 height=18>
            <path d="M 12 0 l 27 0 l 0 100 l -27 0 Z m 50 0 l 27 0 l 0 100 l -27 0 Z" fill="white" />
        </svg>
    {:else}
        <svg id="play-icon" viewBox="0 0 100 100" width=18 height=18>
            <path d="M 15 0 L 100 50 L 15 100 Z" fill="white" />
        </svg>
    {/if}
</button>


<style>
    h1 {
        font-weight: 100;
        font-size: 60px;
        letter-spacing: 1px;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }

    .timer-button {
        outline: none;
        border: none;
        border-radius: 50px;
        height: 50px;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        background: rgba(103, 174, 255, 0.08);
        box-shadow:0 0 25px #67adff20;
        transition: all .3s ease-out;
    }

    .timer-button:hover {
        background: rgba(103, 174, 255, 0.15);
        box-shadow:0 0 75px #80bbff80 !important;
    }

    @media screen and (min-width: 570px) {
        h1 {
            font-size: 100px;
        }
    }
</style>