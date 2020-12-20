import { useState, useEffect, useCallback } from 'react'
import { RecordRTCPromisesHandler } from 'recordrtc'
import ReactPlayer from 'react-player/file'
import RecordButton from './RecordButton'
import StopButton from './StopButton'
import DeleteButton from './DeleteButton'
import SendButton from './SendButton'
import useStopWatch from './useStopWatch'

const RECORD_SECONDS = 5

const App = () => {
  const { running, time, start, stop, clear } = useStopWatch()
  const [stream, setStream] = useState(null)
  const [recorder, setRecorder] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)

  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
        echoCancellation: true
      });
      const recorder = new RecordRTCPromisesHandler(stream, {
        type: 'video'
      });
      setStream(stream)
      setRecorder(recorder)
    }
    getMedia()
  }, [])

  const stopRecordingAndSetMedia = useCallback(async () => {
    stop()
    clear()
    await recorder.stopRecording()
    const blob = await recorder.getBlob()
    const url = URL.createObjectURL(new Blob([blob], {type: 'video/webm'}))
    setMediaUrl(url)
  }, [stop, clear, recorder])

  useEffect(() => {
    if (time > RECORD_SECONDS) {
      stopRecordingAndSetMedia()
    }
  }, [time, stopRecordingAndSetMedia])

  const startRecording = () => {
    recorder.startRecording()
    start()
  }

  const clearMedia = () => {
    URL.revokeObjectURL(mediaUrl)
    setMediaUrl(null)
  }

  if (mediaUrl) {
    return (
      <>
        <div style={{position: 'relative', height: '100vh', maxWidth: '100vw'}}>
          <ReactPlayer
            key="playback"
            playing
            controls
            url={mediaUrl}
            height="100%"
            width="100%"
          />
          <div style={{position: 'absolute', top: 8, left: 8 }}>
            <DeleteButton onClick={clearMedia} />
          </div>
          <div style={{position: 'absolute', top: 8, right: 8 }}>
            <SendButton onClick={() => {}} />
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div style={{position: 'relative', height: '100vh', maxWidth: '100vw'}}>
          <ReactPlayer
            style={{transform: 'scaleX(-1)'}}
            key="live"
            playing
            url={stream}
            height="100%"
            width="100%"
            muted
            volume={0}
          />
          <div style={{position: 'absolute', bottom: 8, width: '100%', textAlign: 'center'}}>
            {running ?
              <StopButton onClick={stopRecordingAndSetMedia} progress={(100 / RECORD_SECONDS) * time} /> :
              <RecordButton onClick={startRecording} />
            }
          </div>
        </div>
      </>
    )
  }
}

export default App