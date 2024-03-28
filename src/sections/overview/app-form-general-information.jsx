/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars, import/no-extraneous-dependencies
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import {
  Box,
  Grid,
  Button,
  TextField,
  Container,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import ImageUpdateForm from '../products/homestay-images';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

// ----------------------------------------------------------------------

export default function AppFormGeneralInformation() {
  const [formData, setFormData] = useState({
    facebook: '',
    tiktok: '',
    phoneNumber: '',
    zalo: '',
    images: [],
    servingTime: [],
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    _.set(formData, name, value);
    setFormData(formData);
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
    console.log('\n - handleChange - formData:', formData);
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

    try {
      const data = {
        facebook: formData.facebook,
        tiktok: formData.tiktok,
        phoneNumber: formData.phoneNumber,
        zalo: formData.zalo,
        images: formData.images,
      };
      let updateInfo = await axios.post(
        'https://molly-patient-trivially.ngrok-free.app/siteInfo/update',
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      updateInfo = updateInfo?.data;
      if (updateInfo?.code === 1000) {
        setToastInfo({
          type: 'success',
          message: 'Cập nhật thành công',
        });
        setOpenToast(true);
      } else {
        setToastInfo({
          type: 'error',
          message: 'Cập nhật thất bại',
        });
        setOpenToast(true);
      }
    } catch (error) {
      console.log(`ERROR when call get general info ${error.message} -- ${JSON.stringify(error)}`);
      setToastInfo({
        type: 'error',
        message: 'Cập nhật thất bại',
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
    const fetchInfo = async () => {
      try {
        let info = await axios.post('https://molly-patient-trivially.ngrok-free.app/siteInfo');
        info = info?.data;
        if (info?.code === 1000) {
          setFormData(info?.data);
        }
      } catch (error) {
        console.log(
          `ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`
        );
        setFormData({
          facebook: 'Link facebook',
          tiktok: 'Link tiktok',
          phoneNumber: 'Số điện thoại',
          zalo: 'Số zalo',
          images: [],
        });
      }
    };
    fetchInfo();
  }, []);

  return (
    <Container maxWidth="md" style={{ width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <Grid xs={6} md={6} lg={6}>
          <Box mt={3}>
            <TextField
              fullWidth
              label="Link FB"
              variant="outlined"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Grid>

        <Grid xs={6} md={6} lg={6}>
          <Box mt={3}>
            <TextField
              fullWidth
              label="Link Tiktok"
              variant="outlined"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Grid>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Số điện thoại liên hệ"
            variant="outlined"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
          />
        </Box>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Số điện thoại Zalo"
            variant="outlined"
            name="zalo"
            value={formData.zalo}
            onChange={handleChange}
            margin="normal"
          />
        </Box>

        {/* List of reserve time */}

        <Box mt={3}>
          <Typography variant="h5" fontWeight="normal" color="#1877F2" align="left" gutterBottom>
            Thời gian phục vụ
          </Typography>
          {_.map(formData.servingTime, (time, index) => (
            <Grid2 container spacing={2} display="flex" justifyContent="center" mt={3}>
              <Typography
                style={{ marginTop: '25px', marginRight: '25px' }}
                variant="h7"
                align="left"
                gutterBottom
              >
                Khung giờ 1 :
              </Typography>
              <Grid2 xs={4} md={4} sm={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Thời gian bắt đầu"
                    variant="outlined"
                    type="time"
                    value={time.from}
                    name={`servingTime[${index}].from`}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        step: 1800, // 5 minutes
                      },
                    }}
                  />
                </Box>
              </Grid2>
              <Grid2 xs={2} md={2} sm={2} display="flex" justifyContent="center">
                <Box display="flex" justifyContent="center">
                  {' '}
                  <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px' }}>
                    {' '}
                    -{' '}
                  </p>{' '}
                </Box>
              </Grid2>

              <Grid2 xs={4} md={4} sm={4}>
                <Box>
                  <TextField
                    fullWidth
                    label="Thời gian kết thúc"
                    variant="outlined"
                    type="time"
                    name={`servingTime[${index}].to`}
                    value={time.to}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        step: 1800, // 5 minutes
                      },
                    }}
                  />
                </Box>
              </Grid2>
            </Grid2>
          ))}
        </Box>

        <Box mt={3}>
          <Divider style={{ border: '1px solid', width: '100%' }} />
        </Box>
        <Box mt={3}>
          <Typography variant="h5" fontWeight="normal" color="#1877F2" align="left" gutterBottom>
            Hình ảnh Banner
          </Typography>
          <ImageUpdateForm onChange={onChangeImages} imagesData={formData.images} />
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>

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
    </Container>
  );
}
