# IF Branch Plugin

### Problem Statement:

Currently, testing different assumptions (and plugins) in a manifest file involves executing separate versions, saving results, and manually comparing them. This process is manual, error-prone, and inefficient.

### Proposed Solution:

Our idea is to enable users to include multiple contrasting assumptions in one manifest file, generating a consolidated output for comparison. This would eliminate the need for repetitive testing and simplify the analysis of varying assumptions.
We intend to do this by creating a “branch” plugin that copies all of the values of the current manifest, but alters a specified assumption and then continues processing the new manifest with N copies of the manifest for each assumption change.
Our solution would play natively with the IF and only add some intelligence to do a specific set of copy and edit operations on the manifest. Nothing else would change from a user's pipeline.

### Example Scenario:

Imagine a user wanting to estimate grid carbon intensity for their data center's region. With this plugin, they could specify three estimation methods at once: a fixed value representing an average on the high-end estimate, a fixed value representing an average on the low-end estimate, and estimations from the WattTime plugin. Each method of estimation would produce its own result set, revealing the impact of that assumption on the final outcome.
For instance, if the high-end and low-end estimates differ by an order of magnitude or more yet yield very similar results for total emissions, one might be able to infer that this particular assumption isn’t the most critical parameter in the overall calculation. If – on the other hand – the high-end and low-end estimates only differ by a few grams of CO2 per kWh but lead to vastly different results for total emissions, one might be able to infer that the accuracy of the final result depends highly on the accuracy of this particular assumption, and therefore extra care should be taken to use the best estimate available for carbon intensity.

### Additional Benefits:

By allowing users to "branch" (i.e. compute multiple different scenarios at once) within a single manifest, our plugin would enhance the IF's versatility and efficiency. Users would be able to explore diverse assumptions and assess their impact on software environmental metrics without extensive manual effort.
This is not limited to numeric parameters, but could also be used to alter which plugins are used at a specific step to test different calculation methods at the same time.

## Work in Progress

This plugin is currently under development and may undergo significant changes. For more details, see the proposal issue [here](https://github.com/Green-Software-Foundation/hack/issues/129).

## Plugin Overview

Leveraging the IF framework's extensibility, the IF Branch Plugin introduces conditional input duplication. It scans the manifest's `component-config` for the `branch-on` directive, which dictates the creation of input variants based on specified fields and their new values.

For instance, to branch on the `region` field, the manifest's `component-config` would be:

```
plugins:
  branch-on:
    path: if-branch-plugin
    method: Branch
...
tree:
  children:
    child-1:
      pipeline:
        - branch-on
      config:
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
