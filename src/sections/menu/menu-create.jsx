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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import numeral from 'numeral';
import ImageUpdateForm from '../products/homestay-images';

// ----------------------------------------------------------------------

export default function MenuCreate() {
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    customerNumber: 0,
    images: [],
    items: [],
    type: ''
  });

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    if (_.includes(name, 'foodName')) {
      const foodIndex = _.toNumber(_.split(name, '-')[1]);
      const updateItemsFood = [...formData.items];
      updateItemsFood[foodIndex] .name = value;
      setFormData((prevData) => ({
        ...prevData,
        items: updateItemsFood,
      }));
      return;
    }
    if(_.includes(['premium', 'standard'], _.lowerCase(name))){
      setFormData((prevData) => ({
        ...prevData,
        type: _.lowerCase(name),
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
      description: formData.description,
      price: _.parseInt(_.replace(formData.price, /,/g, '')),
      customerNumber: _.parseInt(formData.customerNumber),
      images: formData.images,
      items: formData.items,
      type: formData.type + _.parseInt(formData.customerNumber)
    };

    try {
      let createMenu = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/menu`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      createMenu = createMenu?.data;
      if (createMenu?.code === 1000) {
        setToastInfo({
          type: 'success',
          message: 'Tạo thành công',
        });
      } else {
        setToastInfo({
          type: 'error',
          message: 'Tạo thất bại',
        });
      }
      setOpenToast(true);
    } catch (error) {
      console.log(`ERROR when call update homestay ${error.message} -- ${JSON.stringify(error)}`);
      setToastInfo({
        type: 'error',
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
  }, []);

  return (
    <Box>
      <Box mt={3}>
        <form onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
              Thông tin Menu
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
            <Box mt={3}>
              <TextField
                fullWidth
                label="Mô tả"
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box mt={3}>
              <TextField
                fullWidth
                label="Giá"
                variant="outlined"
                name="price"
                value={numeral(formData.price).format('0,0')}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box mt={3}>
              <TextField
                fullWidth
                label="Số người"
                variant="outlined"
                name="customerNumber"
                value={formData.customerNumber}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
            <Box mt={3}>
              <FormControlLabel
                control={<Checkbox checked={formData.type === 'premium'} onChange={handleChange} name="premium" />}
                label="Premium"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.type === 'standard'} onChange={handleChange} name="standard" />}
                label="Standard"
              />
            </Box>
          </Box>
          <Box mt={3}>
            <Divider style={{ border: '1px solid', width: '100%' }} />
          </Box>

          <Box mt={3}>
            <Typography variant="h5" color="#1877F2" align="left" gutterBottom>
            Danh sách đồ ăn
            </Typography>
            {_.map(formData.items, (food, index) => (
              <Grid2 container spacing={2} display="flex" alignItems="center" mt={3}>
                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Tên món"
                    variant="outlined"
                    name={`foodName-${index}`}
                    value={food.name}
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
                        items: _.filter(prevData.items, (item, idx) => idx !== index),
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
                    items: [...prevData.items, { name: '' }],
                  }));
                }}
                variant="contained"
                color="primary"
              >
                + Thêm món ăn
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
              Tạo
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
