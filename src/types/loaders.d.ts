// tools/build configures esbuild loaders for these extensions.

declare module '*.png' {
  const uri: string
  export default uri
}

declare module '*.svg' {
  const uri: string
  export default uri
}

declare module '*.text' {
  const text: string
  export default text
}

declare module '*.webp' {
  const uri: string
  export default uri
}
