import speech, { protos } from '@google-cloud/speech';
import addPunctuation from './addPunctuation';

const client = new speech.SpeechClient();
const config = {
  audioChannelCount: 2,
  enableWordTimeOffsets: true,
  enableAutomaticPunctuation: true,
  // Speaker diarization
  enableSpeakerDiarization: true,
  diarizationSpeakerCount: 3,
  encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.FLAC,
  sampleRateHertz: 44100,
  languageCode: 'ja-JP'
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
        console.log(`Done! startTime: ${meta.startTime?.seconds} endTime: ${meta.lastUpdateTime?.seconds}\n`);
      } else {
        await wait(10000);
      }
    }

    console.log('\nResult:');
    const [response] = await operation.promise();
    response.results?.forEach((result) => {
      const alternatives = result?.alternatives || [];
      if (alternatives.length <= 0) {
        console.log('No transcribe\n');
        return;
      }
      const wordsInfo = alternatives[0].words || [];
      if (wordsInfo.length <= 0) {
        console.log(`(unknown): ${alternatives[0].transcript}\n`);
        return;
      }
      const speakerTag = wordsInfo[0]?.speakerTag || '-';
      console.log(`(${speakerTag}): ${alternatives[0].transcript}\n`);
      const words = alternatives[0].words?.map((wordsInfo) => wordsInfo?.word || '').filter((w) => w !== '');
      console.log(`(punctuated):${addPunctuation(words)}`);
      // TODO: log every 60 second
      // alternatives[0].words?.forEach((wordInfo) => {
      //   const startSecs = `${wordInfo?.startTime?.seconds}` + '.' + wordInfo?.startTime?.nanos || 0 / 100000000;
      //   const endSecs = `${wordInfo?.endTime?.seconds}` + '.' + wordInfo?.endTime?.nanos || 0 / 100000000;
      //   console.log(`Word: ${wordInfo.word}`);
      //   console.log(`\t ${startSecs} secs - ${endSecs} secs`);
      // });
    });
  } catch (e) {
    console.log({ error: e });
  }
}

transcribeAudio();
