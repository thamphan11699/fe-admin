import { Chip, Grid, IconButton, TablePagination, TextField } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import OrderDialog from './OrderDialog'
import { getAll, getOne } from './OrderService'

const Order = () => {
  const [searchObj, setSearchObj] = useState({ pageSize: 10, pageIndex: 0 })
  const [text, setText] = useState('')
  const [listItem, setListItem] = useState([])
  const [totals, setTotals] = useState(0)
  const [openDialog, setOpenDiaLog] = useState(false)
  const [item, setItem] = useState({})

  useEffect(() => {
    return getListItem(searchObj)
  }, [searchObj])

  const getListItem = (obj) => {
    getAll(obj).then(({ data }) => {
      setListItem(data.content)
      setTotals(data.totalElements)
    })
  }

  const handleChangePage = (event, newPage) => {
    console.log(newPage)
    setSearchObj({ ...searchObj, pageIndex: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setSearchObj({ ...searchObj, pageSize: event.target.value })
  }

  const handleCloseDialog = () => {
    setOpenDiaLog(false)
    getListItem(searchObj)
    setItem({})
  }

  const handleEditItem = (row) => {
    getOne(row.id)
      .then(({ data }) => {
        setItem(data)
      })
      .catch((err) => {
        console.log(err)
        setItem(row)
      })

    setOpenDiaLog(true)
  }

  const handleChangeText = (event) => {
    setText(event.target.value)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setSearchObj({ ...searchObj, text: text })
    }
  }

  const columns = [
    {
      title: 'Action',
      field: 'custom',
      width: '10%',
      align: 'center',
      render: (row) => (
        <div style={{}}>
          <IconButton aria-label="delete" onClick={() => handleEditItem(row)}>
            <EditIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
    { title: 'Mã đơn hàng', field: 'code', width: '100%', align: 'left' },
    {
      title: 'Người đặt hàng',
      field: 'user?.userInfo?.fullName',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.user?.userInfo?.fullName}</span>,
    },
    {
      title: 'Số điện thoại',
      field: 'user?.userInfo?.phoneNumber',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.user?.userInfo?.phoneNumber}</span>,
    },
    {
      title: 'Địa chỉ giao hàng',
      field: 'user?.userInfo?.adress',
      width: '40%',
      align: 'left',
      render: (row) => <span>{row.user?.userInfo?.address}</span>,
    },
    {
      title: 'Trạng thái đơn hàng',
      field: 'status',
      width: '40%',
      align: 'center',
      render: (row) => (
        <Chip
          label={
            row?.status === 1
              ? 'CREATED'
              : row?.status === 2
              ? 'ACCEPTED'
              : row?.status === 3
              ? 'PENDING'
              : row?.status === 4
              ? 'SHIPPING'
              : row?.status === 5
              ? 'RECEIVED'
              : row?.status === 6
              ? 'CANCLE'
              : ''
          }
          color={
            row?.status === 1
              ? 'primary'
              : row?.status === 2
              ? 'primary'
              : row?.status === 3
              ? 'secondary'
              : row?.status === 4
              ? 'primary'
              : row?.status === 5
              ? 'primary'
              : row?.status === 6
              ? 'secondary'
              : ''
          }
        ></Chip>
      ),
    },
  ]

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={6} xs={12}></Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <TextField
              type="text"
              id="text"
              placeholder="Tìm kiếm ..."
              fullWidth
              name="text"
              variant="outlined"
              onKeyPress={handleSearch}
              size="small"
              value={text}
              onChange={(event) => handleChangeText(event)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MaterialTable
          title="Danh sách"
          columns={columns}
          data={listItem}
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
          parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        />
        <TablePagination
          rowsPerPageOptions={[1, 10, 25]}
          component="div"
          count={totals}
          page={searchObj.pageIndex}
          onPageChange={handleChangePage}
          rowsPerPage={searchObj.pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
      <OrderDialog open={openDialog} handleClose={handleCloseDialog} item={item} />
    </Grid>
  )
}

export default Order
