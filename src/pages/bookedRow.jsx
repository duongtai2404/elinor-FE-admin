/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import axios from 'axios';
import numeral from 'numeral';
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';

import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import ConfirmDialog from 'src/components/dialog';

const BookedRow = (props) => {
  const { booking, subimitSearch } = props;
  const token = localStorage.getItem('token');

  // dialog gửi lại mail
  const [isOpenResendEmail, setIsOpenResendEmail] = React.useState(false);
  const handleDisagree = () => {
    setIsOpenResendEmail(false);
  };
  const handleAgree = async () => {
    setIsOpenResendEmail(false);
    try {
      await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/reSendMail`, {
        bookingId: booking.id,
      });
    } catch (error) {
      console.log(`[ERROR] reSendMail ${error}`);
    }
  };

  // dialog hủy bàn
  const [isOpenCancel, setIsOpenCancel] = React.useState(false);
  const handleDisagreeCancel = () => {
    setIsOpenCancel(false);
  };
  const handleAgreeCancel = async () => {
    setIsOpenCancel(false);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/booking/delete`,
        {
          bookingId: booking.id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(`[ERROR] `);
    }
    subimitSearch();
  };

  // dialog xem và edit ghi chú
  const [isOpenNote, setIsOpenNote] = React.useState(false);
  const [note, setNote] = React.useState(booking.note);
  const handleDisagreeNote = () => {
    setIsOpenNote(false);
  };
  const handleAgreeNote = async () => {
    setIsOpenNote(false);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/booking/addNote`,
        {
          bookingId: booking.id,
          note,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(`[ERROR] reSendMail ${error}`);
    }
    subimitSearch();
  };

  return (
    <TableRow>
      <TableCell align="center" style={{}} />
      <TableCell align="center" style={{}}>
        {booking.id}
      </TableCell>
      <TableCell align="center" style={{}}>
        {booking.contactName}
      </TableCell>
      <TableCell align="center" style={{}}>
        {booking.contactPhone?.substring(0, 4)} {booking.contactPhone?.substring(4, 7)}{' '}
        {booking.contactPhone?.substring(7, booking.contactPhone.length)}
        <p>{booking.contactEmail}</p>
      </TableCell>
      <TableCell align="center" style={{}}>
        {booking.totalCustomer}
      </TableCell>
      <TableCell align="center" style={{}}>
        {_.join(
          _.map(booking.tables, (table) => `Bàn ${table.name}`),
          ', '
        )}
      </TableCell>
      <TableCell align="center" style={{}}>
        {`${booking.menuType} - ${numeral(booking.total).format('0,0')}đ`}
      </TableCell>
      <TableCell align="center" style={{}}>
        {booking.note ? (
          <Chip
            size="medium"
            label="Xem"
            color="info"
            clickable
            onClick={() => setIsOpenNote(true)}
          />
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align="center" style={{ margin: 'auto' }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Hành động"
          style={{
            outline: 'none',
          }}
        >
          <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
            <Chip
              size="medium"
              label="Gửi mail"
              color="primary"
              clickable
              onClick={() => setIsOpenResendEmail(true)}
            />
            <Chip
              size="medium"
              label="Hủy bàn"
              color="error"
              clickable
              onClick={() => setIsOpenCancel(true)}
            />
            <Chip
              size="medium"
              label="Xác nhận đã thanh toán"
              color="secondary"
              clickable
              onClick={() => setIsOpenCancel(true)}
            />
          </Stack>
        </Select>
        {/* <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Chip
            size="small"
            label="Gửi mail"
            color="primary"
            clickable
            onClick={() => setIsOpenResendEmail(true)}
          />
          <Chip
            size="small"
            label="Hủy bàn"
            color="error"
            clickable
            onClick={() => setIsOpenCancel(true)}
          />
        </Stack> */}
      </TableCell>
      <ConfirmDialog
        title="Bạn có chắc chắn muốn gửi lại mail ?"
        isOpen={isOpenResendEmail}
        handleDisagree={handleDisagree}
        handleAgree={handleAgree}
      />
      <ConfirmDialog
        title="Bạn có chắc chắn muốn hủy ?"
        isOpen={isOpenCancel}
        handleDisagree={handleDisagreeCancel}
        handleAgree={handleAgreeCancel}
      />
      <Dialog open={isOpenNote} onClose={handleDisagreeNote}>
        <DialogContent>
          <DialogContentText>
            <TextField
              rows={8}
              id="outlined-basic"
              label="Ghi chú"
              variant="outlined"
              multiline
              editable
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgreeNote}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};

export default BookedRow;
