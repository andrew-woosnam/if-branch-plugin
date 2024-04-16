import {PluginInterface, PluginParams} from '../types/interface';
import {validateConfig} from './grouping';

export const Branch = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Clones `inputs` with specified `branch-on` fields, returning originals plus
   * altered copies with updated values substitued from `component-config` specification.
   */
  const execute = async (
    inputs: PluginParams[],
    config: Record<string, any[]>
  ): Promise<PluginParams[]> => {
    const validConfig = validateConfig(config);

    // New logic to duplicate inputs and replace values
    const newInputs = [...inputs]; // Start with a copy of the original inputs
    // const branches = Array<string>();
    inputs.forEach(input => {
      for (const key in validConfig) {
        if (key in input) {
          // Duplicate the input for each value in the "validConfig" array
          validConfig[key].forEach((value: string) => {
            const newInput = {...input, [key]: value};
            newInputs.push(newInput); // Add the new input to the newInputs array

            /**
             * Extract the branches that exist in the input since we don't
             * branch if it does not already exist.
             */
            // if (!branches.includes(value)) { branches.push(value); }
            // if (!branches.includes(input[key])) { branches.push(input[key]) };
          });
        }
      }
    });

    return newInputs;
  };

  return {
    metadata,
    execute,
  };
};
