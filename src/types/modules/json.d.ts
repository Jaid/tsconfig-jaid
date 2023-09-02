type Content = {
  typeAcquisition: import("typescript").TypeAcquisition
  compilerOptions: import("typescript").CompilerOptions
  include: string[]
}

declare module '*.json' {
  const content: Content
  export = content
}