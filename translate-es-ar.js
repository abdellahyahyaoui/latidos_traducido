#!/usr/bin/env node
/**
 * script-node: traductor literario ES→AR para JSON (React projects)
 * ---------------------------------------------------------------
 * Qué hace
 * - Lee uno o varios archivos .json con contenido en español (estructura como cartas-esperanza.json, poesia.json, etc.)
 * - Traduce SOLO los campos textuales a árabe (árabe estándar moderno / فصحى) con equivalencia literaria, NO literal.
 * - Mantiene la estructura, los arrays y sus longitudes.
 * - Escribe los resultados en una carpeta de salida, con sufijo .ar.json (o clonando la estructura de carpetas).
 *
 * Cómo usar
 *   1) npm i openai
 *   2) Exporta tu API key:  OPENAI_API_KEY=tu_key  (o usa un .env si prefieres)
 *   3) Ejecuta:
 *        node translate-es-ar.js --in ./data --out ./salida \
 *             --files cartas-esperanza.json poesia.json autores.json \
 *             --model gpt-4o-2024-08-06
 *
 *   Flags opcionales
 *      --concurrency 2         // nº de peticiones simultáneas (1 por defecto)
 *      --overwrite             // sobreescribe si el .ar.json ya existe
 *      --translateNames        // también traduce/translitera nombres propios (por defecto NO)
 *      --rtlAlt                // traduce alt/caption (por defecto NO)
 *      --dry                   // no llama a la API; imprime lo que haría
 *
 * Notas
 *  - Usa la Responses API con Structured Outputs (JSON Schema) para garantizar arrays alineados.
 *  - Si el modelo devuelve una longitud incorrecta en un bloque de líneas, hay fallback: línea a línea.
 *  - Ajusta el PROMPT si quieres otro registro (p. ej., más clásico o más coloquial). Por defecto: فصحى literaria sobria.
 */

import fs from 'fs';
import path from 'path';
import process from 'process';
import OpenAI from 'openai';

// =============== Config por CLI ===============
const args = (() => {
  const a = process.argv.slice(2);
  const out = { inDir: '.', outDir: './salida', files: [], model: process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06', concurrency: 1, overwrite: false, translateNames: false, rtlAlt: false, dry: false };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--in') out.inDir = a[++i];
    else if (k === '--out') out.outDir = a[++i];
    else if (k === '--files') { while (a[i+1] && !a[i+1].startsWith('--')) out.files.push(a[++i]); }
    else if (k === '--model') out.model = a[++i];
    else if (k === '--concurrency') out.concurrency = parseInt(a[++i] || '1', 10) || 1;
    else if (k === '--overwrite') out.overwrite = true;
    else if (k === '--translateNames') out.translateNames = true;
    else if (k === '--rtlAlt') out.rtlAlt = true;
    else if (k === '--dry') out.dry = true;
  }
  if (!out.files.length) {
    // Si no pasan --files, procesa todos los .json del directorio --in
    out.files = fs.readdirSync(out.inDir).filter(f => f.toLowerCase().endsWith('.json'));
  }
  return out;
})();

// =============== Cliente OpenAI ===============
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============== Prompt del traductor (SYSTEM) ===============
const SYSTEM_PROMPT = `
Eres un TRADUCTOR LITERARIO profesional ES→AR. Tu meta es crear árabe estándar moderno (فصحى) con belleza, precisión semántica y naturalidad nativa, evitando calcos literales.

REGLAS DE ESTILO (obligatorias):
1) Conserva el sentido, el tono emocional y la intención del autor. No traduzcas palabra por palabra: adapta metáforas, giros y refranes a equivalentes árabes naturales.
2) Registro: فصحى literaria contemporánea, sobria y clara. Mantén la musicalidad: paralelismos, anáforas y repeticiones con cadencia árabe.
3) Nombres propios, topónimos y hashtags: NO los traduzcas; translitera sólo si se te solicita. Mantén términos islámicos o fórmulas religiosas existentes tal cual (p. ej., «إنا لله وإنا إليه راجعون»).
4) Puntuación: usa signos árabes «، ؛ ؟» y la elipsis «…» donde corresponda. Conserva guiones largos/diálogos «—».
5) Cifras: mantén los números con dígitos arábigos estándar (0–9) salvo que el texto ya use numerales árabes; no alteres fechas.
6) Segmentación: ***No añadas ni elimines líneas***. Si la entrada es un array de N líneas, devuelve exactamente N líneas, preservando líneas vacías.
7) Sin notas del traductor. No expliques, no comentes.
8) Mantén cualquier texto que ya esté en árabe sin cambios.

DEVOLUCIÓN ESTRUCTURADA (obligatoria):
- Para un BLOQUE DE LÍNEAS, responde en JSON estrictamente con este esquema: { "lines_ar": string[] } donde la longitud debe coincidir con el input.
- Para un TEXTO ÚNICO, responde: { "text_ar": string }.
`;

// =============== JSON Schemas para Structured Outputs ===============
const schemaLines = {
  name: 'LinesAR',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      lines_ar: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['lines_ar']
  }
};

const schemaText = {
  name: 'TextAR',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      text_ar: { type: 'string' }
    },
    required: ['text_ar']
  }
};

