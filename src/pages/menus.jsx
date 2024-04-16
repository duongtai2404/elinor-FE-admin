/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import 'moment/locale/vi';
// eslint-disable-next-line unused-imports/no-unused-imports, no-unused-vars, import/no-extraneous-dependencies
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import numeral from 'numeral';
import MenuCreate from '../sections/menu/menu-create';
import ImageUpdateForm from '../sections/products/homestay-images';
// ----------------------------------------------------------------------

export default function HomeStayList() {
  // danh sách menu chung
  const [menuList, setMenuList] = useState([]);
  // danh sách menu theo số khách hàng
  const [menuByPeople, setMenuByPeople] = useState([]);
  // menu được chọn
  const [selectedMenu, setSelectedMenu] = useState({});
  const [homestay, setHomeStay] = useState([]);
  const [selectHomeStay, setSelectHomeStay] = useState({});
  const [selectRoomTitle, setSelectRoomTitle] = useState('');
  const [isShowCreateHomeStay, setIsShowCreateHomeStay] = useState(false);
  const [openConfirmDeleted, setOpenConfirmDeleted] = useState(false);

  // số khách hàng
  const [numPeople, setNumPeople] = useState(2);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý dữ liệu tại đây
    const data = {
      id: selectedMenu.id,
      name: formData.name,
      description: formData.description,
      price: _.parseInt(_.replace(formData.price, /,/g, '')),
      customerNumber: _.parseInt(formData.customerNumber),
      images: formData.images,
      items: formData.items,
      type: formData.type + _.parseInt(formData.customerNumber)
    };

    try {
      let updateMenu = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/menu`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      updateMenu = updateMenu?.data;
      if (updateMenu?.code === 1000) {
        setToastInfo({
          type: 'success',
          message: 'Cập nhật thành công',
        });
        await fetchMenu();
      } else {
        setToastInfo({
          type: 'error',
          message: 'Cập nhật thất bại',
        });
      }
      setOpenToast(true);
    } catch (error) {
      console.log(`ERROR when call update homestay ${error.message} -- ${JSON.stringify(error)}`);
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


  // filter menu theo số người
  const handleChangeMenu = (e) => {
    const selectedMenuId = e.target.value;
    const selectedMenuByUser = _.find(menuByPeople, { id: selectedMenuId});
    setSelectedMenu(selectedMenuByUser);
    setFormData({
      id: selectedMenuByUser?.id,
      name: selectedMenuByUser?.name,
      description: selectedMenuByUser?.description,
      price: selectedMenuByUser?.price,
      customerNumber: selectedMenuByUser?.customerNumber,
      images: selectedMenuByUser?.images,
      items: selectedMenuByUser?.items,
      type: selectedMenuByUser?.type
    });
  }

  // filter menu theo số người
  const handleChangeNumPeople = (e) => {
    const selectedNumPeople = e.target.value;
    setNumPeople(selectedNumPeople);
    setMenuByPeople(menuList[selectedNumPeople]);
  }

  // xóa menu
  const deletedMenu = async () => {
    try {
      const data = {
        id: selectedMenu.id,
        isDeleted: true,
      };
      let deletedResult = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/menu`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setOpenConfirmDeleted(false);
      deletedResult = deletedResult?.data;
      if (deletedResult?.code === 1000) {
        window.location.reload();
      } else {
        setToastInfo({
          type: 'error',
          message: 'Xóa thất bại',
        });
        setOpenToast(true);
      }
    } catch (error) {
      console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
      setOpenConfirmDeleted(false);
      setToastInfo({
        type: 'error',
        message: 'Xóa thất bại',
      });
      setOpenToast(true);
    }
  };
  const onCloseConfirmDelete = () => {
    setOpenConfirmDeleted(false);
  };

  // lấy thông tin toàn bộ menu
  const fetchMenu = async () => {
    try {
      let menuListResult = await axios.post(
        `${import.meta.env.VITE_URL_BACKEND || 'https://molly-patient-trivially.ngrok-free.app'}/menu/search`
      );
      menuListResult = menuListResult?.data;
      if (menuListResult?.code === 1000) {
        let data = _.map(menuListResult?.data, (item) => ({
          ..._.pick(item, ['name', 'price', 'images', 'items', 'description', 'customerNumber', 'id']),
          type: _.replace(item.type, /\d/g, '')
        }));
        data = _.groupBy(data, 'customerNumber');

        setMenuList(data);
        setMenuByPeople(data[numPeople || 2])
      }
    } catch (error) {
      console.log(`ERROR when call get list menu ${error.message} -- ${JSON.stringify(error)}`);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Grid2 container spacing={2}>
          <Grid2 xs={3} md={3} sm={2} display="flex" justifyContent="flex-start">
            <Typography variant="h4" align="center">
              {isShowCreateHomeStay ? 'Tạo Menu' : 'Quản lý Menu'}
            </Typography>
          </Grid2>
          <Grid2 xs={9} md={9} sm={9} display="flex" justifyContent="flex-end">
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                fetchMenu();
                setIsShowCreateHomeStay(false);
              }}
              variant="contained"
              color="primary"
            >
              Quản lý
            </Button>
            <Button
              onClick={() => {
                setIsShowCreateHomeStay(true);
              }}
              variant="contained"
              color="success"
            >
              Tạo
            </Button>
          </Grid2>
        </Grid2>
      </Box>
      {isShowCreateHomeStay ? (
        <MenuCreate />
      ) : (
        <>
          <Box mt={3}>
            <FormControl style={{width: '75%', marginRight: '30px'}} variant="outlined" >
              <InputLabel id="room-select-label">Danh sách Menu</InputLabel>
              <Select
                labelId="room-select-label"
                id="room-select"
                label="Danh sách Menu"
                value={selectedMenu.id}
                onChange={handleChangeMenu}
              >
                {menuByPeople.map((room, index) => (
                  <MenuItem key={index} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{width: '20%'}} variant="outlined">
                <InputLabel id="room-select-label">Số người</InputLabel>
                <Select
                  labelId="room-select-label"
                  id="room-select"
                  label="Số người"
                  value={numPeople}
                  onChange={handleChangeNumPeople}
                >
                  {[1,2,3,4,5,6,7,8].map((room, index) => (
                    <MenuItem key={index} value={room}>
                      {room}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Box>

          {/* <Box mt={3}>
            
          </Box> */}

          <Box mt={3}>
            <Divider style={{ border: '1px solid', width: '100%' }} />
          </Box>

          {!_.isEmpty(selectedMenu) && (
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
                          items: [...prevData.items, {name: ''}],
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenConfirmDeleted(true);
                    }}
                    color="error"
                    style={{ marginRight: '10px' }}
                  >
                    Xóa
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Cập nhật
                  </Button>
                </Box>
              </form>
            </Box>
          )}

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

          <Dialog open={openConfirmDeleted} onClose={onCloseConfirmDelete} fullWidth maxWidth="xs">
            <DialogTitle style={{ fontWeight: 'normal' }}>
              Bạn có chắc chắn muốn xóa Menu này ?
            </DialogTitle>
            <DialogContent>{/* Nội dung khác có thể thêm vào đây nếu cần */}</DialogContent>
            <DialogActions>
              <Button onClick={onCloseConfirmDelete} color="primary">
                Không
              </Button>
              <Button onClick={() => deletedMenu()} color="error" variant="contained">
                Có
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}
