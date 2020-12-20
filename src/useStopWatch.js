import { useMemo, useEffect, useCallback, useState, useRef } from 'react'

const useStopWatch = () => {
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (running) {
      timeoutRef.current = setTimeout(() => {
        setTime((time) => time + 1)
      }, 1000)
    }
  }, [running, time])

  const start = useCallback(() => {
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setRunning(false)
  }, [timeoutRef])

  const clear = useCallback(() => {
    setTime(0)
  }, [])

  return useMemo(() => ({ running, time, start, stop, clear }), [running, time, start, stop, clear])
}

export default useStopWatch
