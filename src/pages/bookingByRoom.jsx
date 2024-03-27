/* eslint-disable prefer-const */
import _ from 'lodash';
import numeral from 'numeral';
/* eslint-disable react/prop-types */
import * as React from 'react';
import moment from 'moment-timezone';
import axios from 'axios';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import ConfirmDialog from 'src/components/dialog';
import BookedRow from './bookedRow';

const mappingData = (bookingData, actions) => {
  const result = [];
  _.forEach(bookingData, (bookingByDay) => {
    const tempResult = [];
    tempResult.push(
      <TableRow style={{}}>
        <TableCell
          align="center"
          colSpan={9}
          style={{
            color: 'red',
            backgroundColor: 'antiquewhite',
            fontSize: '16px',
            padding: '10px 0',
          }}
        >
          <b>{`${bookingByDay.dayOfWeek}, ${moment(bookingByDay.day)
            .tz('Asia/Ho_Chi_Minh')
            .format('DD/MM/YYYY')}`}</b>
          <br />
        </TableCell>
      </TableRow>
    );
    _.forEach(bookingByDay.timeSlot, (timeslot) => {
      tempResult.push(
        <TableRow style={{ backgroundColor: '#faebd785' }}>
          <TableCell align="center" style={{ color: 'green' }}>
            <b>{timeslot.timeString}</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Booking ID</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Tên</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Số điện thoại</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Số người</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Số bàn</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Loại combo + giá </b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Ghi chú</b>
          </TableCell>
          <TableCell align="center" style={{}}>
            <b>Thao tác</b>
          </TableCell>
        </TableRow>
      );
      if (_.isEmpty(timeslot.bookings)) {
        tempResult.push(
          <TableRow>
            <TableCell
              colSpan={9}
              align="center"
              style={{ color: '#02020236', padding: '25px 0px', backgroundColor: '#faebd73d' }}
            >
              <b>Không có booking</b>
            </TableCell>
          </TableRow>
        );
      } else {
        _.forEach(timeslot.bookings, (booking) => {
          tempResult.push(<BookedRow booking={booking} subimitSearch={actions.subimitSearch} />);
        });
        // Row thống kê
        // tempResult.push(
        //   <TableRow style={{ backgroundColor: 'darkseagreen', fontWeight: 'bold' }}>
        //     <TableCell align="center" style={{ color: 'green' }}>
        //       <b>Thống kế</b>
        //     </TableCell>
        //     <TableCell align="center">
        //       <p>2 booking</p>
        //     </TableCell>
        //     <TableCell align="center">
        //       <b></b>
        //     </TableCell>
        //     <TableCell align="center">
        //       <b></b>
        //     </TableCell>
        //     <TableCell align="center">
        //       <p>4 khách hàng</p>
        //     </TableCell>
        //     <TableCell align="left">
        //       <p>Bàn đơn: 1 bàn (Bàn 1)</p>
        //       <p>Bàn đôi: 1 bàn (Bàn 2 + 3)</p>
        //     </TableCell>
        //     <TableCell align="left">
        //       <p>standard2: 1 suất</p>
        //       <p>standard1: 1 suất</p>
        //     </TableCell>
        //     <TableCell align="center">
        //       <b></b>
        //     </TableCell>
        //     <TableCell align="center">
        //       <b></b>
        //     </TableCell>
        //   </TableRow>
        // );
      }
    });
    result.push(
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="a dense table"
        style={{
          fontFamily: 'Cabin !important',
          marginTop: '30px',
        }}
        // border={1}
      >
        {tempResult}
      </Table>
    );
  });
  return result;
};

export default function DenseTable(props) {
  const { bookingData, statisticData = {}, subimitSearch } = props;

  return (
    <TableContainer component={Paper}>
      {mappingData(bookingData, {
        subimitSearch,
      })}
    </TableContainer>
  );
}
