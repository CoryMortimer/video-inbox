import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

const SendButton = ({ onClick }) => {
  return (
    <IconButton aria-label="send" onClick={onClick} color="primary">
      <SendIcon fontSize="large" />
    </IconButton>
  )
}

export default SendButton
