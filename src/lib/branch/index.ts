import {z} from 'zod';

import {ERRORS} from '../../util/errors';

import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const Branch = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Creates structure to insert inputs by groups.
   */
  const appendGroup = (
    input: PluginParams,
    object: any,
    branches: string[]
  ): any => {
    if (branches.length > 0) {
      const branch = branches.shift() as string;

      object.children = object.children ?? {};
      object.children[branch] = object.children[branch] ?? {};

      if (branches.length === 0) {
        if (
          object.children[branch].inputs &&
          object.children[branch].inputs.length > 0
        ) {
          object.children[branch].inputs.push(input);
        } else {
          object.children[branch].inputs = [input];
        }
      }

      appendGroup(input, object.children[branch], branches);
    }

    return object;
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

  // @ts-ignore
  const groupInputs = (
    newInputs: PluginParams[],
    validConfig: Record<string, [any, ...any[]]>
  ) =>
    newInputs.reduce((acc, input) => {
      const branches: Array<string> = new Array<string>();
      for (const key in validConfig) {
        if (!input[key]) {
          throw new InputValidationError(key);
        }
        branches.push(input[key]);
      }
      acc = {
        ...acc,
        ...appendGroup(input, acc, branches),
      };

      return acc;
    }, {}).children;

  /**
   * Validates config parameter for branch plugin
   */
  const validateConfig = (config: Record<string, any[]>) => {
    // { string: [...any]}
    const schema = z.record(z.string(), z.any().array().nonempty());

    const validationResult = schema.safeParse(config);
    if (!validationResult.success) {
      console.error(validationResult.error);
      throw new InputValidationError('Branch: Failed validation');
    }

    return validationResult.data;
  };

  return {
    metadata,
    execute,
  };
};
