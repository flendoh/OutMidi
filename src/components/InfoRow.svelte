<script>
    export let label, value;
</script>

<div
    class="flex items-center text-gray-200 bg-gray-700 bg-opacity-50 rounded-lg p-2 text-sm"
>
    <div class="mr-2"><slot/></div>
    <span class="font-medium mr-1">{label}:</span>
    <span class="ml-auto">{value}</span>
</div>
