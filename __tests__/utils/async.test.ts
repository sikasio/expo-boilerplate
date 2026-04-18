import { AsyncUtils } from '../../src/utils/helpers';

describe('AsyncUtils.delay', () => {
  it('resolves after ~ms', async () => {
    const start = Date.now();
    await AsyncUtils.delay(30);
    expect(Date.now() - start).toBeGreaterThanOrEqual(25);
  });
});

describe('AsyncUtils.retry', () => {
  it('returns on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await AsyncUtils.retry(fn, 3);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries until success', async () => {
    let calls = 0;
    const fn = jest.fn().mockImplementation(async () => {
      calls++;
      if (calls < 3) throw new Error('not yet');
      return 'finally';
    });
    const result = await AsyncUtils.retry(fn, 5, 1);
    expect(result).toBe('finally');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws after maxAttempts', async () => {
    const err = new Error('always fails');
    const fn = jest.fn().mockRejectedValue(err);
    await expect(AsyncUtils.retry(fn, 2, 1)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
