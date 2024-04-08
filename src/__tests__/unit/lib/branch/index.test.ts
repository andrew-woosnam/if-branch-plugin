import {Branch} from '../../../../lib/branch';
import {ERRORS} from '../../../../util/errors';

const {InputValidationError} = ERRORS;

describe('lib/branch: ', () => {
  describe('Branch(): ', () => {
    const branch = Branch();
    describe('init : ', () => {
      it('successfully initialized.', () => {
        expect(branch).toHaveProperty('metadata');
        expect(branch).toHaveProperty('execute');
        expect(branch.metadata).toHaveProperty('kind');
        expect(typeof branch.execute).toBe('function');
      });
    });

    describe('execute(): ', () => {
      /** Currently does not test for grouping */
      it('successfully applies branch to given input.', async () => {
        const expectedResult = {
          'uk-north': {
            inputs: [
              {
                'cpu-util': 34,
                duration: '15s',
                region: 'uk-north',
                timestamp: '2021-01-01T00:00:00Z',
              },
            ],
          },
          'uk-south': {
            inputs: [
              {
                'cpu-util': 34,
                duration: '15s',
                region: 'uk-south',
                timestamp: '2021-01-01T00:00:00Z',
              },
            ],
          },
        };
        const result = await branch.execute(
          [
            {
              timestamp: '2021-01-01T00:00:00Z',
              duration: '15s',
              'cpu-util': 34,
              region: 'uk-south',
            },
          ],
          {
            region: ['uk-north'],
          }
        );

        expect(result).toStrictEqual(expectedResult);
      });

      it('throws an error on improperly formed config.', async () => {
        const expectedMessage = 'Branch: Failed validation';

        expect.assertions(1);

        try {
          await branch.execute(
            [
              {
                timestamp: '2021-01-01T00:00:00Z',
                duration: '15s',
                'cpu-util': 34,
                region: 'uk-south',
              },
            ],
            {
              branch: 'region',
            }
          );
        } catch (error) {
          expect(error).toStrictEqual(
            new InputValidationError(expectedMessage)
          );
        }
      });
    });
  });
});
