import {PluginInterface, PluginParams} from '../types/interface';
import {validateConfig} from './grouping';

export const Branch = (): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Clones items in `inputs` which contain any fields listed in `component-config`.
   * Returns original inputs plus clones with substituted values according to `component-config`.
   */
  const execute = async (
    inputs: PluginParams[],
    config: Record<string, any[]>
  ): Promise<PluginParams[]> => {
    const spec = validateConfig(config);

    const newInputs = [...inputs];

    // For each field elected to branch on, iterate through additional
    // fields listed and add an extra input ("branch") for each.
    inputs.forEach(input => {
      for (const branchField in spec) {
        if (branchField in input) {
          spec[branchField].forEach((newField: string) => {
            const newInput = {...input, [branchField]: newField};
            newInputs.push(newInput);
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
