let intervalId: ReturnType<typeof setInterval> | null = null

self.onmessage = (e) => {
  if (e.data === 'start') {
    if (intervalId !== null) return
    intervalId = setInterval(() => {
      self.postMessage({ type: 'tick' })
    }, 1000)
  }

  if (e.data === 'stop') {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}
