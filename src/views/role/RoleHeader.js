import PropTypes from 'prop-types'
import React from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCode, cilMediaPlay } from '@coreui/icons'

const RoleHeader = (props) => {
  const { children, handleOpen, count } = props

  return (
    <div className="example">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink active>
            <CIcon icon={cilMediaPlay} className="me-2" />
            {`Danh sách ${count}`}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink onClick={() => handleOpen()}>
            <CIcon icon={cilCode} className="me-2" />
            Thêm
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="rounded-bottom">
        <CTabPane className="p-3 preview" visible>
          {children}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

RoleHeader.propTypes = {
  children: PropTypes.node,
  handleOpen: PropTypes.func,
  count: PropTypes.number,
}

export default React.memo(RoleHeader)
