import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//Mananger
const User = React.lazy(() => import('./views/user/User'))
const Role = React.lazy(() => import('./views/role/Role'))
const Category = React.lazy(() => import('./views/category/Category'))
const Color = React.lazy(() => import('./views/Color/Color'))
const ContextProvider = React.lazy(() => import('./views/context-provider/ContextProvider'))
const WareHouse = React.lazy(() => import('./views/ware-house/WareHouse'))
const News = React.lazy(() => import('./views/news/News'))
const Product = React.lazy(() => import('./views/product/Product'))
const Order = React.lazy(() => import('./views/order/Order'))

const routes = [
  { path: '/', exact: true, name: 'Trang chủ' },
  { path: '/dashboard', name: 'Thống kê', component: Dashboard },
  { path: '/user', name: 'Quản lý người dùng', component: User },
  { path: '/role', name: 'Quản lý quyền', component: Role },
  { path: '/category', name: 'Quản lý danh muc', component: Category },
  { path: '/color', name: 'Quản lý màu sắc', component: Color },
  { path: '/context-provider', name: 'Quản lý NCC', component: ContextProvider },
  { path: '/ware-house', name: 'Quản lý kho', component: WareHouse },
  { path: '/news', name: 'Quản lý tin tức', component: News },
  { path: '/product', name: 'Quản lý sản phẩm', component: Product },
  { path: '/order', name: 'Quản lý đơn hàng', component: Order },
]

export default routes
