import { cilSpeedometer, cilStar, cilUser, cilWindow } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
import React from 'react'

const _nav = [
  {
    component: CNavItem,
    name: 'Thống kê',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Quản lý',
    to: '/manager',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh Mục',
        to: '/category',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Sản phẩm',
        to: '/product',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Đơn hàng',
        to: '/order',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Màu sắc',
        to: '/color',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Nhà cung cấp',
        to: '/context-provider',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Kho',
        to: '/ware-house',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tin tức',
        to: '/news',
        icon: <CIcon icon={cilWindow} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Quyền',
        to: '/role',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Người dùng',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
]

export default _nav
