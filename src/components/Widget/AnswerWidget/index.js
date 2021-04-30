import { Button, makeStyles, Paper, Typography, Grid } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import TinyPreview from '../../tiny_editor/react_tiny/Preview';
import TinyEditorComponent from '../../tiny_editor/react_tiny/TinyEditorComponent';
import {
  DescriptionOutlined as DescriptionOutlinedIcon,
} from '@material-ui/icons';
import jMoment from 'jalali-moment';
import {
  getPreviousAnswer,
  sendAnswer,
} from '../../../redux/actions/exam'

const BASE_URL_OF_FILES_ON_DATABASE = 'https://backend.interkarsolar.ir/media/'
const INSTEAD_OF_BLANK = 'پاسخت به این سوال رو یا به صورت متن این‌جا تایپ کن، یا در قالب یک فایل بارگذاریش کن.';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  lastUploadButton: {
    fontSize: 10,
    color: '#334499',
    '& .MuiButton-endIcon': {
      marginLeft: 2,
      '& > *:first-child': {
        fontSize: 11,
      },
    },
  },
}));

const AnswerWidget = ({
  isFetching,
  finishDate,
  getPreviousAnswer,
  sendAnswer,
  qc_id,
  text,
}) => {
  const classes = useStyles();
  const [editor, setEditor] = useState();
  const [previousFileAnswer, setPreviousFileAnswer] = useState();
  const [fileAnswer, setFileAnswer] = useState();
  const [textAnswer, setTextAnswer] = useState(INSTEAD_OF_BLANK);
  const [inputFileID,] = useState(`file-answer-${Math.random()}`);

  const doSendAnswer = () => {
    const newText = textAnswer.replace(/\\/g, '/').replace(/"/g, '\'');
    console.log(textAnswer)
    sendAnswer(fileAnswer, newText ? newText : INSTEAD_OF_BLANK, qc_id);
  }

  const clearInputFile = () => {
    document.getElementById(inputFileID).value = '';
    setFileAnswer('');
  }

  const onChangeFile = async (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      if (e.target.files[0].size <= 10e6) {
        setFileAnswer(e.target.files[0]);
      } else {
        e.target.value = '';
        e.target.setCustomValidity('اندازه‌ی فایلت خیلی بیشتر از ۸ مگابایته!');
        e.target.reportValidity();
      }
    }
  };

  useEffect(() => {
    clearInputFile();
    const fetchPreviousAnswers = async () => {
      const action = await getPreviousAnswer(qc_id);
      if (!action) return;
      if (action.res_code === 602) {
        setPreviousFileAnswer('');
        setEditor(<TinyEditorComponent initialValue={INSTEAD_OF_BLANK} onChange={setTextAnswer} />);
        return;
      }

      console.log(action)
      setPreviousFileAnswer(action.data.file ? BASE_URL_OF_FILES_ON_DATABASE + action.data.file : '');
      setEditor(<TinyEditorComponent initialValue={action.data.answer} onChange={setTextAnswer} />);
    }
    if (qc_id) {
      fetchPreviousAnswers();
    }
  }, [qc_id,])



  return (
    <Paper className={classes.paper}>
      <Grid container justify='center' spacing={1}>
        <Grid item xs={12}>
          <TinyPreview
            frameProps={{
              frameBorder: '0',
              scrolling: 'no',
              width: '100%',
            }}
            content={text}
          />
        </Grid>
        <Grid item xs={12}>
          {editor}
        </Grid>
        <Grid item container xs={12} sm={6} justify='center' alignItems='center'>
          <Grid item container justify='flex-start' alignItems='center'>
            <input
              id={inputFileID}
              accept="application/pdf,image/*"
              type="file"
              onChange={onChangeFile}
            />
            {!previousFileAnswer &&
              <Typography variant='caption'>
                حداکثر حجم فایل ارسالی ۸ مگابایته.
              </Typography>
            }
          </Grid>
          {previousFileAnswer &&
            <Grid item container justify='center' alignItems='center'>
              <Button
                size="small"
                endIcon={<DescriptionOutlinedIcon />}
                className={classes.lastUploadButton}
                href={previousFileAnswer}
                component="a"
                download
                target="_blank">
                آخرین فایل ارسالی
              </Button>
            </Grid>
          }
        </Grid>
        <Grid item container xs={12} sm={6} justify='center' alignItems='center'>
          <SubmitButton finishDate={finishDate} isFetching={isFetching} doSendAnswer={doSendAnswer} />
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  qc_id: ownProps.qc_id,
  finishDate: ownProps.finishDate,
  isFetching: state.exam.isFetching,
})

export default connect(
  mapStateToProps,
  {
    getPreviousAnswer,
    sendAnswer,
  }
)(AnswerWidget);


const SubmitButton = ({ isFetching, finishDate, doSendAnswer }) => {
  const [isExamFinished, setExamFinishStatus] = useState(false);

  // useEffect(() => {
  //   if (finishDate) {
  //     setInterval(() => {
  //       setExamFinishStatus(jMoment().isAfter(jMoment(finishDate)))
  //     }, 1000)
  //   }
  // }, [finishDate])

  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      disabled={isFetching || isExamFinished}
      onClick={doSendAnswer}>
      {isExamFinished ? 'وقت آزمون تمام شده' : 'ذخیره جواب'}
    </Button>
  )
}