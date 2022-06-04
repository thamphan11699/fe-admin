import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { login, getUser, logout } from '../../../redux/authSlice'
import { signin, getCurrentUser } from './LoginService'
import { useHistory } from 'react-router-dom'
import axiosConfig from 'src/axiosConfig'

const Login = () => {
  const [user, setUser] = useState({ usernameOrEmail: '', password: '' })

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated])

  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      console.log(user)
      signin(user)
        .then(({ data }) => {
          console.log(data)
          localStorage.setItem('jwt', data.accessToken)
          dispatch(login())
          axiosConfig(data.accessToken)
          //Get curren user
          getCurrentUser()
            .then((res) => {
              console.log(res)
              dispatch(getUser(res.data))
              history.push('/dashboard')
            })
            .catch((error) => {
              console.log(error)
              dispatch(logout())
            })
        })
        .catch((err) => {
          alert('Login fail')
        })
    } catch (e) {
      console.log(e)
    }
  }

  return isAuthenticated ? (
    <Redirect to="/dashboard" />
  ) : (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3 has-validation">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        name="usernameOrEmail"
                        value={user.usernameOrEmail}
                        onChange={handleChange}
                        required
                      />
                      <CFormFeedback invalid>Please choose a username.</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4 has-validation">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={user.password}
                        name="password"
                        onChange={handleChange}
                        required
                      />
                      <CFormFeedback invalid>Please choose a password.</CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
