import get from "lodash/get"

export const getCurrentPath = (location) => {
  const pathName = get(location, `pathname`, `/`).split(`/`)
  if (pathName.length >= 2) {
    if (pathName[1] === ``) {
      return `/`
    }
    return pathName[1]
  }
  return ``
}

export const formatReadingTime = (minutes) => {
  const cups = Math.round(minutes / 5)
  return `${new Array(cups || 1).fill(`☕️`).join(``)} ${minutes} min read`
}
