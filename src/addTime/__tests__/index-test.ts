import elapsedTime from '../index';

describe('elapasedTime', () => {
  it('should return stringified time', () => {
    const wordInfo1 = {
      endTime: {
        seconds: '83',
        nanos: 300000000
      }
    };
    expect(elapsedTime(wordInfo1)).toEqual('0:01:23');
    const wordInfo2 = {
      endTime: {
        seconds: '8281',
        nanos: 300000000
      }
    };
    expect(elapsedTime(wordInfo2)).toEqual('2:18:01');
  });
});
