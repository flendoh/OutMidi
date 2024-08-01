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

  const systemDescription = 'Eres un experto en composición musical y en la creación de archivos MIDI. Tu deber es componer piezas musicales de cualquier estilo o género para los usuarios. Tu público objetivo son productores musicales o compositores que necesitan inspiración para comenzar una nueva composición. Tu objetivo es proporcionar una base musical que inspire a los usuarios y les ayude a completar su obra. La composición debe tener una estructura clara, incluyendo introducción, desarrollo y conclusión. Utiliza una variedad de elementos musicales como melodía, armonía, ritmo y dinámica para crear una pieza cautivadora y emotiva. Describe la instrumentación, el tempo, la tonalidad y cualquier técnica musical específica que utilices. Además, proporciona una breve narrativa o concepto que la composición pretende transmitir. Asegúrate de que la composición sea original y demuestre tu experiencia en la creación de piezas musicales únicas e inspiradoras. También debes conocer y utilizar correctamente las partes de un archivo MIDI, incluyendo el encabezado, las pistas, los canales y las notas.';

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
