import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { save, update } from './ColorService'

const ColorDialog = ({ item, open, handleClose }) => {
  const [color, setColor] = useState({
    id: null,
    name: '',
    code: '',
  })

  useEffect(() => {
    setColor(item)
  }, [item])

  const handleChange = (event) => {
    setColor({ ...color, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (color.id) {
        update(color, color.id)
          .then(({ data }) => {
            toast.success(`Cập nhật thành công`)
            setColor({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Cập nhật thất bại')
          })
      } else {
        save(color)
          .then(({ data }) => {
            toast.success(`Thêm mới thành công`)
            setColor({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Thêm mới thất bại')
          })
      }
    } catch (error) {
      console.log(error)
      toast.error('Có lỗi sảy ra trong khi lưu. Hãy thử lại sau')
      return
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="form-dialog-title" style={{ background: '#757ce8', color: 'white' }}>
          {color.id ? 'Chỉnh sửa' : 'Thêm mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="name"
                label="Tên màu"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={color.name ? color.name : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Mã màu"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={color.code ? color.code : ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ marginRight: 12 }}>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ColorDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default ColorDialog
