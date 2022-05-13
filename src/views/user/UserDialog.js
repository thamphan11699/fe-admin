import React, { useEffect } from 'react'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CModalBody,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CForm,
  CFormSwitch,
  CFormFeedback,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Select from 'react-select'
import { getRoles, save, update } from './UserService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'

const UserDialog = (props) => {
  const { item, open, handleCloseDialog } = props
  const [itemForm, setItemForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    roles: [],
    userInfo: {
      fullName: '',
      birthOfDate: null,
      gender: 1,
      address: '',
      phoneNumber: '',
    },
  })

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)

  const [roleOption, setRoleOption] = useState([])
  const handleChange = (event, obj) => {
    console.log(event.target.value)
    if (obj === 'userInfo') {
      setItemForm({
        ...itemForm,
        userInfo: { ...itemForm.userInfo, [event.target.name]: event.target.value },
      })
      return
    }
    setItemForm({ ...itemForm, [event.target.name]: event.target.value })
  }

  const handleChangeRole = (role) => {
    const _roles = role.map((role) => {
      return { id: role.value, name: role.label }
    })
    setItemForm({ ...itemForm, roles: _roles })
  }

  const genders = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
    { value: 3, label: 'Undefined' },
  ]

  const handleChangeGenders = (gender) => {
    setItemForm({
      ...itemForm,
      userInfo: { ...itemForm.userInfo, gender: gender.value },
    })
  }

  useEffect(() => {
    if (item.id) {
      setItemForm(item)
      setIsEdit(false)
      setIsAdd(false)
    } else {
      setIsEdit(false)
      setIsAdd(true)
    }

    getRoles().then(({ data }) => {
      if (data.content != null && data.content.length > 0) {
        let roles = data.content.map((role) => {
          return { value: role.id, label: role.name }
        })
        setRoleOption(roles)
      }
    })
  }, [item])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (itemForm.id) {
      if (isEdit) {
        if (itemForm.password !== itemForm.passwordConfirm) {
          return
        }
      }

      update(itemForm.id, itemForm)
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
      if (itemForm.password !== itemForm.passwordConfirm) {
        return
      }
      save(itemForm)
        .then(({ data }) => {
          console.log(data)
          handleCloseDialog()
          toast.success('Thêm mới thành công')
        })
        .catch((err) => {
          console.log(err)
          toast.success('Thêm mới thất bại')
        })
    }
  }

  const handleDateChange = (date) => {
    setItemForm({
      ...itemForm,
      userInfo: { ...itemForm.userInfo, birthOfDate: date },
    })
  }
  const handleCheck = () => {
    setIsEdit(!isEdit)
  }
  return (
    <>
      <CModal visible={open} onClose={() => handleCloseDialog()} size="lg">
        <CForm onSubmit={(event) => handleSubmit(event)} validated={true}>
          <CModalHeader>
            <CModalTitle>{item.id != null ? 'Sửa' : ' Thêm mới'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="username">Tên đăng nhập</CFormLabel>
                <CFormInput
                  type="text"
                  id="username"
                  placeholder="username"
                  name="username"
                  value={itemForm.username}
                  onChange={(event) => handleChange(event, '')}
                  required
                />
                <CFormFeedback invalid>Vui lòng điền tên đăng nhập</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="email">Tài khoản email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  value={itemForm.email}
                  onChange={(event) => handleChange(event, '')}
                  required
                />
                <CFormFeedback invalid>Vui lòng điền email</CFormFeedback>
              </CCol>
              {itemForm.id && (
                <CCol xs={12} style={{ marginTop: 10 }}>
                  <CFormSwitch
                    label="Đổi mật khẩu"
                    id="isEdit"
                    checked={isEdit}
                    onChange={() => handleCheck()}
                  />
                </CCol>
              )}

              {isEdit && (
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <CCol xs={6} style={{ paddingRight: 10 }} className="mb-3">
                    <CFormLabel htmlFor="password">Mật khẩu</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="*******"
                      name="password"
                      value={itemForm.password}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    <CFormFeedback invalid>Vui lòng điền mật khẩu</CFormFeedback>
                  </CCol>
                  <CCol xs={6} style={{ paddingLeft: 10 }} className="mb-3">
                    <CFormLabel htmlFor="passwordConfirm">Nhập lại mật khẩu </CFormLabel>
                    <CFormInput
                      type="password"
                      id="passwordConfirm"
                      placeholder="*******"
                      name="passwordConfirm"
                      value={itemForm.passwordConfirm}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    {/* <CFormFeedback invalid>Mật khẩu không trùng khớp</CFormFeedback> */}
                    {itemForm.passwordConfirm !== itemForm.password && (
                      <span style={{ color: 'red', fontSize: 13 }}>Mật khẩu không trùng khớp</span>
                    )}
                  </CCol>
                </div>
              )}

              {isAdd && (
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <CCol xs={6} style={{ paddingRight: 10 }} className="mb-3">
                    <CFormLabel htmlFor="password">Mật khẩu</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="*******"
                      name="password"
                      value={itemForm.password}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    <CFormFeedback invalid>Vui lòng điền mật khẩu</CFormFeedback>
                  </CCol>
                  <CCol xs={6} style={{ paddingLeft: 10 }} className="mb-3">
                    <CFormLabel htmlFor="passwordConfirm">Nhập lại mật khẩu </CFormLabel>
                    <CFormInput
                      type="password"
                      id="passwordConfirm"
                      placeholder="*******"
                      name="passwordConfirm"
                      value={itemForm.passwordConfirm}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    {itemForm.passwordConfirm !== itemForm.password && (
                      <span style={{ color: 'red', fontSize: 13 }}>Mật khẩu không trùng khớp</span>
                    )}
                  </CCol>
                </div>
              )}

              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="role">Ngày sinh</CFormLabel>
                <DatePicker
                  selected={
                    itemForm.userInfo?.birthOfDate ? itemForm.userInfo?.birthOfDate : new Date()
                  }
                  onChange={handleDateChange}
                  style={{ width: '100%', height: '36px' }}
                  value={itemForm.userInfo?.birthOfDate}
                  showTimeSelect
                  required
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="fullname">Họ và tên</CFormLabel>
                <CFormInput
                  type="text"
                  id="fullName"
                  placeholder="Tran quoc anh"
                  name="fullName"
                  value={itemForm.userInfo?.fullName}
                  onChange={(event) => handleChange(event, 'userInfo')}
                  required
                />
                <CFormFeedback invalid>Vui lòng điền họ và tên</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="gender">Giới tính</CFormLabel>
                <Select
                  options={genders}
                  onChange={(gender) => handleChangeGenders(gender)}
                  value={genders.find((element) => element.value === itemForm.userInfo?.gender)}
                  required
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="phonenumber">Điện thoại</CFormLabel>
                <CFormInput
                  type="number"
                  id="phonenumber"
                  name="phoneNumber"
                  placeholder="0122345698"
                  onChange={(event) => handleChange(event, 'userInfo')}
                  value={itemForm.userInfo?.phoneNumber}
                  required
                />
                <CFormFeedback invalid>Vui lòng điền số điện thoại</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="address">Địa chỉ</CFormLabel>
                <CFormInput
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Ha Noi"
                  onChange={(event) => handleChange(event, 'userInfo')}
                  value={itemForm.userInfo?.address}
                  required
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="role">Role</CFormLabel>
                <Select
                  options={roleOption}
                  onChange={(role) => handleChangeRole(role)}
                  isMulti
                  classNamePrefix="select"
                  defaultValue={itemForm.roles.map((role) => {
                    return { value: role.id, label: role.name }
                  })}
                  value={itemForm.roles.map((role) => {
                    return { value: role.id, label: role.name }
                  })}
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

UserDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func,
}

export default UserDialog
