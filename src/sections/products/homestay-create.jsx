/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars, import/no-extraneous-dependencies
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';

import {
  Box,
  Select,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import numeral from 'numeral';
import ImageUpdateForm from './homestay-images';

// ----------------------------------------------------------------------

export default function HomeStayCreate() {
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    images: [],
    tables: [],
  });

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    if (_.includes(name, 'tableName')) {
      const tableIndex = _.toNumber(_.split(name, '-')[1]);
      const updatedTables = [...formData.tables];
      updatedTables[tableIndex].name = value;
      setFormData((prevData) => ({
        ...prevData,
        tables: updatedTables,
      }));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [toastInfo, setToastInfo] = useState({
    type: 'error',
    message: '',
  });
  const [openToast, setOpenToast] = useState(false);
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý dữ liệu tại đây
    const data = {
      name: formData.name,
      tables: formData.tables,
      images: formData.images,
    };

    try {
      let updateHomeStay = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/room`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      updateHomeStay = updateHomeStay?.data;
      const updateTable = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/table`,
        {
          tableList: _.map(formData.tables, (table) => ({ name: table.name, roomId: updateHomeStay?.data?.id })),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (updateHomeStay?.code === 1000) {
        setToastInfo({
          type: 'success',
          message: 'Tạo thành công',
        });
        window.location.reload();
      } else {
        setToastInfo({
          type: 'success',
          message: 'Tạo thất bại',
        });
      }
      setOpenToast(true);
    } catch (error) {
      console.log(`ERROR when call update homestay ${error.message} -- ${JSON.stringify(error)}`);
      setToastInfo({
        type: 'success',
        message: 'Tạo thất bại',
      });
      setOpenToast(true);
    }
  };

  const onChangeImages = (images) => {
    setFormData((prevData) => ({
      ...prevData,
      images,
    }));
  };

  useEffect(() => {
    //     const fetchHomeStay = async () => {
    //       try {
    //           let homestayResult = await axios.post('https://molly-patient-trivially.ngrok-free.app/room/search');
    //           homestayResult = homestayResult?.data;
    //           if (homestayResult?.code === 1000) {
    //               setHomeStay(homestayResult?.data?.rooms);
    //           }
    //       } catch (error) {
    //           console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
    //       }
    //   }
    //   fetchHomeStay();
  }, []);

  return (
    <Box>
      <Box mt={3}>
        <form onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
              Thông tin sảnh
            </Typography>

            <Box mt={3}>
              <TextField
                fullWidth
                label="Tên"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Divider style={{ border: '1px solid', width: '100%' }} />
          </Box>

          <Box mt={3}>
            <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
              Danh sách bàn
            </Typography>
            {_.map(formData.tables, (table, index) => (
              <Grid2 container spacing={2} display="flex" alignItems="center" mt={3}>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Tên bàn"
                    variant="outlined"
                    name={`tableName-${index}`}
                    value={table.name}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Box>
                {/* delete button */}
                <Box mt={3} ml={3}>
                  <Button
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        tables: _.filter(prevData.tables, (item, idx) => idx !== index),
                      }));
                    }}
                    variant="contained"
                    color="error"
                  >
                    Xóa
                  </Button>
                </Box>
              </Grid2>
            ))}
            {/* add new table BUTTON */}
            <Box mt={3}>
              <Button
                onClick={() => {
                  setFormData((prevData) => ({
                    ...prevData,
                    tables: [...prevData.tables, { name: '' }],
                  }));
                }}
                variant="contained"
                color="primary"
              >
                + Thêm bàn
              </Button>
            </Box>
          </Box>

          <Box mt={3}>
            <Divider style={{ border: '1px solid', width: '100%' }} />
          </Box>
          <Box mt={3}>
            <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
              Hình ảnh
            </Typography>
            <ImageUpdateForm onChange={onChangeImages} imagesData={formData.images} />
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ border: '1px solid', borderRadius: '5px' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastInfo.type}
          sx={{ width: '100%' }}
          style={{ fontWeight: 'bolder' }}
        >
          {toastInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
