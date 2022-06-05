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
import { save, update } from './WareHouseService'

const WareHouseDialog = ({ item, open, handleClose }) => {
  const [wareHouse, setWareHouse] = useState({
    id: null,
    name: '',
    code: '',
    maxSize: '',
    currentSize: '',
  })

  useEffect(() => {
    setWareHouse(item)
  }, [item])

  const handleChange = (event) => {
    setWareHouse({ ...wareHouse, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (wareHouse.id) {
        update(wareHouse, wareHouse.id)
          .then(({ data }) => {
            toast.success(`Cập nhật thành công`)
            setWareHouse({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Cập nhật thất bại')
          })
      } else {
        save(wareHouse)
          .then(({ data }) => {
            toast.success(`Thêm mới thành công`)
            setWareHouse({})
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
          {wareHouse.id ? 'Chỉnh sửa ' : 'Tạo mới '}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="name"
                label="Tên kho"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={wareHouse.name ? wareHouse.name : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Mã kho"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={wareHouse.code ? wareHouse.code : ''}
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

WareHouseDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default WareHouseDialog
