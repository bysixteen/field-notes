# Generate Figma Documentation

> Create structured documentation pages inside a Figma file for a given component using PRISM MCP tools.

## Required Inputs

| Input | Type | Description |
|-------|------|-------------|
| Component name | String | The component to document |
| Figma file | Connection | An open Figma file with the PRISM MCP plugin active |
| `.mcp.json` | Config file | Must contain `figma.fileId` |

## Expected Outputs

- A documentation page in Figma using the `.documentation/*` component set:
  - **Header** with component title, description, status badge, and Storybook link.
  - **Prop table** listing all component props with type, default, and description.
  - **Anatomy diagram** with annotated regions.
  - **Do and Don't** examples for key usage patterns.
  - **Dividers** between sections.

## Prerequisites

- The `.documentation/*` components exist in the Figma file (Header, Table, Table/Row, Anatomy, DoAndDont, Divider).
- PRISM MCP server is connected and the target file is open.
- The component's prop interface and dimensional model are defined.

## Execution Steps

1. Navigate to (or create) a documentation page named after the component.
2. Instantiate a `.documentation/Header` component. Set the title to the component name, add a description, and configure the status badge and Storybook link.
3. Add a `.documentation/Divider` below the header.
4. Instantiate a `.documentation/Table` component. Add one `.documentation/Table/Row` per prop, filling in Prop, Type, Default, and Description.
5. Add a `.documentation/Divider`.
6. Instantiate a `.documentation/Anatomy` component. Place the component preview in the image slot and list annotated regions.
7. Add a `.documentation/Divider`.
8. Instantiate a `.documentation/DoAndDont` component. Populate the Do frame with a correct usage example and the Don't frame with an incorrect one.
9. Take a screenshot and verify layout, spacing, and alignment.

## Verification

- Documentation page exists in Figma with all sections present.
- Header shows correct component name and metadata.
- Prop table matches the component's actual props interface.
- Anatomy annotations correspond to real component regions.
- Do/Don't examples are accurate and visually balanced.
- All layers have semantic names (no "Frame 47").
