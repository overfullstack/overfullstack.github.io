import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `New update available ! Reload to get the new version 😃`
  )

  if (answer === true) {
    window.location.reload()
  }
}
