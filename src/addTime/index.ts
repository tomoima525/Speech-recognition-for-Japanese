import { protos } from '@google-cloud/speech';

const elapsedTime = (wordInfo: protos.google.cloud.speech.v1p1beta1.IWordInfo): string => {
  const elapsedTime = (wordInfo.endTime?.seconds as number) || 0;
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;
  const results: string[] = [];
  results.push(`${hours}`);
  results.push(minutes >= 10 ? `${minutes}` : `0${minutes}`);
  results.push(seconds >= 10 ? `${seconds}` : `0${seconds}`);
  return results.join(':');
};

export default elapsedTime;
