import Trie from '../index';

describe('trie', () => {
  const trie = new Trie();
  trie.insert(['です']);
  trie.insert(['です', 'ね']);
  trie.insert(['です', 'よ', 'ね']);
  trie.insert(['ます', 'ね']);

  describe('contains', () => {
    it('should return true when contains', () => {
      expect(trie.contains(['です'])).toBeTruthy();
      expect(trie.contains(['です', 'よ', 'ね'])).toBeTruthy();

      expect(trie.contains(['ます'])).toBeTruthy();
      expect(trie.contains(['ます', 'ね'])).toBeTruthy();
    });

    it('should return false when not contained', () => {
      expect(trie.contains(['お'])).toBeFalsy();
    });
  });

  describe('findIndexesFrom', () => {
    it('should return index when words match', () => {
      const texts1 = ['ほんと', 'です', 'よ', 'ね', 'わかり', 'ます'];
      const result1 = [3, 5];
      expect(trie.findIndexesFrom(texts1)).toEqual(result1);

      const texts2 = ['です', 'ね', 'わかり', 'ます', 'はい'];
      const result2 = [1, 3];
      expect(trie.findIndexesFrom(texts2)).toEqual(result2);
    });

    it('should return no index when words do not match', () => {
      const texts = ['ねこ', 'だ', 'わかり', 'ませ', 'ん'];
      const result: number[] = [];
      expect(trie.findIndexesFrom(texts)).toEqual(result);
    });
  });
});
