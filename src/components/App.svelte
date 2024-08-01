<script>
    import { APP_STATUS, AppStatus } from "../store";
    import Submit from "./Submit.svelte";
    import Generate from "./Generate.svelte";
</script>

{#if $AppStatus === APP_STATUS.INIT}
    <Submit />
{:else if $AppStatus === APP_STATUS.GENERATE}
    <Generate />
{:else if $AppStatus === APP_STATUS.ERROR}
    <p class="text-red-400 mt-4">Error!</p>
{:else}
    <p>Unknown status</p>
{/if}
