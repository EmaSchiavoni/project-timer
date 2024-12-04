<script lang="ts">
	import TimerTitle from './TimerTitle.svelte'
    import Timer from "./Timer.svelte"
</script>


<div id="timer_wrapper">
    <div class="timer-container">
        <TimerTitle/>
        <Timer/>
    </div>
</div>


<style>
    #timer_wrapper {
        flex-grow: 1;
        min-height: 100vh;
    }

    .timer-container {
        min-height: 85vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>