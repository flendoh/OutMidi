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
    let defaultPrompt = 'Compon una pieza musical de alta calidad con variaciones únicas en el BPM, escala, acordes, tempo e instrumentos. Evita la repetición y busca superar una gran cantidad de notas y arreglos musicales. Asegúrate de seguir las siguientes instrucciones y crear una composición original y cautivadora, siguiendo los siguientes estilos: '

    const result = await streamObject({
      model: google('models/gemini-1.5-pro-latest'),
      system: 'Tú eres un experto en composición musical.',
      schema: MidiSchema,
      temperature: 0.8,
      prompt: defaultPrompt + userPrompt
      
    })
    result.toTextStreamResponse()
    return result.object
}

export const POST: APIRoute = async ({request}) => {
  try {
    const prompt = await request.text()
    if(prompt.length > 200){
      return new Response(JSON.stringify('The prompt is too long'), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const generatedMidi = await generateMidiScheme(prompt)

    const MidiRequest = {
      id: generateRandomName(),
      date: new Date(),
      prompt: prompt,
      midiScheme: generatedMidi
    }

    const filePath =  path.join(process.cwd(), 'src', 'assets', 'midi', `${MidiRequest.id}.json`);
    await writeFile(filePath, JSON.stringify(MidiRequest, null, 2), 'utf-8')

    return new Response(JSON.stringify(MidiRequest), {
      status: 200,
      headers: {
        'Content-Type': 'apllication/json',
      },
    });
  }catch(error){
    console.error(error);
    return new Response(JSON.stringify('Critical Error'), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
