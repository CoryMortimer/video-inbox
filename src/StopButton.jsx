import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const StopButton = ({ onClick, progress=50 }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton aria-label="stop" onClick={onClick}>
          <StopIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default StopButton
