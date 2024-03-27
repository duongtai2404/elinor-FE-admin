import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import PropTypes from 'prop-types';

const ConfirmDialog = (props) => {
  const { isOpen, handleDisagree, handleAgree, title, content } = props;

  return (
    <Dialog open={isOpen} onClose={handleDisagree}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>Từ chối</Button>
        <Button onClick={handleAgree} autoFocus>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleDisagree: PropTypes.func.isRequired,
  handleAgree: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ConfirmDialog;
