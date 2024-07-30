import { z } from 'zod'

export const MidiSchema = z.object({
    header: z.object({
        name: z.string().describe('The name of the composition. Be creative! Examples: "Symphony of the Stars", "Jazz Odyssey", "Electronic Dreamscape".'),
        bpm: z.number().describe('The number of BPM in the MIDI file, e.g. "150". Must be a positive integer.'),
        key: z.string().describe('The key of the MIDI file, e.g. "G# major". Should be a valid musical key.'),
        timeSignatures:
            z.object({
                numerator: z.number(),
                denominator: z.number(),
            }).describe("the time signature, e.g. [4, 4]")
    }),
    tracks: z.array(
        z.object({
            name: z.string().describe('The track name if one was given'),
            channel: z.number().describe('The MIDI channel number, e.g. 0 for melody, 1 for chord, 2 for bass. Must be an integer between 0 and 15.'),
            notes: z.array(
                z.object({
                    name: z.string().describe('The note name, e.g. "E4". Should be a valid musical note.'),
                    time: z.number().describe('The time of the note in seconds'),
                    duration: z.number().describe('duration in seconds between noteOn and noteOff'),
                    velocity: z.number().describe('The normalized velocity (volume) of the note, ranging from 0 to 1.'),
                }),
            ).describe('The array of the notes (must have at least 30 notes)'),
            instrument: z.object({
                number: z.number().describe('The standard instrument MIDI number, ranging from 0 to 127.'),
            }),
        }),
    ).describe('The array of the tracks'),
    
});
export default MidiSchema;

