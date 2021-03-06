import React from 'react';
import _ from 'lodash';
import {
  Button,
  Container,
  makeStyles,
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PersonCard from '../../components/Cards/PersonCard'
import { Staff as StaffInfo, subteams } from './StaticData';
import ResponsiveAppBar from '../../components/Appbar/ResponsiveAppBar';
import Footer from '../../components/Footer/Footer';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    background: 'linear-gradient(90deg, rgba(118,155,200,1) 0%, rgba(109,167,209,1) 15%, rgba(202,242,242,1) 100%);',
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    lineHeight: '80px',
    color: '#0d0e2d',
    marginBottom: 30,
    textShadow: '-2px 2px #888',
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      lineHeight: '40px',
    },
  },
  subtitle: {
    fontSize: 30,
    // lineHeight: '40px',
    color: '#150f40',
    textShadow: '-1px 1px #888',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      // marginBottom: theme.spacing(3),
    },
  },
  paper: {
    background: '#f8f1f1',
    padding: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(4),
  },
}));

function Staff() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Grid container direction='row'>
        <Grid container item direction='column'>
          <Grid item>
            <Typography variant='h2' align='center' className={classes.title}>
              «اینترکارسولاری‌ها»
            </Typography>
          </Grid>
          <Grid container item direction='column' spacing={4} alignItems='center'>
            {
              subteams.map((subteam) => {
                return (
                  <>
                    <Grid item>
                      <Typography variant='h4' align='center' className={classes.subtitle}>
                        {subteam.name}
                      </Typography>
                    </Grid>
                    <Grid container item direction='row' spacing={2} justify='center'>
                      {
                        StaffInfo.filter((staff) => staff.subteam == subteam.id).map((staff) => {
                          return (
                            <Grid container item xs={12} sm={4} md={3} justify='center'>
                              <PersonCard
                                name={staff.name}
                                position={staff.position}
                                description={staff.description}
                                image={staff.image} />
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                  </>
                )
              })
            }
          </Grid>
          <Grid item style={{ marginTop: '20px' }}>
            <Footer />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
});

export default connect(
  mapStateToProps
  , {}
)(Staff);
