import React, { Component, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoadingIndicator from '../spinner/LoadingIndicator';

interface PopupModalProps {
  title?: ReactNode;
  body?: ReactNode;
  style?: React.CSSProperties;
  onClose?: () => void;
  onShow?: () => void;
  defaultShow?: boolean; // Initial visibility for uncontrolled usage
  backdrop?: boolean | 'static'; // Backdrop behavior
  centered?: boolean; // Center the modal vertically
  footerButtons?: ReactNode; // Custom footer buttons
  isLoading?: boolean; // Loader state
}

interface PopupModalState {
  show: boolean; // Internal visibility state
}

class PopupModal extends Component<PopupModalProps, PopupModalState> {
  static defaultProps = {
    defaultShow: false,
    backdrop: true,
    centered: true,
    isLoading: false,
  };

  constructor(props: PopupModalProps) {
    super(props);
    this.state = {
      show: props.defaultShow || false,
    };
  }

  handleShow = () => {
    this.setState({ show: true }, () => {
      this.props.onShow?.();
    });
  };

  handleClose = () => {
    this.setState({ show: false }, () => {
      this.props.onClose?.();
    });
  };

  render() {
    const {
      title,
      body,
      style,
      backdrop,
      centered,
      footerButtons,
      isLoading,
    } = this.props;
    const { show } = this.state;

    return (
      <Modal
        show={show}
        onHide={this.handleClose}
        backdrop={backdrop}
        centered={centered}
        style={style}
        aria-labelledby="modal-title"
        aria-describedby="modal-body"
      >
        {title && (
          <Modal.Header closeButton>
            <Modal.Title id="modal-title">{title}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body id="modal-body">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
              <LoadingIndicator />
            </div>
          ) : (
            body
          )}
        </Modal.Body>
        {footerButtons !== null && (
          <Modal.Footer>
            {footerButtons || (
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}

export default PopupModal;


/**
 * 
import React, { createRef, Component } from 'react';
import PopupModal from './PopupModal';

class App extends Component {
  modalRef = createRef<PopupModal>(); // Reference to PopupModal class

  openModal = () => {
    this.modalRef.current?.handleShow(); // Call handleShow on the modal
  };

  render() {
    return (
      <>
        <button onClick={this.openModal}>Open Modal</button>
        <PopupModal
          ref={this.modalRef}
          title="Modal with Class Component"
          body="This modal was opened programmatically using a class!"
          footerButtons={
            <>
              <button
                onClick={() => alert('Confirmed!')}
                style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px' }}
              >
                Confirm
              </button>
            </>
          }
          onClose={() => alert('Modal closed!')}
        />
      </>
    );
  }
}

export default App;

*/