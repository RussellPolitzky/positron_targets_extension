# Targets Helper

Targets Helper is a Positron extension designed to enhance productivity when working with the `targets` package in R. This extension provides commands to execute various `targets` functions directly from the editor, making it easier to manage and run your data pipelines. Additionally, it includes a document symbol provider to recognize specific comment patterns in R files and organize them into a hierarchical structure.

## Features

- Execute `targets::tar_read()` on selected target.
- Execute `targets::tar_load()` on selected target.
- Execute `targets::tar_make()` on selected target.
- Execute `targets::tar_make()` with debugging on selected target.
- Execute `targets::tar_make()` to build the whole pipeline.
- Execute `targets::tar_watch()` to monitor targets.
- Provides document symbols for R files, recognizing specific comment patterns and organizes them into a hierarchical structure.

- Document Symbol Provider

The document symbol provider recognizes specific comment patterns in R files and organizes them into a hierarchical structure. This helps in navigating and understanding the structure of your R targets pipelines.  This features is activated after any of the above commands are executed.

- **Comment Patterns**:
  - Level 1: `#tgt label -`
  - Level 2: `##tgt label -`
  - Level 3: `###tgt label -`

## Requirements

- Positron (will not run in VSC)
- R and the `targets` package installed

## Installation

1. Install it from a `.vsix` file.
2. Open Positron.
3. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X` (or `Cmd+Shift+X` on macOS).
4. Click on the ellipsis and choose "install from vsix"

## Usage

### Commands

- **Execute `targets::tar_read`**:
  - Command: `executeTargetsRead`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+R`
  - Context: Editor text focus

- **Execute `targets::tar_load`**:
  - Command: `executeTargetsLoad`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+L`
  - Context: Editor text focus

- **Execute `targets::tar_make` on selected target**:
  - Command: `executeTargetsMakeSelected`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+M`
  - Context: Editor text focus

- **Execute `targets::tar_make`**:
  - Command: `executeTargetsMake`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+K`
  - Context: Editor text focus

- **Execute `targets::tar_make` with debugging for selected target**:
  - Command: `executeTargetsDebugSelected`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+D`
  - Context: Editor text focus

- **Execute `targets::tar_watch`**:
  - Command: `executeTargetsWatch`
  - Keybinding: `Ctrl+Shift+T Ctrl+Shift+W`
  - Context: Editor text focus

### Example

1. Select the target in your R script that you want to use as input for the `targets` function.
2. Use the corresponding keybinding or command from the Command Palette to execute the desired `targets` function.

## Configuration

No additional configuration is required. The extension uses the default settings provided by Positron and the `targets` package in R.

## Known Issues

- The extension requires the `targets` package to be installed in your R environment.
- Ensure that the Positron API is available if you are using it for R code execution.

## Release Notes

### 0.0.1

Initial release of Targets Helper.

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Thanks to the developers of the `targets` package for creating a powerful tool for managing data pipelines in R.
- Thanks to the Positron community for their support and contributions.