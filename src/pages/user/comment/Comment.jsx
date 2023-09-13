import React from "react";
import { Button, Modal } from "antd";

const BasicModal = ({ visible, onClose }) => {
  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onClose}>
          Submit
        </Button>,
      ]}
    >
      <p>This is the content of the modal.</p>
    </Modal>
  );
};

export default BasicModal;
