import React from 'react'
import { useFormik } from 'formik'
import {
  setHours,
  setMinutes,
  isBefore,
  differenceInMinutes,
  format,
} from 'date-fns'
import api from '../services/api'

function addTime(date, time) {
  return setMinutes(setHours(date, +time.split(':')[0]), +time.split(':')[1])
}

function formValidate(date, values) {
  const startDateDay = addTime(date, values.startTimeDay)
  const startDateLunch = addTime(date, values.startTimeLunch)
  const endDateLunch = addTime(date, values.endTimeLunch)
  const endDateDay = addTime(date, values.endTimeDay)

  let errors = {}

  if (!values.startTimeDay) {
    errors.startTimeDay = 'Required'
  } else if (values.startTimeLunch && !isBefore(startDateDay, startDateLunch)) {
    errors.startTimeDay = 'Date invalid'
    errors.startTimeLunch = 'Date invalid'
  }

  if (!values.startTimeLunch) {
    errors.startTimeLunch = 'Required'
  } else if (values.endTimeLunch && !isBefore(startDateLunch, endDateLunch)) {
    errors.startTimeLunch = 'Date invalid'
    errors.endTimeLunch = 'Date invalid'
  }

  if (!values.endTimeLunch) {
    errors.endTimeLunch = 'Required'
  } else if (values.endTimeDay && !isBefore(endDateLunch, endDateDay)) {
    errors.endTimeLunch = 'Date invalid'
    errors.endDateDay = 'Date invalid'
  }

  if (!values.endTimeDay) {
    errors.endTimeDay = 'Required'
  }

  return errors
}

function calculateWorkedTime(date, values) {
  const startDateDay = addTime(date, values.startTimeDay)
  const startDateLunch = addTime(date, values.startTimeLunch)
  const endDateLunch = addTime(date, values.endTimeLunch)
  const endDateDay = addTime(date, values.endTimeDay)

  const workedTimeInMinutes =
    differenceInMinutes(startDateLunch, startDateDay) +
    differenceInMinutes(endDateDay, endDateLunch)

  return {
    totalMinutes: workedTimeInMinutes,
    hours: Math.floor(workedTimeInMinutes / 60),
    minutes: workedTimeInMinutes % 60,
  }
}

function getFormattedWorkedTime(workedTime) {
  console.log('Worked Time:', workedTime)

  const workedTimeClass =
    workedTime.totalMinutes === 480
      ? 'worked-time--equal'
      : workedTime.totalMinutes > 480
      ? 'worked-time--more'
      : 'worked-time--less'

  return workedTime.totalMinutes ? (
    <span className={workedTimeClass}>
      {`Worked Hours: ` +
        `${workedTime.hours}`.padStart(2, '0') +
        `:` +
        `${workedTime.minutes}`.padStart(2, '0')}
    </span>
  ) : null
}

const ScheduleForm = ({ date, onSubmit }) => {
  const form = useFormik({
    initialValues: {
      startTimeDay: '',
      startTimeLunch: '',
      endTimeLunch: '',
      endTimeDay: '',
    },
    validate: values => formValidate(date, values),
    onSubmit: values => {
      const startDay = addTime(date, values.startTimeDay)
      const startLunch = addTime(date, values.startTimeLunch)
      const endLunch = addTime(date, values.endTimeLunch)
      const endDay = addTime(date, values.endTimeDay)

      const dateFormatted = format(date, 'yyyy-MM-dd')

      api
        .post('/schedules', {
          date: dateFormatted,
          startDay,
          startLunch,
          endLunch,
          endDay,
        })
        .then(res => {
          console.log('Response:', res)
        })
        .catch(res => {
          console.log('Error response:', res)
        })
    },
  })

  const workedTimeFormatted = form.isValid
    ? getFormattedWorkedTime(calculateWorkedTime(date, form.values))
    : ''

  return (
    <form className="schedule-form" onSubmit={form.handleSubmit}>
      <div className="form-control">
        <label htmlFor="startTimeDay">Arrival Time:</label>
        <input
          name="startTimeDay"
          type="time"
          {...form.getFieldProps('startTimeDay')}
        />
        {form.touched.startTimeDay && form.errors.startTimeDay ? (
          <span className="has-error">{form.errors.startTimeDay}</span>
        ) : null}
      </div>
      <div className="form-control">
        <label htmlFor="startTimeLunch">Start Lunch Time:</label>
        <input
          name="startTimeLunch"
          type="time"
          {...form.getFieldProps('startTimeLunch')}
        />
        {form.touched.startTimeLunch && form.errors.startTimeLunch ? (
          <span className="has-error">{form.errors.startTimeLunch}</span>
        ) : null}
      </div>
      <div className="form-control">
        <label htmlFor="endTimeLunch">End Lunch Time:</label>
        <input
          name="endTimeLunch"
          type="time"
          {...form.getFieldProps('endTimeLunch')}
        />
        {form.touched.endTimeLunch && form.errors.endTimeLunch ? (
          <span className="has-error">{form.errors.endTimeLunch}</span>
        ) : null}
      </div>
      <div className="form-control">
        <label htmlFor="endTimeDay">Departure Time:</label>
        <input
          name="endTimeDay"
          type="time"
          {...form.getFieldProps('endTimeDay')}
        />
        {form.touched.endTimeDay && form.errors.endTimeDay ? (
          <span className="has-error">{form.errors.endTimeDay}</span>
        ) : null}
      </div>
      <p>{form.isValid ? workedTimeFormatted : ''}</p>
      <button className="button" type="submit">
        Save
      </button>
    </form>
  )
}

export default ScheduleForm
