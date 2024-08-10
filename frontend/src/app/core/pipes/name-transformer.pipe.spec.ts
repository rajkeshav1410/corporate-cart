import { NameTransformerPipe } from './name-transformer.pipe';

describe('NameTransformerPipe', () => {
  it('create an instance', () => {
    const pipe = new NameTransformerPipe();
    expect(pipe).toBeTruthy();
  });
});
