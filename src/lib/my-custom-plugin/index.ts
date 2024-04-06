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
    // Check if 'branch-on' exists and is an object
    const branchOn = globalConfig['branch-on'];
    const hasBranchOn = typeof branchOn === 'object' && branchOn !== null;

    if (hasBranchOn) {
      // Iterate over the keys of 'branch-on' object
      for (const paramName in branchOn) {
        if (Object.prototype.hasOwnProperty.call(branchOn, paramName)) {
          // Check if each property is an array of strings
          const isArray = Array.isArray(branchOn[paramName]);
          const isArrayOfStrings =
            isArray &&
            branchOn[paramName].every((item: any) => typeof item === 'string');

          if (!isArrayOfStrings) {
            console.error(
              `The property '${paramName}' is not an array of strings.`
            );
            return [];
          }
        }
      }
      console.log('branch-on structure is valid');
    } else {
      console.error(
        "'branch-on' is not an object or is not defined in globalConfig."
      );
      return [];
    }

    return inputs.flatMap(input => {
      // your logic here

      // Return the modified input
      return [input];
    });
  };

  return {
    metadata,
    execute,
  };
};
