import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

export const MyCustomPlugin = (
  globalConfig: YourGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.flatMap(input => {
      // your logic here
      globalConfig;

      // Duplicate the input object
      const inputCopy1 = {...input, 'custom-tag': 'A'};
      const inputCopy2 = {...input, 'custom-tag': 'B'};

      // Return an array containing both copies
      return [inputCopy1, inputCopy2];
    });
  };

  return {
    metadata,
    execute,
  };
};
