<script lang="ts">
    import { onMount } from 'svelte'
	import { projects } from './../stores/projects'
	import { currentProjectId } from './../stores/currentProject'

    let titleElement: HTMLElement | null = $state(null)
    let title_width: number = $state(0)
    let updateWidth: () => any = () => {}

    projects.subscribe(updatedProjects => {
        updateWidth()
    })

    onMount(() => {
        updateWidth = () => {
            setTimeout(() => {
                if (titleElement)
                    title_width = parseInt(window.getComputedStyle(titleElement).width) + 3
            }, 100);
        }
        updateWidth()
        window.addEventListener("resize", updateWidth)
    })
</script>


<div class="container">
    <span>Project #{$currentProjectId}</span>
    <input
        class="project-title"
        type="text"
        style={title_width? `width: ${title_width}px` : "auto"}
        bind:value={$projects[$currentProjectId].title}
    />
    <h2
        class="project-title"
        style="height: 0; opacity: 0"
        bind:this={titleElement}
    >
        {$projects[$currentProjectId].title}
    </h2>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 70%;
        overflow: hidden;
        transition: all .3s ease-in;
    }

    span {
        font-size: 11px;
        font-weight: 300;
        letter-spacing: 1px;
        padding-left: 2px;
        text-transform: uppercase;
    }

    .project-title {
        font-family: "Montserrat";
        font-size: 32px;
        font-weight: 200;
        letter-spacing: 3px;
        margin: 0;
        line-height: 34px;
        text-transform: uppercase;
        border-radius: 5px;
        max-width: 100%;
        text-overflow: ellipsis;
        transition: all .3s ease-in;

        background: none;
        border: none;
        outline: none;
    }

    .container:has(.project-title:focus-visible) {
        outline: none;
        border: none;
        background: rgba(177, 222, 255, 0.135);
        box-shadow: 0 0 40px 16px #c5e7ff2c;
    }
</style>