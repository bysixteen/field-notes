# Scaffold New Component

> Create the file structure and boilerplate for a new design-system component.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Component name | String | PascalCase name (e.g., `AlertBanner`) |
| Dimensions | List | Which dimensions apply: sentiment, emphasis, state, size |
| Props | List | Component-specific props beyond the dimensional model |

## Expected Outputs

- Component source file with props interface and base markup.
- CSS module with dimensional custom properties stubbed.
- Storybook story file with controls for each dimension.
- Unit test file with a render smoke test.
- Figma variable collections for each applicable dimension (documented, not auto-created).

## Prerequisites

- The project's component directory structure exists.
- The dimensional token model is in place (see [token chain](/design-system/token-chain)).
- Familiarity with the [component API conventions](/design-system/component-api).

## Execution Steps

1. Choose the component name and determine which dimensions apply.
2. Create the component source file with a props interface. Include `sentiment`, `emphasis`, `size`, and `state` props for each applicable dimension.
3. Create the CSS module. Define custom properties for each dimension following the naming convention: `--{component}/{dimension}/{property}`.
4. Create the Storybook story with controls mapped to each dimensional prop.
5. Create a test file with at minimum a render smoke test.
6. Document the expected Figma variable collections for the component:
   - One collection per dimension (e.g., `Sentiment.AlertBanner`, `Size.AlertBanner`).
   - Modes matching the dimension vocabulary (e.g., `neutral`, `warning` for sentiment).
7. Add the component to the project's component index.

## Verification

- All files created and linted without errors.
- Storybook story renders with functional dimension controls.
- Test passes.
- Component follows the [naming conventions](/design-system/naming).
