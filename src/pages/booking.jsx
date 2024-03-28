/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import 'moment/locale/vi';
import axios from 'axios';
// import momentTimezone from 'moment-timezone';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import BookingByRoomTable from './bookingByRoom';

const InfiniteScrollTable = (props) => {
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [roomFilterSelect] = useState(null);
  const [bookingIdFilter, setBookingIdFilter] = useState(null);
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

      setBookingData(response?.data);
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
    setBookingData({});
    fetchRoomAvailable({
      roomId: roomFilterSelect?.value,
      bookingId: bookingIdFilter,
      from: startDate,
      to: endDate,
    });
  };

  return (
    <div className="admin-table" style={{ marginTop: '20px' }}>
      {/* <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={roomFilterSelect}
          label="Phòng"
          onChange={(optionSelected) => {
            setRoomFilterSelect(optionSelected);
          }}
        >
          {_.map(homeStayIdList, (item, index) => (
            <MenuItem key={index} value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select> */}
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
        <TextField
          id="standard-basic"
          label="Booking ID"
          variant="outlined"
          value={bookingIdFilter}
          onChange={(e) => {
            setBookingIdFilter(e.target.value);
          }}
          style={{ marginLeft: '15px' }}
        />
      </Box>
      {/* <div className="select-option"> */}
      {/* <label htmlFor='guest'>Phòng:</label> */}
      {/* <Select
          className='basic-single'
          classNamePrefix='select'
          value={roomFilterSelect}
          isClearable
          isSearchable
          options={homeStayIdList}
          onChange={(optionSelected) => {
            setRoomFilterSelect(optionSelected);
          }}
          placeholder='Tất cả phòng'
        /> */}
      {/* </div> */}

      <Stack spacing={2} direction="row" style={{ paddingTop: '10px' }}>
        <Button variant="outlined" onClick={subimitSearch} color="primary">
          Tìm kiếm
        </Button>
        {/* <Button variant="outlined" color='secondary'>Đặt phòng</Button> */}
      </Stack>
      <BookingByRoomTable
        bookingData={bookingData}
        statisticData={statisticData}
        subimitSearch={subimitSearch}
      />
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

export default InfiniteScrollTable;
