# IF Branch Plugin

## Work in Progress

This plugin is currently under development and may undergo significant changes. For more details, see the proposal issue [here](https://github.com/Green-Software-Foundation/hack/issues/129).

## Plugin Overview

Leveraging the IF framework's extensibility, the IF Branch Plugin introduces conditional input duplication. It scans the manifest's `global-config` for the `branch-on` directive, which dictates the creation of input variants based on specified fields and their new values.

For instance, to branch on the `region` field, the manifest's `global-config` would be:

```
plugins:
  if-branch-plugin:
    path: if-branch-plugin
    method: Branch
    global-config:
      branch-on:
        region:
          - uk-north
```

Upon execution, the plugin will process each input, checking for the presence of branch-on fields. When a match is found, it duplicates the input, substituting the original value with each listed in branch-on, thus expanding the input set for diverse scenario testing.

Example manifests can be found in `/manifests` and tested with `run.sh` (described below).

## Testing with run.sh

To test sample manifests using `run.sh`, follow these steps:

1. Ensure you have `npm`, `jq`, and `yq` installed on your system.
2. Place your manifest file in an accessible directory.
3. Run the script with the path to your manifest file as an argument:

```bash
./run.sh path/to/manifest.yml
```

Output will be saved to `/outputs/<manifest-name>.yml`
