import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Thông tin chung',
    path: '/',
    icon: icon('ic_home'),
  },
  // {
  //   title: 'user',
  //   path: '/user',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'Sảnh',
    path: '/homestay',
    icon: icon('ic_hotel'),
  },
  {
    title: 'Menu',
    path: '/menu',
    icon: icon('ic_menu'),
  },
  {
    title: 'Booking',
    path: '/booking',
    icon: icon('ic_booking'),
  },
  {
    title: 'Thống kê',
    path: '/statistic',
    icon: icon('ic_chart'),
  },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
