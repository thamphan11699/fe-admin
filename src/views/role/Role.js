import { cilDelete, cilExternalLink, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DeleteConfirm } from 'src/components'
import RoleDialog from './RoleDialog'
import RoleHeader from './RoleHeader'
import { clear, getAll, getOne } from './RoleService'

const Role = () => {
  const [searchObj, setSearchObj] = useState({ pageSize: 5, pageIndex: 1 })
  const [listItem, setListItem] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [item, setItem] = useState({})
  const [totals, setTotals] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isDelete, setIsDelete] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => {
    getAll(searchObj).then(({ data }) => {
      setListItem(data.content)
      setTotals(data.totalElements)
      setTotalPages(data.totalPages)
    })
  }, [searchObj])

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setIsDelete(false)
    getRole()
    setItem({})
  }

  const getRole = () => {
    getAll(searchObj).then(({ data }) => {
      setListItem(data.content)
      setTotals(data.totalElements)
      setTotalPages(data.totalPages)
    })
  }

  const onChangePage = (label) => {
    console.log(label)
    if (label === 'next') {
      setSearchObj({ ...searchObj, pageIndex: searchObj.pageIndex + 1 })
    } else if (label === 'prev') {
      if (searchObj.pageIndex === 0 || searchObj.pageIndex < 0) {
        setSearchObj({ ...searchObj, pageIndex: 1 })
        return
      }
      setSearchObj({ ...searchObj, pageIndex: searchObj.pageIndex - 1 })
    }
  }

  const onChangePageSize = (event) => {
    setSearchObj({ ...searchObj, pageSize: parseInt(event.target.value, 10) })
  }

  const handleEdit = (id) => {
    getOne(id).then(({ data }) => {
      setItem(data)
      setOpenDialog(true)
    })
  }

  const handleDelete = (id) => {
    clear(id).then(({ data }) => {
      if (data) {
        toast.success('Xóa thành công')
        handleCloseDialog()
      } else {
        toast.warning('Xóa thất bại')
      }
    })
  }

  const handleCloseDialogAll = () => {
    setIsDelete(false)
    setOpenDialog(false)
    setItem({})
  }

  const handleDeleteOpenDialog = (item) => {
    setItem(item)
    setIsDelete(true)
  }

  const handleSearch = () => {
    setSearchObj({ ...searchObj, text: text })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <RoleHeader handleOpen={handleOpenDialog} count={totals}>
          <CCol xs={12} style={{ marginBottom: 20 }}>
            <CRow>
              <CCol xs={8}></CCol>
              <CCol xs={4}>
                <CRow>
                  <CCol xs={10}>
                    <CFormInput
                      type="text"
                      id="text"
                      placeholder="Tìm kiếm ..."
                      name="text"
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                    />
                  </CCol>
                  <CCol xs={2}>
                    <CButton
                      color="primary"
                      active={true}
                      disabled={false}
                      style={{ marginLeft: 0 }}
                      onClick={() => handleSearch()}
                    >
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCol>
          <CCol xs={12}>
            <CTable color="success" striped>
              <CTableCaption>{` Page ${searchObj.pageIndex} / ${totalPages}`} </CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên quyền</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listItem.length > 0
                  ? listItem.map((item) => {
                      return (
                        <CTableRow key={item.id}>
                          <CTableHeaderCell scope="row">
                            <CButton
                              color="primary"
                              active={true}
                              disabled={false}
                              size="sm"
                              style={{ marginRight: 5 }}
                              onClick={() => handleEdit(item.id)}
                            >
                              <CIcon icon={cilExternalLink} />
                            </CButton>
                            <CButton
                              color="danger"
                              active={true}
                              disabled={false}
                              size="sm"
                              onClick={() => handleDeleteOpenDialog(item)}
                            >
                              <CIcon icon={cilDelete} />
                            </CButton>
                          </CTableHeaderCell>
                          <CTableDataCell scope="row">{item?.name}</CTableDataCell>
                        </CTableRow>
                      )
                    })
                  : null}
              </CTableBody>
            </CTable>
          </CCol>
        </RoleHeader>
      </CCol>
      <CCol xs={12}>
        {openDialog && (
          <RoleDialog item={item} handleCloseDialog={handleCloseDialog} open={openDialog} />
        )}
      </CCol>
      <CCol xs={12}>
        {isDelete && (
          <DeleteConfirm
            open={isDelete}
            handleDelete={handleDelete}
            text={`Bạn có muốn xóa bản ghi role ${item?.name}`}
            handleClose={handleCloseDialogAll}
            id={item.id}
          />
        )}
      </CCol>
      <CCol xs={12}>
        <CPagination aria-label="Page navigation example" align="end">
          <CPaginationItem
            aria-label="Previous"
            onClick={() => onChangePage('prev')}
            disabled={searchObj.pageIndex === 1}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          <CFormSelect
            aria-label="Select pageSize"
            style={{ width: 75 }}
            onChange={(event) => onChangePageSize(event)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </CFormSelect>
          <CPaginationItem
            aria-label="Next"
            onClick={() => onChangePage('next')}
            disabled={searchObj.pageIndex >= totalPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CCol>
    </CRow>
  )
}

export default Role
