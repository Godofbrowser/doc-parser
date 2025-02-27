# OOXML DOC PARSER

This project demonstrates the parsing of uploaded XML files on the client side. As an MVP, the focus is on extracting and formatting headings, lists, paragraphs, basic styling, and indentations.

## Technologies Used

- **Vue 3** for the core application logic
- **Tailwind CSS** for styling
- **Shadow DOM** to isolate the document’s content area

## Parsing Approach

XML documents contain various attributes and properties that must be processed to achieve an accurate representation. However, achieving a pixel-perfect match takes time and dedication. For this MVP, the goal is not perfect visual fidelity but rather extracting and displaying readable information.

## How to Use

1. **Upload an XML file**

   - Drag and drop the file into the designated drop zone.
   - Alternatively, click the upload area to select a file.

2. **View the Parsed Output**
   - The document is parsed immediately.
   - The extracted content is rendered on the screen for easy readability.

This MVP serves as a foundation for future improvements, aiming to enhance XML parsing capabilities while maintaining usability and performance.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
