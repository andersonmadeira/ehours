import React from 'react'
import { useFormik } from 'formik'
import { setHours, setMinutes, isBefore } from 'date-fns'

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
      if (onSubmit) {
        onSubmit(values)
      }
    },
  })

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
      <button className="button" type="submit">
        Save
      </button>
    </form>
  )
}

export default ScheduleForm
