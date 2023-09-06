type Content = {
  compilerOptions: import("typescript").CompilerOptions
  include: string[]
  typeAcquisition: import("typescript").TypeAcquisition
}

declare module '*.json' {
  const content: Content
  export = content
}
