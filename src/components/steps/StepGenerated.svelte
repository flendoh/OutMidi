<script>
    export let date, bpm, key, notes, tracks, timeSignatures;
    import InfoRow from "../InfoRow.svelte";
    import NoteIcon from "../Icons/NoteIcon.svelte";
    import DateIcon from "../Icons/DateIcon.svelte";
    import DiscIcon from "../Icons/DiscIcon.svelte";
    import KeyIcon from "../Icons/KeyIcon.svelte";
    import TrackIcon from "../Icons/TrackIcon.svelte";
    import Divide from "../Icons/Divide.svelte";
</script>

<InfoRow label="Fecha" value={date}>
    <span class="text-blue-400"><DateIcon /></span>
</InfoRow>
<InfoRow label="BPM" value={bpm}>
    <span class="text-yellow-400"><DiscIcon /></span>
</InfoRow>
<InfoRow label="Escala" value={key}>
    <span class="text-pink-400"><KeyIcon /></span>
</InfoRow>
<InfoRow label="Cantidad de Notas" value={notes}>
    <span class="text-green-400"><NoteIcon /></span>
</InfoRow>
<InfoRow label="Cantidad de Tracks" value={tracks}>
    <span class="text-red-400"><TrackIcon /></span>
</InfoRow>
<InfoRow label="Compás" value={timeSignatures}>
    <span class="text-orange-400"><Divide /></span>
</InfoRow>