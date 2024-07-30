<script>
    import { setAppStatusError, AppStatusInfo, MIDI_STATUS } from "../store";
    const { prompt } = $AppStatusInfo;
    import StepGenerated from "./steps/StepGenerated.svelte";
    import StepLoading from "./steps/StepLoading.svelte";
    import Card from "./Card.svelte";

    let midis = [];

    async function processMidi() {
        try {
            const response = await fetch(
                "http://localhost:4321/api/generate-midi.json",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    body: prompt,
                },
            );
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            return;
        } catch (error) {
            setAppStatusError();
        }
    }

    async function processForm() {
        midis = Array(3).fill({ status: MIDI_STATUS.LOADING });

        for (let i = 0; i < 3; i++) {
            const result = await processMidi();
            if (result) midis[i] = { status: MIDI_STATUS.GENERATED, data: result };
            else midis[i] = { status: MIDI_STATUS.ERROR };
        }
    }
    processForm();
</script>

<div class="text-blue-300 mb-1 my-10">
    <p><strong>Prompt</strong>: {prompt}</p>
</div>

<div class="cards grid grid-cols-1 gap-10 p-10">
    {#each midis as midi}
        <Card loaded={midi.status === MIDI_STATUS.GENERATED} title={midi.status === MIDI_STATUS.GENERATED ? midi.data.midiScheme.header.name : ''} id={midi.status === MIDI_STATUS.GENERATED ? midi.data.id : ''}>
            {#if midi.status === MIDI_STATUS.LOADING}
                <span class="flex justify-center">
                    <StepLoading />
                </span>
            {:else if midi.status === MIDI_STATUS.GENERATED}
                <StepGenerated
                    date={midi.data.date}
                    bpm={midi.data.midiScheme.header.bpm}
                    key={midi.data.midiScheme.header.key}
                    notes={midi.data.midiScheme.tracks.reduce((acc, track) => acc + track.notes.length, 0)}
                    tracks={midi.data.midiScheme.tracks.length}
                />
            {:else if midi.status === MIDI_STATUS.ERROR}
                <p class="text-red-400">Error al generar el MIDI</p>
            {/if}
        </Card>
    {/each}
</div>
