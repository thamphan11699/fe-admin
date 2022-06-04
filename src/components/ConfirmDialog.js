import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
const ConfirmDialog = ({ title, content, handleOk, handleCancle, open }) => {
  return (
    <div style={{ minWidth: 400 }}>
      <Dialog
        open={open}
        onClose={handleCancle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title" style={{ fontSize: 24, fontWeight: 500 }}>
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancle} color="secondary" variant="contained">
            Cancle
          </Button>
          <Button onClick={handleOk} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}
export default ConfirmDialog
