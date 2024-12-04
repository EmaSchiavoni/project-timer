<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements"
    import type { Project } from "$lib/types/Project"

    type Props = {
        onClick: () => any
        onContextMenu: MouseEventHandler<HTMLButtonElement>
        project: Project
    }

    const {onClick, onContextMenu, project}: Props = $props()
</script>


<li>
    <button
        onkeydown={(e) => e.key == "Enter" && onClick()}
        onclick={onClick}
        oncontextmenu={onContextMenu}
    >
        <span class="project-name">{project.title}</span>
        <span class="project-id">#{project.id}</span>
    </button>
</li>


<style>
    li {
        list-style: none;
        position: relative;
        width: 100%;
        transition: all .2s linear;
    }

    li > button {
        position: relative;
        display: flex;
        align-items: center;
        padding: 15px 0;
        width: 100%;
        background: transparent;
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: all .2s linear;
    }

    button span {
        flex-grow: 1;
        display: block;
        text-align: left;
        font-size: 15px;
        font-weight: 400;
        letter-spacing: 1px;
        line-height: 25px;
    }

    li::after {
        content: "";
        position: absolute;
        width: 85%;
        left: 7.5%;
        bottom: 0;
        border-bottom: solid 2px rgba(255, 255, 255, 0.055);
    }

    button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    button > *:first-child {
        margin-left: 7.5%;
    }

    button > *:last-child {
        margin-right: 7.5%;
    }

    li:has(:global(.remove-project-btn:hover)) {
        background: rgba(216, 17, 17, 0.2);
    }

    .project-name {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .project-id {
        flex-grow: 0;
        font-size: 9;
        font-weight: 300;
        opacity: .5;
    }
</style>