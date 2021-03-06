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
          handleCloseDialog()
          toast.success('S???a th??nh c??ng')
        })
        .catch((err) => {
          toast.success('S???a th???t b???i')
        })
    } else {
      if (itemForm.password !== itemForm.passwordConfirm) {
        return
      }
      save(itemForm)
        .then(({ data }) => {
          handleCloseDialog()
          toast.success('Th??m m???i th??nh c??ng')
        })
        .catch((err) => {
          toast.success('Th??m m???i th???t b???i')
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
            <CModalTitle>{item.id != null ? 'S???a' : ' Th??m m???i'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="username">T??n ????ng nh???p</CFormLabel>
                <CFormInput
                  type="text"
                  id="username"
                  placeholder="username"
                  name="username"
                  value={itemForm.username}
                  onChange={(event) => handleChange(event, '')}
                  required
                />
                <CFormFeedback invalid>Vui l??ng ??i???n t??n ????ng nh???p</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="email">T??i kho???n email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  name="email"
                  value={itemForm.email}
                  onChange={(event) => handleChange(event, '')}
                  required
                />
                <CFormFeedback invalid>Vui l??ng ??i???n email</CFormFeedback>
              </CCol>
              {itemForm.id && (
                <CCol xs={12} style={{ marginTop: 10 }}>
                  <CFormSwitch
                    label="?????i m???t kh???u"
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
                    <CFormLabel htmlFor="password">M???t kh???u</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="*******"
                      name="password"
                      value={itemForm.password}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    <CFormFeedback invalid>Vui l??ng ??i???n m???t kh???u</CFormFeedback>
                  </CCol>
                  <CCol xs={6} style={{ paddingLeft: 10 }} className="mb-3">
                    <CFormLabel htmlFor="passwordConfirm">Nh???p l???i m???t kh???u </CFormLabel>
                    <CFormInput
                      type="password"
                      id="passwordConfirm"
                      placeholder="*******"
                      name="passwordConfirm"
                      value={itemForm.passwordConfirm}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    {/* <CFormFeedback invalid>M???t kh???u kh??ng tr??ng kh???p</CFormFeedback> */}
                    {itemForm.passwordConfirm !== itemForm.password && (
                      <span style={{ color: 'red', fontSize: 13 }}>M???t kh???u kh??ng tr??ng kh???p</span>
                    )}
                  </CCol>
                </div>
              )}

              {isAdd && (
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <CCol xs={6} style={{ paddingRight: 10 }} className="mb-3">
                    <CFormLabel htmlFor="password">M???t kh???u</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="*******"
                      name="password"
                      value={itemForm.password}
                      onChange={(event) => handleChange(event, '')}
                      required
                    />
                    <CFormFeedback invalid>Vui l??ng ??i???n m???t kh???u</CFormFeedback>
                  </CCol>
                  <CCol xs={6} style={{ paddingLeft: 10 }} className="mb-3">
                    <CFormLabel htmlFor="passwordConfirm">Nh???p l???i m???t kh???u </CFormLabel>
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
                      <span style={{ color: 'red', fontSize: 13 }}>M???t kh???u kh??ng tr??ng kh???p</span>
                    )}
                  </CCol>
                </div>
              )}

              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="role">Ng??y sinh</CFormLabel>
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
                <CFormLabel htmlFor="fullname">H??? v?? t??n</CFormLabel>
                <CFormInput
                  type="text"
                  id="fullName"
                  placeholder="Tran quoc anh"
                  name="fullName"
                  value={itemForm.userInfo?.fullName}
                  onChange={(event) => handleChange(event, 'userInfo')}
                  required
                />
                <CFormFeedback invalid>Vui l??ng ??i???n h??? v?? t??n</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="gender">Gi???i t??nh</CFormLabel>
                <Select
                  options={genders}
                  onChange={(gender) => handleChangeGenders(gender)}
                  value={genders.find((element) => element.value === itemForm.userInfo?.gender)}
                  required
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="phonenumber">??i???n tho???i</CFormLabel>
                <CFormInput
                  type="number"
                  id="phonenumber"
                  name="phoneNumber"
                  placeholder="0122345698"
                  onChange={(event) => handleChange(event, 'userInfo')}
                  value={itemForm.userInfo?.phoneNumber}
                  required
                />
                <CFormFeedback invalid>Vui l??ng ??i???n s??? ??i???n tho???i</CFormFeedback>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="address">?????a ch???</CFormLabel>
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
              H???y
            </CButton>
            <CButton color="primary" type="submit">
              L??u
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
