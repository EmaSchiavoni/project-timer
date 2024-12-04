<script lang="ts">
    import { onMount } from 'svelte'
	import { addNewProject } from './../utils/addNewProject'
	import ProjectList from './ProjectList.svelte'
    import SidenavToggleButton from "./SidenavToggleButton.svelte"

    let is_open = $state(false)

    const toggleSidenav = () => is_open = !is_open

    onMount(() => {
        is_open = window.innerWidth > 860
    })
</script>


<nav>
    <div id="sidenav" class={is_open? "open" : ""}>
        <div class="nav-header">
            <h3>Projects</h3>
            <button class="add-btn" onclick={addNewProject}>+</button>
        </div>
        <ProjectList/>
    </div>
    <SidenavToggleButton onClick={toggleSidenav} open={is_open} />
</nav>


<style>
    nav {
        flex-grow: 0;
        position: fixed;
        top: 0;
        left: 0;
    }

    #sidenav {
        display: flex;
        flex-direction: column;
        width: 0;
        height: 100vh;
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(8px);
        transition: all .3s ease-out;
    }

    #sidenav.open {
        width: 100vw;
    }

    .nav-header {
        display: flex;
        position: sticky;
        overflow: hidden;
        top: 0;
        z-index: 2;
        background: linear-gradient(rgba(0, 0, 0, .88) 60%, transparent);
        margin: 0;
        padding: 65px 7.5%;
    }

    h3 {
        font-size: 23px;
        font-weight: 200;
        letter-spacing: 5px;
        text-transform: uppercase;
        text-align: left;
        margin: 0;
        margin-right: 15px;
    }

    .add-btn {
        border: none;
        outline: none;
        font-size: 30px;
        font-weight: 200;
        font-family: inherit;
        padding: 0 10px;
        align-self: center;
        background: transparent;
        transition: all .2s linear;
    }

    .add-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    @media screen and (min-width: 570px) {
        #sidenav.open {
            width: 285px;
        }

        .nav-header {
            padding: 35px 7.5%;
        }
    }

    @media screen and (min-width: 860px) {
        nav {
            position: static;
            display: flex;
        }
    }
</style>