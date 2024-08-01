<script>
	export let title, id;
	export let loaded = false;
    import MusicIcon from "./Icons/MusicIcon.svelte";
	import DownloadIcon from "./Icons/DownloadIcon.svelte";
</script>

<!-- Card -->
<div class="w-92 h-auto bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 flex flex-col justify-between transform transition duration-200 hover:translate-y-1 hover:opacity-90">


	<div class="p-4 flex-grow">
		<h2 class="text-xl font-semibold text-gray-100 mb-3 flex items-center">
			{#if loaded}
                <span class="mr-2 text-purple-400">
                    <MusicIcon/>
                </span>
				{title}
			{/if}
		</h2>
		{#if loaded}
			<div class="grid grid-cols-2 gap-3">
				<slot />
			</div>
		{:else}
			<div class="justify-center">
				<slot />
			</div>
		{/if}
	</div>
	<!-- Download button -->
	<a href={loaded ? `./midi/${id}.mid` : "#"} class="w-full"
        target="_blank" download={loaded ? `${title}.mid` : ""}
    >
		<button
			class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 transition duration-300 flex items-center justify-center group"
			disabled={!loaded}
			style="opacity: {loaded ? 1 : 0.5}; cursor: {loaded ? 'pointer' : 'not-allowed'};"
		>
			<span class="w-5 h-5 mr-2">
				<DownloadIcon/>
			</span>
			Descargar
		</button>
	</a>
</div>