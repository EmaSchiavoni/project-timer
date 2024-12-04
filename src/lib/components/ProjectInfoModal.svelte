<script lang="ts">
    import type { Project } from "../types/Project"
    import type { TransitionConfig } from 'svelte/transition'
    import { onDestroy } from "svelte"
    import { expoOut } from "svelte/easing"
	import { projects } from './../stores/projects'
    import { projectTimersHandler } from '../utils/ProjectTimersHandler'
    
    type Props = {
        projectId: Project["id"]
        onClose: () => any
    }

    let {projectId, onClose}: Props = $props()
    
    let modal: HTMLDivElement | undefined = $state()

    const modalShouldClose = (e: MouseEvent) => {
        if (!modal?.contains(e.target as Node))
            onClose()
    }

    const slidefade = (node: HTMLElement, params: TransitionConfig = {}): TransitionConfig => {
        const existingTransform = getComputedStyle(node).transform.replace('none', '')

        return {
            delay: params?.delay || 0,
            duration: params?.duration || 500,
            easing: params?.easing || expoOut,
            css: (t, u) => `transform-origin: top left; transform: ${existingTransform} scaleY(${t}); opacity: ${t};`
        };
    }

    let hours = $state(0)
    let min = $state(0)
    let sec = $state(0)

    let unsubscribeToTimer: (() => void) | undefined = $state()

    const subscribeToTimer = () => {
        const unsubscriber = projectTimersHandler.subscribeToProject(projectId, (timer) => {
            hours = timer.hours.num
            min = timer.minutes.num
            sec = timer.seconds.num
        })
        unsubscribeToTimer = () => {
            unsubscriber()
            unsubscribeToTimer = undefined
        }
    }

    const updateProjectTime = () => {
        projects.update(liveProjects => {
            const project = liveProjects[projectId]
            return {
                ...liveProjects,
                [project.id]: {
                    ...project,
                    elapsedTime: hours * 3600000 + min * 60000 + sec * 1000,
                    playTimestamp: project.running? Date.now() : project.playTimestamp
                }
            }
        })
        subscribeToTimer()
    }

    subscribeToTimer()

    setTimeout(() => {
        document.addEventListener("click", modalShouldClose)
    }, 10)

    onDestroy(() => {
        document.removeEventListener("click", modalShouldClose)
        unsubscribeToTimer && unsubscribeToTimer()
    })
</script>


<div class="container" transition:slidefade|global>
    <div class="modal" bind:this={modal}>
        <div class="project-data">
            <label for="project_id">ID</label>
            <input id="project_id" disabled value={$projects[projectId].id} />
        </div>
        <div class="project-data">
            <label for="project_creation">Creation date</label>
            <input id="project_creation" disabled value={new Date($projects[projectId].created).toLocaleString()} />
        </div>
        <div class="project-data">
            <label for="project_title">Title</label>
            <input id="project_title" type="text" bind:value={$projects[projectId].title} />
        </div>
        <div class="project-data">
            <label for="project_description">Description</label>
            <textarea id="project_description" bind:value={$projects[projectId].description}></textarea>
        </div>
        <div class="project-data">
            <label for="project_elapsed_time">Elapsed time</label>
            <fieldset id="project_elapsed_time">
                <div class="project-data">
                    <label for="project_hours">H</label>
                    <input id="project_hours" type="number" bind:value={hours} onchange={updateProjectTime} onfocus={unsubscribeToTimer} />
                </div>
                <div class="project-data">
                    <label for="project_minutes">MIN</label>
                    <input id="project_minutes" type="number" bind:value={min} onchange={updateProjectTime} onfocus={unsubscribeToTimer} />
                </div>
                <div class="project-data">
                    <label for="project_seconds">SEC</label>
                    <input id="project_seconds" type="number" bind:value={sec} onchange={updateProjectTime} onfocus={unsubscribeToTimer} />
                </div>
            </fieldset>
        </div>
    </div>
</div>


<style>
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: 99vw;
        height: 100vh;
        display: flex;
        place-content: center;
        place-items: center;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        transition: all .3s ease-out;
    }

    .modal {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 90vw;
        height: 80vh;
        max-width: 600px;
        background: rgb(16, 19, 24);
        border-radius: 6px;
        box-shadow: 0 0 10px black;
        transition: all .3s ease-out;
    }
    
    .modal > div:first-child {
        padding-top: 25px;
    }

    .modal > div {
        padding: 6px 30px;
    }

    .modal input, .modal textarea {
        background: #1d1f23;
    }

    .modal input[disabled] {
        background: hsla(220, 5%, 10%, 0.6);
    }
    
    .project-data {
        display: flex;
        width: -webkit-fill-available;
        align-items: center;
    }

    .project-data label {
        font-weight: 400;
        font-size: 15px;
        letter-spacing: .6px;
    }

    .project-data input,
    .project-data textarea {
        font-family: "Montserrat", Arial, Helvetica, sans-serif;
        font-weight: 300;
        letter-spacing: .5px;
        margin-left: 14px;
        padding: 10px 10px;
        border-radius: 5px;
        border: none;
        outline: none;
        flex-grow: 1;
    }

    .project-data:has(textarea) label {
        align-self: flex-start;
    }

    .project-data:has(#project_elapsed_time) > label {
        width: 110px;
        text-align: left;
    }

    .project-data:has(#project_elapsed_time) fieldset {
        border: none;
        display: flex;
        gap: 10px;
        justify-content: space-between;
        flex-grow: 1;
        padding: 0;
        margin-left: 15px;
    }

    .project-data:has(#project_elapsed_time) fieldset .project-data {
        align-self: stretch;
    }

    .project-data:has(#project_elapsed_time) fieldset input {
        width: 40px;
        font-variant-numeric: tabular-nums;
        text-align: center;
    }

    .project-data:has(#project_elapsed_time) fieldset label {
        opacity: .5;
        font-size: .8rem;
    }

    @media screen and (max-width: 575px) {
        .project-data:has(#project_elapsed_time) {
            display: flex;
            flex-flow: column;
            align-items: start;
        }

        .project-data:has(#project_elapsed_time) fieldset {
            width: 100%;
            justify-content: space-between;
            margin-top: 10px;
            margin-left: 0px
        }
    }

    @media screen and (max-width: 413px) {
        .project-data:has(#project_elapsed_time) fieldset label {
            width: 30px;
            text-align: left;
        }

        .project-data:has(#project_elapsed_time) fieldset {
            flex-flow: column;
            margin-left: 0px;
        }
    }
</style>