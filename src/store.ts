import { writable } from "svelte/store";

export const APP_STATUS = {
    INIT: 0,
    GENERATE: 1,
    ERROR: -1,
}

export const MIDI_STATUS = {
    LOADING: 1,
    GENERATED: 2,
    ERROR: -1,
}

export const AppStatus = writable(APP_STATUS.INIT);
export const AppStatusInfo = writable({prompt: ''});

export const setAppStatusError = () => {
    AppStatus.set(APP_STATUS.ERROR);
}

export const setAppStatusGenerate = ({prompt}: {prompt:string}) => {
    AppStatus.set(APP_STATUS.GENERATE);
    AppStatusInfo.set({prompt});
}