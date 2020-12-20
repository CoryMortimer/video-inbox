import IconButton from '@material-ui/core/IconButton';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const RecordButton = ({ onClick }) => {
  return (
    <IconButton aria-label="record" onClick={onClick} color="secondary">
      <FiberManualRecordIcon fontSize="large" />
    </IconButton>
  )
}

export default RecordButton
