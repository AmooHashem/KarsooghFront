import { Button, Icon, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../../../redux/actions/account';

const useStyles = makeStyles(() => ({
  iconImage: {
    maxHeight: '20px',
    width: '100%',
  },
}));

function LogoutButton({ logout }) {
  const classes = useStyles();
  return (
    <Button
      variant="outlined"
      onClick={logout}
    // startIcon={
    //   <Icon>
    //     <img
    //       src={`${process.env.PUBLIC_URL}/ZeroJourneyer/IconImages/logout.png`}
    //       alt="iconImage"
    //       className={classes.iconImage}
    //     />
    //   </Icon>
    // }
    >
      <Typography variant="caption">{'خروج'}</Typography>
    </Button>
  );
}

export default connect(null, { logout })(LogoutButton);
