<script>
    import { setAppStatusGenerate } from "../store";

    let prompt = '';
    
    function handleSubmit(event) {
        event.preventDefault();
        setAppStatusGenerate({prompt});
    }
</script>

<div class="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-lg mx-auto my-10">
    <h2 class="text-2xl font-bold text-blue-300 mb-4">Generar Nueva Idea</h2>
    <form class="space-y-4" on:submit|preventDefault={handleSubmit}>        
        <label
            for="prompt"
            class="block text-sm font-medium text-blue-200 mb-2"
        >
            Describe tu idea musical:
        </label>
        <textarea
            id="prompt"
            rows="3"
            class="w-full px-3 py-2 text-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-800 border-gray-600"
            placeholder="Ej: Una melodía de piano suave con ritmo de jazz..."
            type="text"
            bind:value={prompt}
            maxlength="200"
        />
        <button
            type="submit"
            disabled={prompt.length === 0}
            class="w-full font-bold py-2 px-4 rounded-lg transition-colors duration-300
            {prompt.length === 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'}"
        >
            Generar
        </button>
    </form>
</div>
