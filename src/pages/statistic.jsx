/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import _ from 'lodash';
import 'moment/locale/vi';
import axios from 'axios';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import momentTimezone from 'moment-timezone';
import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Box,  Paper, Stack, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const dayOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const mappingData = (bookingData, actions) => {
  const result = [];
  _.forOwn(bookingData, (statisticByDay, day) => {
    const tempResult = [];
    tempResult.push(
      <TableRow
        style={{
          color: 'red',
          backgroundColor: 'antiquewhite',
          fontSize: '16px',
          padding: '10px 0',
        }}
      >
        <TableCell align="center" colSpan={1}>
          <b>{`${dayOfWeek[momentTimezone(day, 'DD/MM/YYYY').day()]}, ${moment(day, 'DD/MM/YYYY')
            .tz('Asia/Ho_Chi_Minh')
            .format('DD/MM/YYYY')}`}</b>
          <br />
        </TableCell>
        <TableCell align="center" colSpan={2}>
          <b>Đầu bếp</b>
        </TableCell>
        <TableCell align="center" colSpan={2}>
          <b>Phục vụ</b>
        </TableCell>
        <TableCell align="center" colSpan={2}>
          <b>Quản lý</b>
        </TableCell>
      </TableRow>
    );
    _.forOwn(statisticByDay, (value, timeString) => {
      tempResult.push(
        <TableRow style={{ backgroundColor: '#faebd785' }}>
          <TableCell align="center" style={{ color: 'green' }}>
            <b>{timeString}</b>
          </TableCell>
          <TableCell align="center" colSpan={2}>
            <b>Số lượng set</b>
          </TableCell>
          <TableCell align="center" colSpan={2}>
            <b>Số lượng bàn</b>
          </TableCell>
          <TableCell align="center" colSpan={2}>
            <b>Số lượng người</b>
          </TableCell>
        </TableRow>
      );
      _.forEach(value?.bookingByTableLength, (bookingByTable) =>
        tempResult.push(
          <TableRow style={{ backgroundColor: '#faebd785' }}>
            <TableCell align="center" style={{ color: 'green' }}>
              <b> </b>
            </TableCell>
            <TableCell align="center" colSpan={2}>
              {
                _.map(bookingByTable.menuStats, (menuStat) => (
                  <p>{menuStat.type}: {menuStat.count} phần</p>
                ))
              }
            </TableCell>
            <TableCell align="center" colSpan={1}>
              {bookingByTable.tableType}
            </TableCell>
            <TableCell align="center" colSpan={1}>
              { bookingByTable.count }
            </TableCell>
            <TableCell align="center" colSpan={2}>
              <p>{bookingByTable.totalCustomer}</p>
            </TableCell>
          </TableRow>
        )
      );
      // Row thống kê
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
      >
        {tempResult}
      </Table>
    );
  });
  return result;
};

const Statistic = (props) => {
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [bookingData, setBookingData] = useState({});
  const [bookingIdFilter] = useState(null);
  const [statisticData, setStatisticData] = useState({});

  const fetchRoomAvailable = async ({ roomId, from, to }) => {
    try {
      setLoading(true);
      const queryParams = {};
      if (roomId) queryParams.roomId = roomId;
      if (from) queryParams.from = from;
      if (to) queryParams.to = to;
      if (bookingIdFilter) queryParams.bookingId = bookingIdFilter;
      console.log('\n - file: adminTable.js:33 - fetchRoomAvailable - queryParams:', queryParams);

      let response = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/room/checkAvailable`, queryParams);
      response = response?.data || {};
      console.log('\n - fetchRoomAvailable - response:', response);

      // setBookingData(response?.data);
    } catch (error) {
      console.log(
        `[ERROR] => call api /room/checkAvailable error ${error.message} -- ${JSON.stringify(
          error
        )}`
      );
    }
    setLoading(false);
  };

  const getStatistic = async ({ from, to }) => {
    try {
      setLoading(true);
      const queryParams = {};
      if (from) queryParams.from = from;
      if (to) queryParams.to = to;

      let response = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000'}/booking/statistics`, queryParams);
      response = response?.data || {};

      setStatisticData(response?.data);
    } catch (error) {
      console.log(
        `[ERROR] => call api /booking/statistics error ${error.message} -- ${JSON.stringify(error)}`
      );
    }
  };

  // const fetchHomeStay = async () => {
  //   setLoading(true);
  //   try {
  //     let homestayResult = await axios.post('https://booking-kohl-six.vercel.app/room/search');
  //     homestayResult = homestayResult?.data;

  //     if (homestayResult?.code === 1000) {
  //       setHomeStay(homestayResult?.data?.rooms);

  //       const homeStayNewFormat = [];
  //       _.forEach(homestayResult?.data?.rooms, (item) => {
  //         homeStayNewFormat.push({
  //           value: item.id,
  //           label: item.name,
  //         });
  //       });
  //       if (homeStayNewFormat.length > 0) {
  //         setHomeStayIdList(homeStayNewFormat);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    // set room id
    // setRoomId(roomFilterSelect?.value);

    const start = moment()
      .tz('Asia/Ho_Chi_Minh')
      // .subtract(1, 'days')
      .startOf('day');
    // .toDate();
    setStartDate(start);

    const end = moment().tz('Asia/Ho_Chi_Minh').add(7, 'days').startOf('day');
    // .toDate();
    setEndDate(end);

    // fetchHomeStay();

    fetchRoomAvailable({
      from: start,
      to: end,
    });
    getStatistic({
      from: start,
      to: end,
    });
  }, []);

  const subimitSearch = () => {
    setStatisticData({});
    getStatistic({
      from: startDate,
      to: endDate,
    });
  };

  return (
    <div className="admin-table" style={{ marginTop: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
        <LocalizationProvider dateAdapter={AdapterMoment} locale="vi">
          <DatePicker
            label="Từ ngày"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            format="DD/MM/YYYY"
          />
          <DatePicker
            label="Đến ngày"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            format="DD/MM/YYYY"
          />
        </LocalizationProvider>
      </Box>

      <Stack spacing={2} direction="row" style={{ paddingTop: '10px' }}>
        <Button variant="outlined" onClick={subimitSearch} color="primary">
          Thống kê
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        {mappingData(statisticData, {
          subimitSearch,
        })}
      </TableContainer>
      {loading && (
        <div
          className="loading-spinner"
          style={{
            marginTop: '20px',
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};

export default Statistic;
