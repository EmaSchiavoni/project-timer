<script lang="ts">
    type Props = {
        x: number
        y: number
        children?: import('svelte').Snippet
    }

    let { x, y, children }: Props = $props()
</script>


<div class="container" style={`top:${y}px; left:${x}px`}>
    {@render children?.()}
</div>


<style>
    .container {
        position: fixed;
        background: rgb(23, 26, 33);
        border-radius: 5px;
        outline: solid 1px rgb(55, 60, 74);
        font-size: 12px;
        font-weight: 300;
        letter-spacing: .3px;
    }
</style>