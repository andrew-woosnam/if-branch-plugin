import {MyCustomPlugin} from '../../../lib/my-custom-plugin';

describe('lib/my-custom-plugin: ', () => {
  describe('MyCustomPlugin(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = MyCustomPlugin({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });
  });
});
