import {z} from 'zod';

import {ERRORS} from '../../util/errors';

import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

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
    inputs.forEach(input => {
      for (const key in validConfig) {
        if (key in input) {
          // Duplicate the input for each value in the "validConfig" array
          validConfig[key].forEach((value: string) => {
            const newInput = {...input, [key]: value};
            newInputs.push(newInput); // Add the new input to the newInputs array
          });
        }
      }
    });

    return newInputs; // Return the new array with the duplicates included
  };

  /**
   * Validates config parameter for branch plugin
   */
  const validateConfig = (config: Record<string, any[]>) => {
    if (!config) {
      throw new InputValidationError('Config is not provided.');
    }

    // { string: [...any]}
    /** Removed zod import because following error
     *  error  "zod" is extraneous  node/no-extraneous-import **/
    const schema = z.record(z.string(), z.any().array().nonempty());

    const validationResult = schema.safeParse(config);
    if (!validationResult.success) {
      throw new InputValidationError(
        'Failed validation' + validationResult.error
      );
    }

    return validationResult.data;
  };

  return {
    metadata,
    execute,
  };
};
