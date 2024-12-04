<script lang="ts">
    import "../styles/app.css"
    import ColorLights from "../lib/components/ColorLights.svelte"
    import Sidenav from "../lib/components/Sidenav.svelte"
    import TimerContainer from "../lib/components/TimerContainer.svelte"
</script>


<svelte:head>
    <title>Projects Timer</title> 
</svelte:head>


<ColorLights/>
<Sidenav/>
<TimerContainer/>


<style>
    :global(body) {
        background-color: black;
        display: flex;
        padding: 0;
        min-width: 100vw;
        min-height: 100vh;
        font-family: "Montserrat", Arial, Helvetica, sans-serif;
    }
</style>
