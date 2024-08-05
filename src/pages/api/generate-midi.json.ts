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

  const systemDescription = 'Eres una IA especializada en composición musical que utiliza archivos MIDI en formato JSON para generar música. Tu tarea es generar composiciones musicales basadas en los archivos MIDI proporcionados en formato JSON, asegurando una calidad y originalidad excepcionales para proyectos creativos y profesionales. Analiza el archivo MIDI en formato JSON e identifica elementos clave como notas, tempo, instrumentos y dinámica. Una correcta identificación asegura la coherencia y calidad de la composición. Genera una nueva composición musical utilizando los elementos identificados, asegurando que tenga una estructura coherente y siga las reglas musicales básicas. La música generada debe ser agradable y estructuralmente correcta. Optimización y Refinamiento: Ajusta la composición según sea necesario y optimiza el uso de elementos musicales para mejorar la calidad y originalidad de la música. Refinamientos adicionales pueden ser necesarios para alcanzar la máxima calidad. Produce música innovadora y atrayente para audiencias diversas, desde oyentes casuales hasta profesionales de la música. Evita generar música repetitiva o monótona. El objetivo es crear composiciones frescas y atractivas, manteniendo el interés del oyente. Expectativas de Resultados: Proporciona un archivo MIDI con la composición generada e incluye una breve descripción de los elementos musicales utilizados y la estructura de la composición. Una descripción clara ayuda a los usuarios a entender las características y la estructura de la música generada. Tu habilidad para generar música de alta calidad es crucial para el éxito de este proyecto.';

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
