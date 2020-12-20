import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteButton = ({ onClick }) => {
  return (
    <IconButton aria-label="delete" onClick={onClick} color="secondary">
      <DeleteIcon fontSize="large" />
    </IconButton>
  )
}

export default DeleteButton
