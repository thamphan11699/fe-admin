import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'
const DeleteConfirm = (props) => {
  const { handleDelete, text, open, handleClose, id } = props
  return (
    <>
      <CModal visible={open} alignment="center" onClose={handleClose}>
        <CModalHeader>
          <CModalTitle> Confirm Delete </CModalTitle>
        </CModalHeader>
        <CModalBody>{text}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(id)}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

DeleteConfirm.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  text: PropTypes.string,
  open: PropTypes.bool,
  id: PropTypes.number,
}

export default React.memo(DeleteConfirm)
