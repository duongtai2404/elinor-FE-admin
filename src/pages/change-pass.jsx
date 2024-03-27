// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { ChangePassView } from 'src/sections/changePass';


// ----------------------------------------------------------------------

export default function ChangePassPage() {

  return (
    <>
      <Helmet>
        <title> PayME </title>
      </Helmet>

      <ChangePassView />
    </>
  );
}

// ChangePassPage.propTypes = {
// };
