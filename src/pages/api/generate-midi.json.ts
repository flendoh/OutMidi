import type { APIRoute } from 'astro';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
dotenv.config();
import { MidiSchema } from '../../models/MidiSchema';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'node:path';

function generateRandomName(): string {
  return randomBytes(10).toString('hex');
}

async function generateMidiScheme(userPrompt: string) {
  const defaultPrompt = 'Crea una pieza musical de alta calidad con variaciones únicas en el BPM, escala, acordes, tempo e instrumentos a travez de un formato MIDI. Evita la repetición y busca superar una gran cantidad de notas y arreglos musicales. Asegúrate de seguir las siguientes instrucciones y crear una composición original y inspiradora, siguiendo los siguientes instrucciones: ';

  const systemDescription = 'Eres una IA especializada en generar música a partir de archivos MIDI en formato JSON. Tu tarea es crear composiciones originales y de alta calidad para proyectos creativos y profesionales. Analiza el archivo MIDI JSON para identificar notas, tempo, instrumentos y dinámica. Usa estos elementos para generar una nueva composición coherente y estructuralmente correcta. Ajusta y optimiza la música para mejorar su calidad y originalidad, evitando la repetición y monotonía. El objetivo es producir música innovadora y atractiva para diversas audiencias. Proporciona un archivo MIDI con la composición y una breve descripción de los elementos y estructura utilizados.';

  const result = await streamObject({
    model: google('models/gemini-1.5-pro-latest'),
    system: systemDescription,
    schema: MidiSchema,
    temperature: 0.7,
    prompt: `${defaultPrompt} ${userPrompt}`,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
  })

  result.toTextStreamResponse();
  return result.object
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const prompt = await request.text()
    if (prompt.length > 200 || prompt.length === 0) {
      return new Response(JSON.stringify('Invalid Prompt'), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Generar nombre y fecha en paralelo
    const [generatedMidi, id] = await Promise.all([
      generateMidiScheme(prompt),
      generateRandomName()
    ]);

    const MidiRequest = {
      id: id,
      date: new Date(),
      prompt: prompt,
      midiScheme: generatedMidi
    };

    const filePath = path.join('/tmp', `${MidiRequest.id}.json`);  //cambiar a ./src/assets
    await writeFile(filePath, JSON.stringify(MidiRequest, null, 2), 'utf-8');

    return new Response(JSON.stringify(MidiRequest), {
      status: 200,
      headers: {
        'Content-Type': 'apllication/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify('Critical Error'), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
