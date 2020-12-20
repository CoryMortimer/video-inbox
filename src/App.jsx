import { useState, useEffect, useCallback } from 'react'
import { RecordRTCPromisesHandler } from 'recordrtc'
import ReactPlayer from 'react-player/file'
import 'firebase/storage'
import RecordButton from './RecordButton'
import StopButton from './StopButton'
import DeleteButton from './DeleteButton'
import SendButton from './SendButton'
import useStopWatch from './useStopWatch'
import { useStorage } from 'reactfire';
import CircularProgress from '@material-ui/core/CircularProgress';

const RECORD_SECONDS = parseInt(process.env.REACT_APP_RECORD_SECONDS, 10) || 30

const App = () => {
  const storage = useStorage()
  const { running, time, start, stop, clear } = useStopWatch()
  const [stream, setStream] = useState(null)
  const [recorder, setRecorder] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  const upload = async () => {
    setIsUploading(true)
    const today = new Date()
    const ref = storage.ref(`${today.getTime()}.webm`)
    const blob = await recorder.getBlob()
    const uploadTask = ref.put(blob, { contentType: 'video/webm' })
    uploadTask.on('stateChanged', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setUploadProgress(progress)
    }, (error) => {
      console.log('error', error)
      setUploadProgress(0)
      setIsUploading(false)
    }, () => {
      console.log('success')
      setUploadProgress(0)
      setIsUploading(false)
    })
  }

  if (mediaUrl) {
    return (
      <>
        <div style={{position: 'relative', height: '100vh', maxWidth: '100vw'}}>
          <ReactPlayer
            key="playback"
            playing
            loop
            url={mediaUrl}
            height="100%"
            width="100%"
          />
          <div style={{position: 'absolute', top: 8, left: 8 }}>
            <DeleteButton onClick={clearMedia} />
          </div>
          <div style={{position: 'absolute', top: 8, right: 8 }}>
            <SendButton onClick={upload} />
          </div>
          {isUploading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, .6)',
              }}
            >
              <div style={{position: 'absolute', top: '50%', left: '50%', transform:' translate(-50%, -50%)'}}>
                <CircularProgress
                  size="5rem"
                  variant={uploadProgress ? 'determinate' : undefined}
                  value={uploadProgress ? uploadProgress : undefined}
                />
              </div>
            </div>
          )}
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
