import {Branch} from '.';
import {PluginInterface} from '../types/interface';

async function runPlugin() {
  const newModel: PluginInterface = Branch();
  const usage = await newModel.execute(
    [
      {
        timestamp: '2021-01-01T00:00:00Z',
        duration: '15s',
        'cpu-util': 34,
        region: 'uk-south',
      },
      {
        timestamp: '2021-01-01T00:00:15Z',
        duration: '15s',
        'cpu-util': 12,
        region: 'uk-south',
      },
    ],
    {
      branch: {
        region: ['uk-north', 'uk-south'],
      },
    }
  );

  console.log(usage);
}

runPlugin();
