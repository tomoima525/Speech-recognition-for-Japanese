import fs from 'fs';
import speech, { protos } from '@google-cloud/speech';
import addPunctuation from './addPunctuation';
import addTime from './addTime';

const client = new speech.v1p1beta1.SpeechClient();
const config = {
  audioChannelCount: 2,
  enableWordTimeOffsets: true,
  enableAutomaticPunctuation: true,
  // Speaker diarization
  enableSpeakerDiarization: true,
  diarizationSpeakerCount: 3,
  encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.FLAC,
  sampleRateHertz: 44100,
  languageCode: 'ja-JP',
  speechContexts: [
    {
      phrases: ['今井', 'ベイエリア', 'Today I Learned', 'ゆうやさん', 'CEO', 'テックリード', 'スタートアップ'],
      boost: 20
    },
    {
      phrases: ['今最も', 'いやいやさん', 'いう屋さん', '神様'],
      boost: 1
    }
  ]
};

const audio = {
  uri: 'gs://tomoima525-audio-data/test-data/today_i_learned_07_sample.flac'
};

const request = {
  config,
  audio
};

const wait = (milisec = 1000) => new Promise((resolve) => setTimeout(() => resolve(), milisec));

async function transcribeAudio() {
  if (fs.existsSync('result.txt')) {
    fs.unlinkSync('result.txt');
  }
  fs.openSync('result.txt', 'w');
  try {
    const [operation] = await client.longRunningRecognize(request);
    const name = operation?.name;
    if (!name) throw new Error('name is not defined');

    let running = true;

    while (running) {
      const decodedOperation = await client.checkLongRunningRecognizeProgress(name);
      // We know for sure metadata is LongRunningRecognizeMetadata
      const meta = (decodedOperation?.metadata as unknown) as protos.google.cloud.speech.v1.LongRunningRecognizeMetadata;
      const percent = meta?.progressPercent || 0;
      console.log(`progress ${percent}%`);
      running = !(decodedOperation.done || false);
      if (percent === 100) {
        const endTime: number = (meta.lastUpdateTime?.seconds as number) || 0;
        const startTime: number = (meta.startTime?.seconds as number) || 0;
        console.log(`Done! time: ${endTime - startTime}\n`);
      } else {
        await wait(10000);
      }
    }

    console.log('\nResult:');
    const [response] = await operation.promise();

    if (!response.results || response.results?.length === 0) {
      console.log('No result');
      return;
    }
    console.log('===', response.results.length);
    console.log('====1', {
      transcript: ((response.results[0]?.alternatives || [])[0] || { transcript: 'no t' })?.transcript
    });
    console.log('====2', {
      transcript: ((response.results[1]?.alternatives || [])[0] || { transcript: 'no t' })?.transcript
    });
    const result = response.results[response.results.length - 1];
    const alternatives = result?.alternatives || [];
    if (alternatives.length <= 0) {
      console.log('No transcribe\n');
      return;
    }

    // const rawdata = fs.readFileSync('test-data.json');
    // const wordsInfo = JSON.parse(rawdata.toString('utf8'));

    const wordsInfo = alternatives[0].words || [];
    const speakArr: protos.google.cloud.speech.v1p1beta1.IWordInfo[] = [];
    for (const wordInfo of wordsInfo) {
      if (speakArr.length === 0) {
        speakArr.push(wordInfo);
        continue;
      }
      if (wordInfo.speakerTag === speakArr[0].speakerTag) {
        speakArr.push(wordInfo);
        continue;
      }
      const words = speakArr.map((wordsInfo) => wordsInfo?.word || '').filter((w) => w !== '');
      console.log(`${addTime(speakArr[speakArr.length - 1])},(p-${speakArr[0].speakerTag}),${addPunctuation(words)}`);
      fs.appendFileSync(
        'result.txt',
        `${addTime(speakArr[speakArr.length - 1])}:(p-${speakArr[0].speakerTag}):${addPunctuation(words)}\n`
      );
      speakArr.splice(0, speakArr.length);
      speakArr.push(wordInfo);
    }
    if (speakArr.length > 0) {
      const words = speakArr.map((wordsInfo) => wordsInfo?.word || '').filter((w) => w !== '');
      console.log(`${addTime(speakArr[speakArr.length - 1])},(p-${speakArr[0].speakerTag}),${addPunctuation(words)}`);
    }

    console.log('Done!');
  } catch (e) {
    console.log({ error: e });
  }
}

transcribeAudio();
