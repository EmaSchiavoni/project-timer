<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements"

    type Props = {
        open: boolean
        onClick: MouseEventHandler<HTMLButtonElement>
    }

    let {open, onClick }: Props = $props()
</script>


<button
    class={open? "open" : undefined}
    onclick={onClick}
    aria-label={open? "Cerrar menú" : "Abrir menú"}
>
    <div></div>
    <div></div>
    <div></div>
</button>


<style>
    button {
        position: fixed;
        padding: 5px;
        margin: 0;
        top: 13px;
        right: 15px;
        width: 40px;
        background: none;
        outline: none;
        border: none;
        z-index: 100;
    }

    button div {
        background: white;
        width: 100%;
        height: 3px;
        margin-bottom: 6px;
        transition: all .2s ease-out;
    }

    button.open div:nth-child(1) {
        transform: translateY(9px) rotate(-45deg);
    }

    button.open div:nth-child(2) {
        transition: none;
        opacity: 0;
    }

    button.open div:nth-child(3) {
        transform: translateY(-9px) rotate(45deg);
    }

    @media screen and (min-width:860px) {
        button {
            position: initial;
            background: transparent;
            border-radius: 0;
            background: linear-gradient(90deg, rgba(149, 186, 253, 0.15) 0%, rgba(168, 202, 255, 0.07) 50%, #00000000 100%);
            background-repeat: no-repeat;
            background-position: -50px;
            transition: all .2s linear;
        }

        button div:nth-child(2) {
            display: none;
        }

        button:hover, button:not(.open) {
            background-position: 0px;
        }

        button div {
            height: 2px;
            width: 10px;
            margin-left: 3px;
            opacity: .5;
        }

        button:hover div {
            opacity: 1;
        }

        button div:nth-child(1) {
            transform: translateY(1px) rotate(45deg);
        }

        button div:nth-child(3) {
            transform: rotate(-45deg);
        }

        button.open div:nth-child(1) {
            transform: translateY(1px) rotate(-45deg);
        }

        button.open div:nth-child(3) {
            transform: rotate(45deg);
        }
    }
</style>