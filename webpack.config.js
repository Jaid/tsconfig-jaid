import configure from 'webpack-config-jaid'

export default configure({
  include: [
    `src/base.json`,
    `src/react.json`,
  ],
})
