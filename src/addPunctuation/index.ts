import Trie from '../trie';

const punctuationRules = [
  ['です'],
  ['です', 'ね'],
  ['です', 'よ', 'ね'],
  ['です', 'か'],
  ['でしょう', 'ね'],
  ['ます'],
  ['ます', 'ね'],
  ['はい']
];

const addPunctuation = (words?: string[]): string => {
  const trie = new Trie();
  punctuationRules.forEach((rule) => trie.insert(rule));
  if (!words || words.length === 0) return '';
  const seperatedWords = words.map((word) => word.split('|')[0]);
  const indices = trie.findIndexesFrom(seperatedWords);
  const punctuatedWords = [...seperatedWords];
  indices.forEach((index) => {
    const w = punctuatedWords[index];
    punctuatedWords[index] = `${w}。`;
  });
  return punctuatedWords.join('');
};

export default addPunctuation;
