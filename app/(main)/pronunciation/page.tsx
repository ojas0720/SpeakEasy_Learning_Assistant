"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, BookOpen, MessageSquare, ShoppingCart, Plane, Briefcase, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Levenshtein distance for scoring similarity
function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Scenario types
type Scenario = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  paragraphs: { [key: string]: string };
  transliterations: { [key: string]: string };
};

const SCENARIOS: Scenario[] = [
  {
    id: "introduction",
    title: "Self Introduction",
    description: "Introduce yourself in a new language",
    icon: MessageSquare,
    color: "bg-blue-500",
    paragraphs: {
      "es-ES": "Hola, me llamo María. Tengo veinticinco años. Soy de España. Me gusta leer libros y viajar.",
      "fr-FR": "Bonjour, je m'appelle Marie. J'ai vingt-cinq ans. Je viens de France. J'aime lire des livres et voyager.",
      "de-DE": "Hallo, ich heiße Maria. Ich bin fünfundzwanzig Jahre alt. Ich komme aus Deutschland. Ich lese gerne Bücher und reise.",
      "hi-IN": "नमस्ते, मेरा नाम मारिया है। मैं पच्चीस साल की हूं। मैं स्पेन से हूं। मुझे किताबें पढ़ना और यात्रा करना पसंद है।",
      "kn-IN": "ನಮಸ್ಕಾರ, ನನ್ನ ಹೆಸರು ಮಾರಿಯಾ. ನನಗೆ ಇಪ್ಪತ್ತೈದು ವರ್ಷ. ನಾನು ಸ್ಪೇನ್‌ನಿಂದ ಬಂದಿದ್ದೇನೆ. ನನಗೆ ಪುಸ್ತಕಗಳನ್ನು ಓದಲು ಮತ್ತು ಪ್ರಯಾಣ ಮಾಡಲು ಇಷ್ಟ.",
      "ta-IN": "வணக்கம், என் பெயர் மரியா. எனக்கு இருபத்தைந்து வயது. நான் ஸ்பெயினிலிருந்து வந்தேன். எனக்கு புத்தகங்கள் படிக்கவும் பயணம் செய்யவும் பிடிக்கும்.",
    },
    transliterations: {
      "es-ES": "OH-lah, meh YAH-moh mah-REE-ah. TEN-goh vayn-tee-SEEN-koh AHN-yohs. Soy deh es-PAHN-yah. Meh GOOS-tah leh-AIR LEE-brohs ee vee-ah-HAR.",
      "fr-FR": "bon-ZHOOR, zhuh mah-PELL mah-REE. zhay van-SANK ahn. zhuh vee-AN duh frahnss. zhem leer day leevr ay vwah-yah-ZHAY.",
      "de-DE": "HAH-loh, ikh HY-seh mah-REE-ah. ikh bin FEWNF-oont-TSVAN-tsikh YAH-reh alt. ikh KOH-meh ows DOYTSH-lahnt. ikh LEH-zeh GEHR-neh BEW-kher oont RY-zeh.",
      "hi-IN": "na-mas-tay, may-rah naam maa-ree-aa hay. main pach-chees saal kee hoon. main spain say hoon. mu-jhay ki-taa-bayn parh-naa aur ya-traa kar-naa pa-sand hay.",
      "kn-IN": "na-mas-kaa-ra, nan-na he-sa-ru maa-ri-yaa. na-na-ge ip-pat-tai-du var-sha. naa-nu spain-nin-da ban-did-day-ne. na-na-ge pus-ta-ka-ga-lan-nu o-da-lu mat-tu pra-yaa-na maa-da-lu ish-ta.",
      "ta-IN": "va-nak-kam, en pe-yar ma-ri-yaa. e-nak-ku i-ru-pat-tain-thu va-ya-thu. naan spain-i-lir-un-thu van-then. e-nak-ku put-tha-kan-gal pa-dik-ka-vum pa-ya-nam sei-ya-vum pi-dik-kum.",
    },
  },
  {
    id: "shopping",
    title: "At the Store",
    description: "Practice shopping conversations",
    icon: ShoppingCart,
    color: "bg-green-500",
    paragraphs: {
      "es-ES": "Buenos días. Quiero comprar pan y leche. ¿Cuánto cuesta? Aquí tiene el dinero. Muchas gracias.",
      "fr-FR": "Bonjour. Je voudrais acheter du pain et du lait. Combien ça coûte? Voici l'argent. Merci beaucoup.",
      "de-DE": "Guten Tag. Ich möchte Brot und Milch kaufen. Wie viel kostet das? Hier ist das Geld. Vielen Dank.",
      "hi-IN": "नमस्ते। मुझे रोटी और दूध खरीदना है। इसकी कीमत क्या है? यह लीजिए पैसे। बहुत धन्यवाद।",
      "kn-IN": "ನಮಸ್ಕಾರ. ನನಗೆ ಬ್ರೆಡ್ ಮತ್ತು ಹಾಲು ಖರೀದಿಸಬೇಕು. ಇದರ ಬೆಲೆ ಎಷ್ಟು? ಇಲ್ಲಿ ಹಣ ತೆಗೆದುಕೊಳ್ಳಿ. ತುಂಬಾ ಧನ್ಯವಾದಗಳು.",
      "ta-IN": "வணக்கம். எனக்கு ரொட்டி மற்றும் பால் வாங்க வேண்டும். இதன் விலை என்ன? இதோ பணம். மிக்க நன்றி.",
    },
    transliterations: {
      "es-ES": "BWAY-nohs DEE-ahs. kee-AIR-oh kohm-PRAR pahn ee LEH-cheh. KWAN-toh KWAYS-tah? ah-KEE tee-EH-neh el dee-NEH-roh. MOO-chahs GRAH-see-ahs.",
      "fr-FR": "bon-ZHOOR. zhuh voo-DRAY ah-shuh-TAY dew pan ay dew lay. kohm-bee-AN sah koot? vwah-SEE lar-ZHAHN. mehr-SEE boh-KOO.",
      "de-DE": "GOO-ten tahk. ikh MERKH-teh broht oont milkh KOW-fen. vee feel KOS-tet dahs? heer ist dahs gelt. FEE-len dahnk.",
      "hi-IN": "na-mas-tay. mu-jhay ro-tee aur doodh kha-reed-naa hay. is-kee kee-mat kyaa hay? yeh lee-ji-ye pai-say. ba-hut dhan-ya-vaad.",
      "kn-IN": "na-mas-kaa-ra. na-na-ge bread mat-tu haa-lu kha-ree-di-sa-bay-ku. i-da-ra be-le esh-tu? il-li ha-na te-ge-du-kol-li. tum-baa dhan-ya-vaa-da-ga-lu.",
      "ta-IN": "va-nak-kam. e-nak-ku rot-ti mat-rum paal vaang-ka vay-ndum. i-than vi-lai en-na? i-tho pa-nam. mik-ka nan-dri.",
    },
  },
  {
    id: "travel",
    title: "Travel & Directions",
    description: "Ask for directions while traveling",
    icon: Plane,
    color: "bg-purple-500",
    paragraphs: {
      "es-ES": "Disculpe, ¿dónde está la estación de tren? ¿Está lejos de aquí? Necesito un taxi. Gracias por su ayuda.",
      "fr-FR": "Excusez-moi, où est la gare? Est-ce loin d'ici? J'ai besoin d'un taxi. Merci pour votre aide.",
      "de-DE": "Entschuldigung, wo ist der Bahnhof? Ist es weit von hier? Ich brauche ein Taxi. Danke für Ihre Hilfe.",
      "hi-IN": "माफ कीजिए, रेलवे स्टेशन कहाँ है? क्या यह यहाँ से दूर है? मुझे टैक्सी चाहिए। आपकी मदद के लिए धन्यवाद।",
      "kn-IN": "ಕ್ಷಮಿಸಿ, ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? ಇದು ಇಲ್ಲಿಂದ ದೂರವಿದೆಯೇ? ನನಗೆ ಟ್ಯಾಕ್ಸಿ ಬೇಕು. ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ಧನ್ಯವಾದಗಳು.",
      "ta-IN": "மன்னிக்கவும், ரயில் நிலையம் எங்கே? இது இங்கிருந்து தூரமா? எனக்கு டாக்ஸி வேண்டும். உங்கள் உதவிக்கு நன்றி.",
    },
    transliterations: {
      "es-ES": "dees-KOOL-peh, DOHN-deh es-TAH lah es-tah-see-OHN deh tren? es-TAH LEH-hohs deh ah-KEE? neh-seh-SEE-toh oon TAHK-see. GRAH-see-ahs pohr soo ah-YOO-dah.",
      "fr-FR": "eks-kew-ZAY-mwah, oo ay lah gar? es lwan dee-SEE? zhay buh-ZWAN duhn tahk-SEE. mehr-SEE poor votr ayd.",
      "de-DE": "ent-SHOOL-dee-goong, voh ist dehr BAHN-hohf? ist es vyt fon heer? ikh BROW-kheh yn TAHK-see. DAHN-keh fewr EE-reh HIL-feh.",
      "hi-IN": "maaf kee-ji-ye, railway station ka-haan hay? kyaa yeh ya-haan say door hay? mu-jhay taxi chaa-hi-ye. aap-kee ma-dad kay li-ye dhan-ya-vaad.",
      "kn-IN": "ksha-mi-si, rai-lu nil-daa-na el-li-de? i-du il-lin-da doo-ra-vi-de-ye? na-na-ge taxi bay-ku. nim-ma sa-haa-yak-ke dhan-ya-vaa-da-ga-lu.",
      "ta-IN": "man-nik-ka-vum, ra-yil ni-lai-yam eng-kay? i-thu ing-kir-un-thu thoo-ra-maa? e-nak-ku taxi vay-ndum. ung-kal u-tha-vik-ku nan-dri.",
    },
  },
  {
    id: "restaurant",
    title: "At a Restaurant",
    description: "Order food and drinks",
    icon: BookOpen,
    color: "bg-orange-500",
    paragraphs: {
      "es-ES": "Buenas tardes. Una mesa para dos, por favor. Quiero una ensalada y agua. La cuenta, por favor.",
      "fr-FR": "Bonsoir. Une table pour deux, s'il vous plaît. Je voudrais une salade et de l'eau. L'addition, s'il vous plaît.",
      "de-DE": "Guten Abend. Einen Tisch für zwei, bitte. Ich möchte einen Salat und Wasser. Die Rechnung, bitte.",
      "hi-IN": "शुभ संध्या। दो लोगों के लिए एक मेज, कृपया। मुझे सलाद और पानी चाहिए। बिल, कृपया।",
      "kn-IN": "ಶುಭ ಸಂಜೆ. ದಯವಿಟ್ಟು ಇಬ್ಬರಿಗೆ ಒಂದು ಟೇಬಲ್. ನನಗೆ ಸಲಾಡ್ ಮತ್ತು ನೀರು ಬೇಕು. ದಯವಿಟ್ಟು ಬಿಲ್.",
      "ta-IN": "மாலை வணக்கம். இரண்டு பேருக்கு ஒரு மேசை, தயவுசெய்து. எனக்கு சாலட் மற்றும் தண்ணீர் வேண்டும். பில், தயவுசெய்து.",
    },
    transliterations: {
      "es-ES": "BWAY-nahs TAR-dehs. OO-nah MEH-sah PAH-rah dohs, pohr fah-VOHR. kee-AIR-oh OO-nah en-sah-LAH-dah ee AH-gwah. lah KWEN-tah, pohr fah-VOHR.",
      "fr-FR": "bon-SWAHR. ewn tahbl poor duh, seel voo play. zhuh voo-DRAY ewn sah-LAHD ay duh loh. lah-dee-see-OHN, seel voo play.",
      "de-DE": "GOO-ten AH-bent. Y-nen tish fewr tsvY, BIT-teh. ikh MERKH-teh Y-nen zah-LAHT oont VAH-ser. dee REKH-noong, BIT-teh.",
      "hi-IN": "shubh sand-hyaa. do lo-gon kay li-ye ek mez, kri-pa-yaa. mu-jhay sa-laad aur paa-nee chaa-hi-ye. bill, kri-pa-yaa.",
      "kn-IN": "shu-bha san-je. da-ya-vit-tu ib-ba-ri-ge on-du table. na-na-ge salad mat-tu nee-ru bay-ku. da-ya-vit-tu bill.",
      "ta-IN": "maa-lai va-nak-kam. i-ran-du pay-ruk-ku o-ru may-sai, tha-ya-vu-sei-thu. e-nak-ku salad mat-rum than-neer vay-ndum. bill, tha-ya-vu-sei-thu.",
    },
  },
  {
    id: "business",
    title: "Business Meeting",
    description: "Professional conversation practice",
    icon: Briefcase,
    color: "bg-indigo-500",
    paragraphs: {
      "es-ES": "Buenos días. Es un placer conocerle. Trabajo en tecnología. ¿Podemos programar una reunión? Hasta luego.",
      "fr-FR": "Bonjour. C'est un plaisir de vous rencontrer. Je travaille dans la technologie. Pouvons-nous planifier une réunion? À bientôt.",
      "de-DE": "Guten Tag. Es ist mir eine Freude, Sie kennenzulernen. Ich arbeite in der Technologie. Können wir ein Treffen vereinbaren? Auf Wiedersehen.",
      "hi-IN": "सुप्रभात। आपसे मिलकर खुशी हुई। मैं प्रौद्योगिकी में काम करता हूं। क्या हम एक बैठक निर्धारित कर सकते हैं? फिर मिलेंगे।",
      "kn-IN": "ಶುಭೋದಯ. ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಲು ಸಂತೋಷವಾಗಿದೆ. ನಾನು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತೇನೆ. ನಾವು ಸಭೆಯನ್ನು ನಿಗದಿಪಡಿಸಬಹುದೇ? ಮತ್ತೆ ಭೇಟಿಯಾಗೋಣ.",
      "ta-IN": "காலை வணக்கம். உங்களைச் சந்திப்பதில் மகிழ்ச்சி. நான் தொழில்நுட்பத்தில் வேலை செய்கிறேன். நாம் ஒரு கூட்டத்தை திட்டமிடலாமா? மீண்டும் சந்திப்போம்.",
    },
    transliterations: {
      "es-ES": "BWAY-nohs DEE-ahs. es oon plah-SEHR koh-noh-SEHR-leh. trah-BAH-hoh en tek-noh-loh-HEE-ah. poh-DEH-mohs proh-grah-MAR OO-nah reh-oo-nee-OHN? AHS-tah LWAY-goh.",
      "fr-FR": "bon-ZHOOR. say tuhn play-ZEER duh voo rahn-kohn-TRAY. zhuh trah-VY dahn lah tek-noh-loh-ZHEE. poo-vohn-noo plah-nee-fee-AY ewn ray-ew-nee-OHN? ah bee-AN-toh.",
      "de-DE": "GOO-ten tahk. es ist meer Y-neh FROY-deh, zee KEN-nen-tsoo-LEHR-nen. ikh AR-by-teh in dehr tek-noh-loh-GEE. KER-nen veer yn TREF-fen fehr-YN-bah-ren? owf VEE-der-zayn.",
      "hi-IN": "su-pra-bhaat. aap-say mil-kar khu-shee hu-ee. main praud-yo-gi-kee mayn kaam kar-taa hoon. kyaa hum ek bai-thak nir-dhaa-rit kar sak-tay hain? phir mi-len-gay.",
      "kn-IN": "shu-bho-da-ya. nim-man-nu bhay-ti-yaa-ga-lu san-to-sha-vaa-gi-de. naa-nu tan-tra-jnyaa-na-dal-li ke-la-sa maa-dut-tay-ne. naa-vu sa-bhe-yan-nu ni-ga-di-pa-di-sa-ba-hu-day? mat-te bhay-ti-yaa-go-na.",
      "ta-IN": "kaa-lai va-nak-kam. ung-ka-laich chan-thip-pa-thil ma-gizh-chi. naan tho-zhil-nut-pat-thil vay-lai sei-gi-rayn. naam o-ru koot-tat-thai thit-ta-mi-da-laa-maa? meen-dum chan-thip-pom.",
    },
  },
];

