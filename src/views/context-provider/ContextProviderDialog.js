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
import { save, update } from './ContextProviderService'

const ContextProviderDialog = ({ item, open, handleClose }) => {
  const [contextProvider, setContextProvider] = useState({
    id: null,
    name: '',
    code: '',
    phoneNumber: '',
    representative: '',
    address: '',
    description: '',
  })

  useEffect(() => {
    setContextProvider(item)
  }, [item])

  const handleChange = (event) => {
    setContextProvider({ ...contextProvider, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (contextProvider.id) {
        update(contextProvider, contextProvider.id)
          .then(({ data }) => {
            toast.success(`Cập nhật thành công`)
            setContextProvider({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Cập nhật thất bại')
          })
      } else {
        save(contextProvider)
          .then(({ data }) => {
            toast.success(`Thêm mới thành công`)
            setContextProvider({})
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
        <DialogTitle id="form-dialog-title">
          {contextProvider.id ? 'Chỉnh sửa' : 'Thêm mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="name"
                label="Tên nhà cung cấp"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={contextProvider.name ? contextProvider.name : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Mã NCC"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={contextProvider.code ? contextProvider.code : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="phoneNumber"
                label="Số điện thoại"
                type="text"
                fullWidth
                name="phoneNumber"
                variant="outlined"
                value={contextProvider.phoneNumber ? contextProvider.phoneNumber : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="representative"
                label="Đầu mối"
                type="text"
                fullWidth
                name="representative"
                variant="outlined"
                value={contextProvider.representative ? contextProvider.representative : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="address"
                label="Địa chỉ"
                type="text"
                fullWidth
                name="address"
                variant="outlined"
                value={contextProvider.address ? contextProvider.address : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="description"
                label="Mô tả"
                type="text"
                fullWidth
                name="description"
                variant="outlined"
                value={contextProvider.description ? contextProvider.description : ''}
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

ContextProviderDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default ContextProviderDialog
