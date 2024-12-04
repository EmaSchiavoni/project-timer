<script lang="ts">
    import type { Project } from '../types/Project'
    import { currentProjectId } from '../stores/currentProject'
    import { removeProject } from '../utils/removeProject'
	import { projects } from './../stores/projects'
	import ContextMenu from './ContextMenu.svelte'
    import ProjectInfoModal from './ProjectInfoModal.svelte'
    import ProjectListItem from './ProjectListItem.svelte'

    let contextMenu: {x: number, y: number, projectId: Project["id"]} | null = $state(null)
    let modalProject: Project["id"] | null = $state(null)

    const showContextMenu = (e: MouseEvent & {currentTarget: EventTarget & HTMLButtonElement}, id: Project["id"]) => {
        e.preventDefault()
        contextMenu = {x: e.pageX, y: e.pageY, projectId: id}
        addEventListener("click", closeContextMenu, {once: true})
    }

    const closeContextMenu = () => {
        contextMenu = null
    }

    const showProjectInfo = (id: Project["id"]) => {
        modalProject = id
    }
</script>


<ul>
    {#each Object.values($projects).sort((a, b) => (b.lastUse - a.lastUse)) as project}
        <ProjectListItem
            onClick={() => currentProjectId.set(project.id)}
            onContextMenu={e => showContextMenu(e, project.id)}
            project={project}
        />
    {/each}
</ul>

{#if contextMenu}
    <ContextMenu x={contextMenu.x} y={contextMenu.y}>
        <div
            class="context-menu-item"
            onclick={() => {contextMenu && removeProject(contextMenu.projectId)}}
            onkeydown={(e) => e.key == "Enter" && contextMenu && removeProject(contextMenu.projectId)}
            role="menu"
            tabindex="0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 7l16 0"></path>
                <path d="M10 11l0 6"></path>
                <path d="M14 11l0 6"></path>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
             </svg>
             Delete
        </div>
        <div
            class="context-menu-item"
            onclick={() => {contextMenu && showProjectInfo(contextMenu.projectId)}}
            onkeypress={e => {e.key == "Enter" && contextMenu && showProjectInfo(contextMenu.projectId)}}
            role="menu"
            tabindex="0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M12 9h.46"></path>
                <path d="M11 12h1v4h1"></path>
             </svg>
             Info
        </div>
    </ContextMenu>
{/if}
{#if modalProject != null}
    <ProjectInfoModal projectId={modalProject} onClose={() => modalProject = null} />
{/if}

<style>
    ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin: 0;
        white-space: nowrap;
        height: calc(100vh - 110px);
        height: stretch;
        height: fill-available;
        height: -webkit-fill-available;
        height: -moz-available;
        overflow-y: auto;
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 7px 10px;
        cursor: pointer;
    }

    .context-menu-item:hover {
        background: #d8e5ff21;
    }

    .context-menu-item svg {
        margin-right: 8px;
    }
    
</style>