// =============== Helpers de traducción ===============
async function translateLines(lines, model) {
  if (!lines || !lines.length) return [];
  const input = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `Traduce al árabe literario (فصحى) el siguiente ARRAY de líneas españolas. Devuelve EXACTAMENTE el mismo nº de líneas, alineadas por índice.\n\nINPUT_LINES(JSON):\n${JSON.stringify(lines, null, 2)}`
        }
      ]
    }
  ];
  const resp = await client.responses.create({
    model,
    messages: input,
    response_format: { type: 'json_schema', json_schema: schemaLines }
  });
  try {
    const parsed = JSON.parse(resp.output_text || '{}');
    const out = parsed.lines_ar || [];
    if (out.length !== lines.length) throw new Error(`Longitud distinta: ${out.length} vs ${lines.length}`);
    return out;
  } catch (e) {
    // Fallback: línea a línea
    const out = [];
    for (const ln of lines) out.push(await translateText(ln, model));
    return out;
  }
}

async function translateText(text, model) {
  if (text === '' || text == null) return text ?? '';
  const input = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `Traduce al árabe literario (فصحى) este TEXTO ÚNICO:\n\n${text}`
        }
      ]
    }
  ];
  const resp = await client.responses.create({
    model,
    messages: input,
    response_format: { type: 'json_schema', json_schema: schemaText }
  });
  const parsed = JSON.parse(resp.output_text || '{}');
  return parsed.text_ar || '';
}

// =============== Selección de campos a traducir ===============
function shouldTranslateKey(key, parent = {}, options) {
  const K = String(key).toLowerCase();
  if (['id'].includes(K)) return false;
  if (['image', 'video', 'src', 'href', 'url', 'link', 'instagram', 'telegram', 'donation'].includes(K)) return false;
  if (['alt', 'caption'].includes(K) && !options.rtlAlt) return false;
  if (['nombre', 'name', 'autor', 'author'].includes(K) && !options.translateNames) return false;
  // Campos típicos a traducir
  if ([ 'titulo', 'title', 'fragmento', 'description', 'texto' ].includes(K)) return true;
  // Campos genéricos tipo contenido
  if ([ 'content', 'contents', 'texto', 'text' ].includes(K)) return true;
  return false;
}

// =============== Procesado recursivo del objeto JSON ===============
async function processNode(node, model, options, pathTrail = []) {
  if (Array.isArray(node)) {
    // Si es array de strings => traducir manteniendo longitud
    if (node.every(v => typeof v === 'string')) {
      return await translateLines(node, model);
    }
    // Si es array mixto/objetos => procesar cada elemento
    const out = [];
    for (let i = 0; i < node.length; i++) {
      out.push(await processNode(node[i], model, options, pathTrail.concat(`[${i}]`)));
    }
    return out;
  }
  if (node && typeof node === 'object') {
    const out = Array.isArray(node) ? [] : {};
    for (const [k, v] of Object.entries(node)) {
      if (v == null) { out[k] = v; continue; }
      if (typeof v === 'string' && shouldTranslateKey(k, node, options)) {
        // traducir como texto único y guardar en *nuevo* campo *_ar
        const arKey = `${k}_ar`;
        out[k] = v; // mantener el original
        out[arKey] = await translateText(v, model);
      } else if (Array.isArray(v) && shouldTranslateKey(k, node, options) && v.every(x => typeof x === 'string')) {
        // array de líneas: crear *_ar
        const arKey = `${k}_ar`;
        out[k] = v;
        out[arKey] = await translateLines(v, model);
      } else {
        out[k] = await processNode(v, model, options, pathTrail.concat(k));
      }
    }
    return out;
  }
  // primitivos
  return node;
}

// =============== Runner ===============
async function translateFile(filePath, outDir, model, options) {
  const base = path.basename(filePath);
  const arName = base.replace(/\.json$/i, '.ar.json');
  const outPath = path.join(outDir, arName);

  if (!options.overwrite && fs.existsSync(outPath)) {
    console.log(`⏭️  Ya existe: ${outPath} (usa --overwrite para reemplazar)`);
    return { file: base, out: outPath, skipped: true };
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  if (options.dry) {
    console.log(`(dry) Procesaría ${base} → ${outPath}`);
    return { file: base, out: outPath, skipped: true, dry: true };
  }

  const processed = await processNode(data, model, options);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(processed, null, 2), 'utf8');
  return { file: base, out: outPath, skipped: false };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Falta OPENAI_API_KEY');
    process.exit(1);
  }
  const { inDir, outDir, files, model, concurrency, overwrite, translateNames, rtlAlt, dry } = args;
  console.log(`📚 Directorio entrada: ${inDir}`);
  console.log(`📦 Directorio salida : ${outDir}`);
  console.log(`🧠 Modelo            : ${model}`);
  console.log(`⚙️  Concurrency       : ${concurrency}`);

  const options = { overwrite, translateNames, rtlAlt, dry };

  // Cola simple de concurrencia
  const queue = files.map(f => path.resolve(inDir, f));
  let active = 0, idx = 0, results = [];
  await new Promise((resolve) => {
    const tick = () => {
      while (active < concurrency && idx < queue.length) {
        const fp = queue[idx++];
        active++;
        translateFile(fp, path.resolve(outDir), model, options)
          .then(r => results.push(r))
          .catch(err => {
            console.error(`❌ Error en ${fp}:`, err?.message || err);
          })
          .finally(() => { active--; tick(); });
      }
      if (active === 0 && idx >= queue.length) resolve();
    };
    tick();
  });

  console.log('\nResumen:');
  for (const r of results) {
    console.log(`- ${r.skipped ? '↷' : '✔'} ${r.file} → ${r.out}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
