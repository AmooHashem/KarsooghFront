import React, { useState, useEffect } from 'react';
import Announcement from '../../components/Cards/Notification';
import {
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '90vh',
    width: '100wh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  announcements: {
    height: '55vh',
    borderRadius: '5px',
    backgroundColor: 'rgba(76, 173, 211, 70%)',
    overflowY: 'scroll',
    margin: 15,
    boxShadow: '-5px 5px 20px #62b1d1',
  },
  title: {
    fontSize: 60,
    color: '#fbebd1',
    textShadow: '-2px 2px #888',
    [theme.breakpoints.down('sm')]: {
      fontSize: 40,
    },
  },
  header3: {
    fontSize: 25,
    lineHeight: '30px',
    backgroundColor: '#d1d1d1',
    textShadow: '-1px 1px #888',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fbebd1',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
  normalText: {
    textAlign: 'justify',
    color: '#fbebd1',
  }
}));

const AnnouncementsTab = ({ status, isRegistrationCompleted, didPaymentFail }) => {
  const classes = useStyles();

  return (
    <Container style={{ overflow: 'hidden' }}>
      <div className={`dashboard-background blur`} />
      <Grid
        className={classes.root}
        container
        justify='center'
        alignItems='center'
        spacing={4}
      >
        <Grid item container justify='center'>
          <Typography variant='h2' className={classes.title} >
            {'اطلاعیه‌ها'}
          </Typography>
        </Grid>
        <Grid
          xs={12} sm={8}
          className={`${classes.announcements} announcements`}
          item container
          justify='center'
          alignItems='center'
          spacing={2}>

          {didPaymentFail &&
            < Grid item xs={12}>
              <Announcement title='ای بابا!' date='همین چند لحظه پیش' image='ohDad.png' text='به نظر می‌رسه که پرداختت با موفقیت به پایان نرسیده. اگه پولی از حسابت کم شده ولی ثبت‌نامت نهایی نشده، به ادمینِ کاروسق توی بله، اینستاگرام یا تلگرام پیام بده تا پیگیری کنیم :)' />
            </Grid>
          }
          {isRegistrationCompleted &&
            <Grid item xs={12}>
              <Announcement title='ثبت‌نامت تکمیله!' date='' image='greenCheck.png' text='ایول! ثبت‌نامت برای دوره‌ی تابستونه با موفقیت انجام شد.' />
            </Grid>
          }

          <Grid item xs={12}>
            <Announcement title='دوره تابستونه' date='۵ خرداد ۱۴۰۰' image='announcement.jpg' text='بالاخره نتایج مرحله دو اومد! اگه تو این مرحله قبول شده باشی، می‌تونی برای دوره‌ی تابستونه ثبت‌نام کنی. به امید این که هر چه زودتر (هرچند به صورت مجازی) ببینیمت!' />
          </Grid>

          <Grid item xs={12}>
            <Announcement title='کارسوق سال آینده؟' date='۱۸ خرداد ۱۴۰۰' image='survey.png' linkURL='https://docs.google.com/forms/d/e/1FAIpQLSdCvuKqnwX00I-MyL6zV2uQjmfAYtYRQDqe1255HM0GZmqHlA/viewform?usp=sf_link' linkText='لینک فرم'
              text='به نظرتون برای بهترشدن کارسوق سال آینده چه کارایی میشه کرد؟ خوبه که اگه نظری دارین، تو فرمی که لینکش این پایین اومده برامون بنویسین. همینطور اگه دوست دارین تا سال آینده به عنوان کارسوقمند در کنارمون باشین، اسمتون رو توی این فرم بنویسین!' />
          </Grid>

        </Grid>
      </Grid>
    </Container >
  );
};

const mapStateToProps = (state, ownProps) => ({
  status: state.account.info
    ? state.account.info.status
    : 0,
  isFetching: state.account.isFetching,
  isRegistrationCompleted: ownProps.isRegistrationCompleted,
  didPaymentFail: ownProps.didPaymentFail,
})

export default connect(mapStateToProps, {})(AnnouncementsTab);
