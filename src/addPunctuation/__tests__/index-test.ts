import addPunctuation from '../index';

describe('addPunctuation', () => {
  it('should return punctuated string', () => {
    const texts1 = ['ほんと', 'です', 'よ', 'ね', 'わかり', 'ます'];
    const result1 = 'ほんとですよね。わかります。';
    expect(addPunctuation(texts1)).toEqual(result1);

    const texts2 = ['でしょう', 'ね', 'はい'];
    const result2 = 'でしょうね。はい。';
    expect(addPunctuation(texts2)).toEqual(result2);
  });
  it('should return empty string when input is undefined', () => {
    expect(addPunctuation()).toEqual('');
  });
});
