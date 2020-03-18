import React from 'react'
import { createPortal } from 'react-dom'
import usePortal from '../hooks/usePortal'

const Modal = ({ children, title, onClose, visible }) => {
  const target = usePortal('modal-container')

  if (!visible) return null

  return createPortal(
    <div className="modal__wrapper">
      <div className="modal__content">
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <span
            className="modal__close-icon"
            onClick={onClose ? () => onClose() : null}
          >
            &times;
          </span>
        </div>
        {children}
      </div>
    </div>,
    target,
  )
}

export default Modal
