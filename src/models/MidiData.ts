import { MidiSchema } from './MidiSchema';
import { z } from 'zod';
type Midi = z.infer<typeof MidiSchema>

export type MidiData = {
    id: string,
    date: Date,
    prompt: string,
    midiScheme: Midi
}