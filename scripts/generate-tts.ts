import fs from "fs-extra";
import path from "path";
import textToSpeech from "@google-cloud/text-to-speech";

// Generates pronunciation MP3s for all supported languages and target words
// Requires Google Cloud credentials:
// 1) Create a service account with Text-to-Speech permissions
// 2) Download JSON key and set env var:
//    set GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\key.json
// 3) Run: npx tsx ./scripts/generate-tts.ts

const client = new textToSpeech.TextToSpeechClient();

// Map course title to TTS language code
const TTS_LANG: Record<string, string> = {
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Hindi: "hi-IN",
  Kannada: "kn-IN",
  Tamil: "ta-IN",
};

// Phrases per language (same as seeding dictionary)
const TRANSLATIONS: Record<string, { [k: string]: string }> = {
  Spanish: {
    man: "el hombre",
    woman: "la mujer",
    boy: "el chico",
    girl: "la niña",
    zombie: "el zombie",
    robot: "el robot",
  },
  French: {
    man: "l'homme",
    woman: "la femme",
    boy: "le garçon",
    girl: "la fille",
    zombie: "le zombie",
    robot: "le robot",
  },
  German: {
    man: "der Mann",
    woman: "die Frau",
    boy: "der Junge",
    girl: "das Mädchen",
    zombie: "der Zombie",
    robot: "der Roboter",
  },
  Hindi: {
    man: "पुरुष",
    woman: "महिला",
    boy: "लड़का",
    girl: "लड़की",
    zombie: "ज़ॉम्बी",
    robot: "रोबोट",
  },
  Kannada: {
    man: "ಪುರುಷ",
    woman: "ಮಹಿಳೆ",
    boy: "ಹುಡುಗ",
    girl: "ಹುಡುಗಿ",
    zombie: "ಜಾಂಬಿ",
    robot: "ರೋಬೋಟ್",
  },
  Tamil: {
    man: "ஆண்",
    woman: "பெண்",
    boy: "சிறுவன்",
    girl: "சிறுமி",
    zombie: "சோம்பி",
    robot: "ரோபோ",
  },
};

const WORD_KEYS = ["man", "woman", "boy", "girl", "zombie", "robot"] as const;

async function synthesize(text: string, languageCode: string) {
  const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text },
    voice: { languageCode },
    audioConfig: { audioEncoding: "MP3" },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");
  await fs.ensureDir(publicDir);

  for (const lang of Object.keys(TRANSLATIONS)) {
    const langCode = TTS_LANG[lang];
    if (!langCode) {
      console.warn(`No TTS language code for ${lang}, skipping.`);
      continue;
    }

    for (const key of WORD_KEYS) {
      const phrase = TRANSLATIONS[lang][key];
      if (!phrase) continue;

      const prefix = langCode.split("-")[0]; // es, fr, de, hi, kn, ta
      const outFile = path.join(publicDir, `${prefix}_${key}.mp3`);

      // Skip if file already exists
      if (await fs.pathExists(outFile)) {
        console.log(`Exists: ${path.basename(outFile)}`);
        continue;
      }

      try {
        const audio = await synthesize(phrase, langCode);
        if (!audio) throw new Error("Empty audio content");
        await fs.writeFile(outFile, audio, { encoding: "binary" });
        console.log(`Generated: ${path.basename(outFile)} (${phrase})`);
      } catch (err) {
        console.error(`Failed: ${path.basename(outFile)} ->`, err);
      }
    }
  }

  console.log("Done generating TTS files.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
