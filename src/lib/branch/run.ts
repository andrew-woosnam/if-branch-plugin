import {Branch} from '.';
import {PluginInterface} from '../types/interface';
import {YourGlobalConfig} from './types';

async function runPlugin() {
  const cfg: YourGlobalConfig = {};

  const newModel: PluginInterface = Branch(cfg);
  const usage = await newModel.execute([
    {
      timestamp: '2021-01-01T00:00:00Z',
      duration: '15s',
      'cpu-util': 34,
    },
    {
      timestamp: '2021-01-01T00:00:15Z',
      duration: '15s',
      'cpu-util': 12,
    },
  ]);

  console.log(usage);
}

runPlugin();
