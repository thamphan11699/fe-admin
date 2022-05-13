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
import { save, update } from './RoleService'

const RoleDialog = (props) => {
  const { item, open, handleCloseDialog } = props
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
  })

  const handleChange = (event) => {
    console.log(event.target.value)
    setItemForm({ ...itemForm, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    if (item.id) {
      setItemForm(item)
    }
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

  console.log(itemForm)
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
                <CFormLabel htmlFor="name">Tên Quyền</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Tên Quyền"
                  name="name"
                  value={itemForm.name}
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
              Hủy
            </CButton>
            <CButton color="primary" type="submit">
              Lưu
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

RoleDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func,
}

export default RoleDialog
