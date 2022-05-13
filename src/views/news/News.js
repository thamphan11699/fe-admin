import { Button, Grid, IconButton, TablePagination, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmDialog from 'src/components/ConfirmDialog'
import NewsDialog from './NewsDialog'
import { clear, getAll, getOne } from './NewsService'

const News = () => {
  const [searchObj, setSearchObj] = useState({ pageSize: 10, pageIndex: 1 })
  const [text, setText] = useState('')
  const [listItem, setListItem] = useState([])
  const [totals, setTotals] = useState(0)
  const [openDialog, setOpenDiaLog] = useState(false)
  const [item, setItem] = useState({})
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

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
    setSearchObj({ ...searchObj, pageSize: event.target.value, pageIndex: 1 })
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

  const handleOk = () => {
    setOpenConfirmDialog(false)
    clear(item.id)
      .then(({ data }) => {
        console.log(data)
        toast.success('Delete item successfully!')
        getListItem({ ...searchObj, pageSize: 10, pageIndex: 1 })
      })
      .catch((err) => {
        console.log(err)
        toast.error('Delete item fail!')
      })
    setItem({})
  }

  const handleCancle = () => {
    setOpenConfirmDialog(false)
    setItem({})
  }

  const handleDelete = (row) => {
    setItem(row)
    setOpenConfirmDialog(true)
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
      width: 150,
      align: 'center',
      render: (row) => (
        <div style={{}}>
          <IconButton aria-label="delete" onClick={() => handleDelete(row)}>
            <DeleteIcon color="secondary" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleEditItem(row)}>
            <EditIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
    { title: 'Tiêu đề', field: 'title', width: '100%' },
  ]

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={6} xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => setOpenDiaLog(true)}
              style={{ height: 41 }}
            >
              Thêm tin tức
            </Button>
          </Grid>
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
      <NewsDialog open={openDialog} handleClose={handleCloseDialog} item={item} />
      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirm delete"
        content="Are you sure delete item?"
        handleOk={handleOk}
        handleCancle={handleCancle}
      />
    </Grid>
  )
}

export default News
