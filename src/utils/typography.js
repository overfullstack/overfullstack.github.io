import Typography from 'typography'
import lincoln from 'typography-theme-lincoln'

const typography = new Typography(lincoln)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
