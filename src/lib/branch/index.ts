import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

export const Branch = (globalConfig: YourGlobalConfig): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Clones `inputs` with specified `branch-on` fields, returning originals plus
   * altered copies with updated values substitued from `global-config` specification.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    const branchOn = globalConfig['branch-on'];
    const hasBranchOn = typeof branchOn === 'object' && branchOn !== null;

    if (hasBranchOn) {
      console.log('branch-on structure is valid');
    }

    // New logic to duplicate inputs and replace values
    const newInputs = [...inputs]; // Start with a copy of the original inputs
    inputs.forEach(input => {
      for (const key in branchOn) {
        if (key in input) {
          // Duplicate the input for each value in the "branchOn" array
          branchOn[key].forEach((value: string) => {
            const newInput = {...input, [key]: value};
            newInputs.push(newInput); // Add the new input to the newInputs array
          });
        }
      }
    });

    return newInputs; // Return the new array with the duplicates included
  };

  return {
    metadata,
    execute,
  };
};
