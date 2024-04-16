import {z} from 'zod';

import {ERRORS} from '../../util/errors';

import {PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

/**
 * Validates config parameter for branch plugin
 */
export const validateConfig = (config: Record<string, any[]>) => {
  // { string: [...any]}
  const schema = z.record(z.string(), z.any().array().nonempty());

  const validationResult = schema.safeParse(config);
  if (!validationResult.success) {
    console.error(validationResult.error);
    throw new InputValidationError('Branch: Failed validation');
  }

  return validationResult.data;
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