const LANGUAGE_OPTIONS = [
  { label: "Spanish", code: "es-ES" },
  { label: "French", code: "fr-FR" },
  { label: "German", code: "de-DE" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Kannada", code: "kn-IN" },
  { label: "Tamil", code: "ta-IN" },
];

export default function PronunciationPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0].code);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordProgress, setWordProgress] = useState<number[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const recognitionRef = useRef<any | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const targetParagraph = selectedScenario?.paragraphs[language] || "";
  const transliteration = selectedScenario?.transliterations[language] || "";
  const words = targetParagraph.split(/\s+/).filter(Boolean);

  const buildRecognizer = useCallback(() => {
    const AnyWindow: any = typeof window !== "undefined" ? (window as any) : {};
    const Rec = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    if (!Rec) return null;
    const rec = new Rec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = language;

    rec.onstart = () => {
      setListening(true);
      setError(null);
    };

    rec.onresult = (event: any) => {
      let combined = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        combined += res[0]?.transcript ?? "";
      }
      if (combined) {
        setTranscript(combined);
        updateWordProgress(combined);
      }
    };

    rec.onerror = (e: any) => {
      setListening(false);
      setError(e?.error || "Recognition error");
    };

    rec.onend = () => {
      setListening(false);
    };

    return rec;
  }, [language]);

  const updateWordProgress = (spokenText: string) => {
    const spokenWords = normalize(spokenText).split(/\s+/).filter(Boolean);
    const targetWords = words.map(w => normalize(w));
    const newProgress = [...wordProgress];

    // Match spoken words to target words
    let spokenIndex = 0;
    for (let i = 0; i < targetWords.length && spokenIndex < spokenWords.length; i++) {
      if (newProgress[i] === undefined || newProgress[i] < 100) {
        const targetWord = targetWords[i];
        const spokenWord = spokenWords[spokenIndex];

        if (targetWord && spokenWord) {
          const dist = levenshtein(targetWord, spokenWord);
          const maxLen = Math.max(targetWord.length, spokenWord.length) || 1;
          const similarity = Math.max(0, Math.round(100 * (1 - dist / maxLen)));

          if (similarity >= 60) { // 60% threshold for word match
            newProgress[i] = similarity;
            setCurrentWordIndex(i + 1);
            spokenIndex++;
          }
        }
      }
    }

    setWordProgress(newProgress);

    // Calculate overall progress
    const completedWords = newProgress.filter(p => p >= 60).length;
    const progress = Math.round((completedWords / words.length) * 100);
    setOverallProgress(progress);
  };

  useEffect(() => {
    const AnyWindow: any = typeof window !== "undefined" ? (window as any) : {};
    const Rec = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;
    setSupported(!!Rec);
    recognitionRef.current = buildRecognizer();
  }, [buildRecognizer]);

  const start = async () => {
    if (!supported || !selectedScenario) return;
    setError(null);
    setTranscript("");

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e: any) {
      setError("Microphone permission denied");
      return;
    }

    try {
      recognitionRef.current = buildRecognizer();
      recognitionRef.current!.lang = language;
      recognitionRef.current!.start();
    } catch (e: any) {
      setError("Failed to start recognition");
      setListening(false);
    }
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch { }
    try {
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    } catch { }
    setListening(false);
  };

  const reset = () => {
    setTranscript("");
    setWordProgress([]);
    setCurrentWordIndex(0);
    setOverallProgress(0);
    setError(null);
  };

  const selectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    reset();
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-neutral-900">
              Pronunciation Practice
            </h1>
            <p className="text-lg text-neutral-600">
              Choose a scenario to practice speaking in your target language
            </p>
          </div>

          {!supported && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-amber-800">
              Your browser does not support the Web Speech API. Use Chrome, Edge, or Safari.
            </div>
          )}

          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-neutral-700">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-neutral-800 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => selectScenario(scenario)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className={`mb-4 inline-flex rounded-xl ${scenario.color} p-3 text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {scenario.description}
                  </p>
                  <div className="mt-4 text-xs font-medium text-blue-600 group-hover:text-blue-700">
                    Start Practice →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const Icon = selectedScenario.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Scenarios
          </button>
          <Button
            onClick={reset}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Scenario Header */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className={`rounded-xl ${selectedScenario.color} p-3 text-white shadow-lg`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-bold text-neutral-900">
                {selectedScenario.title}
              </h2>
              <p className="text-neutral-600">{selectedScenario.description}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        )}

        {/* Overall Progress */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="mt-2 text-sm text-neutral-600">
            {currentWordIndex} of {words.length} words recognized
          </p>
        </div>

        {/* Paragraph Display with Word Progress */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Read This Paragraph</h3>
          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-lg leading-relaxed">
            {words.map((word, index) => {
              const progress = wordProgress[index] || 0;
              const isCompleted = progress >= 60;
              const isCurrent = index === currentWordIndex;

              return (
                <span
                  key={index}
                  className={`inline-block transition-all duration-300 ${isCompleted
                    ? "text-green-600 font-semibold"
                    : isCurrent
                      ? "text-blue-600 font-semibold underline decoration-2 underline-offset-4"
                      : "text-neutral-700"
                    }`}
                  style={{
                    backgroundColor: isCompleted
                      ? "rgba(34, 197, 94, 0.1)"
                      : isCurrent
                        ? "rgba(59, 130, 246, 0.1)"
                        : "transparent",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    marginRight: "6px",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Transliteration/Pronunciation Guide */}
          {transliteration && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-900">📖 Pronunciation Guide (English)</span>
              </div>
              <p className="text-sm italic text-blue-800 leading-relaxed">
                {transliteration}
              </p>
              <p className="mt-2 text-xs text-blue-600">
                Capital letters indicate stressed syllables
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-center gap-4">
          {!listening ? (
            <Button
              onClick={start}
              disabled={!supported}
              size="lg"
              className="gap-2 bg-green-600 px-8 py-6 text-lg font-semibold hover:bg-green-700"
            >
              <Mic className="h-6 w-6" />
              Start Speaking
            </Button>
          ) : (
            <Button
              onClick={stop}
              size="lg"
              variant="destructive"
              className="gap-2 px-8 py-6 text-lg font-semibold"
            >
              <MicOff className="h-6 w-6" />
              Stop
            </Button>
          )}
        </div>

        {listening && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-600"></div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-neutral-900">What You Said</h3>
            <div className="rounded-lg bg-blue-50 p-4 text-neutral-800">
              {transcript || "—"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
