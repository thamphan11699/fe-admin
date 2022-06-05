import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { changeStatus, save, update } from './OrderService'

const OrderDialog = ({ item, open, handleClose }) => {
  const [order, setOrder] = useState({
    id: null,
    code: '',
    user: {},
    status: 0,
    orderProducts: [],
    description: [],
    income: 0,
  })

  useEffect(() => {
    setOrder(item)
  }, [item])

  const handleChange = (event) => {
    setOrder({ ...order, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (order.id) {
        update(order, order.id)
          .then(({ data }) => {
            toast.success(`Cập nhật đơn hàng thành công`)
            setOrder({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Cập nhật thất bại')
          })
      } else {
        save(order)
          .then(({ data }) => {
            toast.success(`Thêm mới đơn hàng thành công`)
            setOrder({})
            handleClose()
          })
          .catch((err) => {
            console.log(err)
            toast.error('Thêm mới thất bại')
          })
      }
    } catch (error) {
      console.log(error)
      toast.error('Lưu thất bại')
      return
    }
  }

  const handleChangeStatus = (e) => {
    setOrder({ ...order, status: parseInt(e.target.value) })
    changeStatus({ ...order, status: parseInt(e.target.value) }, order.id).then(({ data }) => {
      console.log(data)
      toast.success('Đổi trạng thái đơn hàng thành công')
    })
  }

  const columns = [
    {
      title: 'Mã sản phẩm',
      field: 'product?.code',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.product?.code}</span>,
    },
    {
      title: 'Tên sản phẩm',
      field: 'product?.name',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.product?.name}</span>,
    },
    {
      title: 'Màu sắc',
      field: 'product?.color?.name',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.product?.color?.name}</span>,
    },
    {
      title: 'Size',
      field: 'product?.size',
      width: '40%',
      align: 'center',
      render: (row) => <span>{row.product?.size}</span>,
    },
    {
      title: 'Giá',
      field: 'product?.price',
      width: '40%',
      align: 'center',
      render: (row) => <span>{row.product?.price}</span>,
    },
    {
      title: 'Số lượng',
      field: 'status',
      width: '40%',
      align: 'center',
      render: (row) => <span>{row?.amount}</span>,
    },
    {
      title: 'Thàng tiền',
      field: 'custom',
      width: '40%',
      align: 'center',
      render: (row) => <span>{parseInt(row?.amount) * parseInt(row.product?.price)}</span>,
    },
  ]

  const formatVND = (value) => {
    return value ? value.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : '0 VNĐ'
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title" style={{ background: '#757ce8', color: 'white' }}>
          {order.id ? 'Cập nhật đơn hàng' : 'Thêm mới đơn hàng'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Mã đơn hàng"
                disabled={true}
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={order.code ? order.code : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Người đặt hàng"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                disabled={true}
                value={order?.user?.userInfo?.fullName ? order.user.userInfo.fullName : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Email"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                disabled={true}
                value={order?.user?.email ? order.user.email : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Số điện thoại"
                disabled={true}
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={order?.user?.userInfo?.phoneNumber ? order.user.userInfo.phoneNumber : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="Địa chỉ giao hàng"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={order?.user?.userInfo?.address ? order.user.userInfo.address : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12} container spacing={3}>
              <Grid item md={3} xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                <FormLabel component="legend" style={{ marginBottom: 0 }}>
                  Trạng thái đơn hàng
                </FormLabel>
              </Grid>
              <Grid item md={9} xs={6}>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue={order?.status ? order?.status.toString() : '0'}
                  value={order?.status ? order?.status.toString() : '0'}
                  onChange={(e) => handleChangeStatus(e)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label="Created"
                    labelPlacement="end"
                    style={{ marginRight: 30 }}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label="Accepted"
                    labelPlacement="end"
                    style={{ marginRight: 30 }}
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio color="primary" />}
                    label="Shipping"
                    labelPlacement="end"
                    style={{ marginRight: 30 }}
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio color="primary" />}
                    label="Receivered"
                    labelPlacement="end"
                    style={{ marginRight: 30 }}
                  />
                  <FormControlLabel
                    value="6"
                    control={<Radio color="primary" />}
                    label="Cancle"
                    labelPlacement="end"
                    style={{ marginRight: 30 }}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="desc"
                label="Ghi chú"
                multiline
                type="text"
                minRows={1}
                maxRows={5}
                fullWidth
                name="description"
                variant="outlined"
                value={order?.description ? order?.description : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <MaterialTable
                title="Danh sách sản phẩm"
                columns={columns}
                data={order?.orderProducts ? order.orderProducts : []}
                options={{
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false,
                  rowStyle: (rowData) => ({
                    backgroundColor: rowData.tableData.id % 2 === 1 ? '#EEE' : '#FFF',
                  }),
                  maxBodyHeight: '450px',
                  minBodyHeight: '380px',
                  headerStyle: {
                    backgroundColor: '#358600',
                    color: '#fff',
                  },
                  padding: 'dense',
                }}
                localization={{
                  toolbar: {
                    nRowsSelected: 'selected',
                  },
                  body: {
                    emptyDataSourceMessage: 'No records to display',
                  },
                }}
                components={{
                  Toolbar: (props) => <MTableToolbar {...props} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ marginRight: 12 }}>
          <Grid style={{ position: 'absolute', left: '20px' }}>
            <h4>Tổng thu: {' ' + formatVND(order?.income)}</h4>
          </Grid>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

OrderDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default OrderDialog
