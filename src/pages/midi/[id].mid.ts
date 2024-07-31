import type { APIRoute } from 'astro';
import pkg from '@tonejs/midi';
const { Midi } = pkg;
import { readFile } from 'fs/promises';
import path from 'node:path';
import type { MidiData } from '../../models/MidiData';

function convertMidiFormat(midiToConvert: any) {
  const midiFormat = new Midi()
  midiFormat.header.setTempo(midiToConvert.header.bpm)

  midiToConvert.tracks.forEach((valueTrack: any)=>{
    const currentTrack = midiFormat.addTrack()
    currentTrack.name = valueTrack.name
    currentTrack.channel = valueTrack.channel

    valueTrack.notes.forEach((note: any)=>{
      currentTrack.addNote({
        name : note.name,
        time : note.time,
        duration: note.duration,
        velocity: note.velocity
      })
    })

    currentTrack.instrument.number = valueTrack.instrument.number
  })
  
  return midiFormat
}

export const GET: APIRoute = async ({params}) => {
    try {
      if (!params.id) {
        return new Response(JSON.stringify({ message: 'MIDI parameter is missing' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      //Lectura de Datos
      const filePath = path.join('/temp', `${params.id}.json`); //cambiar a ./src/assets
      const fileContent = await readFile(filePath, 'utf-8');

      //Conversion de Datos
      const midiRequest = await JSON.parse(fileContent) as MidiData;

      const midi = convertMidiFormat(midiRequest.midiScheme);

      const midiBuffer = midi.toArray();

      return new Response(Buffer.from(midiBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/midi',
          'Content-Disposition': `attachment; filename="${midiRequest.midiScheme.header.name}.mid"`,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: `MIDI file not found ${error}` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };