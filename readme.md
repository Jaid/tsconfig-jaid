# tsconfig-jaid


<a href="https://raw.githubusercontent.com/jaid/tsconfig-jaid/master/license.txt"><img src="https://img.shields.io/github/license/jaid/tsconfig-jaid?style=flat-square" alt="License"/></a> <a href="https://github.com/sponsors/jaid"><img src="https://img.shields.io/badge/<3-Sponsor-FF45F1?style=flat-square" alt="Sponsor tsconfig-jaid"/></a>  
<a href="https://actions-badge.atrox.dev/jaid/tsconfig-jaid/goto"><img src="https://img.shields.io/endpoint.svg?style=flat-square&url=https%3A%2F%2Factions-badge.atrox.dev%2Fjaid%2Ftsconfig-jaid%2Fbadge" alt="Build status"/></a> <a href="https://github.com/jaid/tsconfig-jaid/commits"><img src="https://img.shields.io/github/commits-since/jaid/tsconfig-jaid/v2.2.0?style=flat-square&logo=github" alt="Commits since v2.2.0"/></a> <a href="https://github.com/jaid/tsconfig-jaid/commits"><img src="https://img.shields.io/github/last-commit/jaid/tsconfig-jaid?style=flat-square&logo=github" alt="Last commit"/></a> <a href="https://github.com/jaid/tsconfig-jaid/issues"><img src="https://img.shields.io/github/issues/jaid/tsconfig-jaid?style=flat-square&logo=github" alt="Issues"/></a>  
<a href="https://npmjs.com/package/tsconfig-jaid"><img src="https://img.shields.io/npm/v/tsconfig-jaid?style=flat-square&logo=npm&label=latest%20version" alt="Latest version on npm"/></a> <a href="https://github.com/jaid/tsconfig-jaid/network/dependents"><img src="https://img.shields.io/librariesio/dependents/npm/tsconfig-jaid?style=flat-square&logo=npm" alt="Dependents"/></a> <a href="https://npmjs.com/package/tsconfig-jaid"><img src="https://img.shields.io/npm/dm/tsconfig-jaid?style=flat-square&logo=npm" alt="Downloads"/></a>

**Extendable TypeScript config for my Node projects.**


#### Pure ESM library

:information_source: This package has only ESM exports. You should `import` it from MJS files or [read more here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).




## Installation

<a href="https://npmjs.com/package/tsconfig-jaid"><img src="https://img.shields.io/badge/npm-tsconfig--jaid-C23039?style=flat-square&logo=npm" alt="tsconfig-jaid on npm"/></a>

```bash
npm install --save-dev tsconfig-jaid@^2.2.0
```

<a href="https://yarnpkg.com/package/tsconfig-jaid"><img src="https://img.shields.io/badge/Yarn-tsconfig--jaid-2F8CB7?style=flat-square&logo=yarn&logoColor=white" alt="tsconfig-jaid on Yarn"/></a>

```bash
yarn add --dev tsconfig-jaid@^2.2.0
```






## Usage

After installation, you can include the shared properties of `tsconfig-jaid` in your own TypeScript config file.

### Node

`YOURPROJECT/tsconfig.json`
```json
{
  "extends": "tsconfig-jaid/base"
}
```

### React

`YOURPROJECT/tsconfig.json`
```json
{
  "extends": "tsconfig-jaid/react"
}
```















## Development

<details>
<summary><b>Development hints for maintaining and improving tsconfig-jaid</b></summary>



Setting up:
```bash
git clone git@github.com:jaid/tsconfig-jaid.git
cd tsconfig-jaid
npm install
```
Testing:
```bash
npm run test:dev
```
Testing in production environment:
```bash
npm run test
```

</details>

## License
[MIT License](https://raw.githubusercontent.com/jaid/tsconfig-jaid/master/license.txt)  
Copyright © 2021, Jaid \<jaid.jsx@gmail.com> (https://github.com/jaid)

<!---
Readme generated with tldw v7.3.1
https://github.com/Jaid/tldw
-->