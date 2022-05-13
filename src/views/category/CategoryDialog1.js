import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { save, update, getParent } from './CategoryService'
import Select from 'react-select'

const CategoryDialog = (props) => {
  const { item, open, handleCloseDialog } = props
  const [itemForm, setItemForm] = useState({
    name: '',
    code: '',
    description: '',
    parent: null,
  })
  const [listParent, setListParent] = useState([])

  const handleChange = (event) => {
    console.log(event.target.value)
    setItemForm({ ...itemForm, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (item.id) {
      setItemForm(item)
    }
    getParent({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
      console.log(data)
      const _data = data.map((item) => {
        return { value: item.id, label: item.name }
      })
      _data.push({ value: 0, label: 'Không có' })
      setListParent(_data)
    })
  }, [item])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (itemForm.id) {
      update(itemForm, itemForm.id)
        .then(({ data }) => {
          console.log(data)
          handleCloseDialog()
          toast.success('Sửa thành công')
        })
        .catch((err) => {
          console.log(err)
          toast.success('Sửa thất bại')
        })
    } else {
      save(itemForm)
        .then(({ data }) => {
          console.log(data)
          handleCloseDialog()
          toast.success('Thêm mới thành công')
        })
        .catch((err) => {
          console.log(err)
          toast.warning('Thêm mới thất bại')
        })
    }
  }

  const handleChangeParent = (parent) => {
    setItemForm({
      ...itemForm,
      parent: { id: parent.value, name: parent.label },
    })
  }
  return (
    <>
      <CModal visible={open} onClose={() => handleCloseDialog()} size="lg" alignment="center">
        <CForm onSubmit={(event) => handleSubmit(event)}>
          <CModalHeader>
            <CModalTitle>{item.id != null ? 'Sửa' : ' Thêm mới'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="parent"></CFormLabel>
                <Select
                  options={listParent}
                  onChange={(parent) => handleChangeParent(parent)}
                  classNamePrefix="select"
                  value={
                    itemForm.parent
                      ? { value: itemForm.parent.id, label: itemForm.parent.name }
                      : null
                  }
                  defaultValue={{ value: 0, label: 'Không có' }}
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="name">Tên </CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Tên"
                  name="name"
                  value={itemForm.name}
                  onChange={(event) => handleChange(event)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="code">Mã </CFormLabel>
                <CFormInput
                  type="text"
                  id="code"
                  placeholder="Mã"
                  name="code"
                  value={itemForm.code}
                  onChange={(event) => handleChange(event)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="name">Mô tả</CFormLabel>
                <CFormInput
                  type="text"
                  id="description"
                  placeholder="Mô tả"
                  name="description"
                  value={itemForm.description}
                  onChange={(event) => handleChange(event)}
                  required
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => handleCloseDialog()}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Save changes
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

CategoryDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func,
}

// export default CategoryDialog
