import React, { useState, useEffect } from 'react'
import {
  getDaysInMonth,
  getMonth,
  getYear,
  format,
  getDay,
  addMonths,
  subMonths,
  isAfter,
  isToday,
  startOfMonth,
  endOfMonth,
  getDate,
  toDate,
  parse,
} from 'date-fns'
import classNames from 'classnames'
import api from '../services/api'
import { parseISO } from 'date-fns/esm'

function getMonthDateElements(date, monthSchedules, onSelect) {
  const activeMonth = getMonth(date)
  const activeYear = getYear(date)
  const startMonth = getDay(new Date(activeYear, activeMonth, 1))
  const startStyle = { gridColumn: startMonth + 1 }

  return [...new Array(getDaysInMonth(date))].map((d, i) => {
    const isFuture = isAfter(
      new Date(activeYear, activeMonth, i + 1),
      new Date(),
    )

    const isDateToday = isToday(new Date(activeYear, activeMonth, i + 1))

    const btnClasses = classNames({
      future: isFuture,
      today: isDateToday,
      schedule: monthSchedules[i] !== undefined,
      'schedule--up':
        monthSchedules[i] !== undefined &&
        monthSchedules[i].workedMinutes > 480,
      'schedule--down':
        monthSchedules[i] !== undefined &&
        monthSchedules[i].workedMinutes < 480,
    })
    const dateString = `${activeYear}-${activeMonth + 1}-${i + 1}`

    return (
      <button
        key={i}
        className={btnClasses}
        style={i === 0 ? startStyle : null}
        onClick={!isFuture ? () => onSelect(new Date(dateString)) : null}
      >
        <time dateTime={`${dateString}`}>{i + 1}</time>
      </button>
    )
  })
}

const Calendar = ({ date = new Date(), onSelect, onChange, ...otherProps }) => {
  const [pivotDate, setPivotDate] = useState(date)
  const [monthSchedules, setMonthSchedules] = useState({})

  useEffect(() => {
    const min = format(startOfMonth(pivotDate), 'yyyy-MM-dd'),
      max = format(endOfMonth(pivotDate), 'yyyy-MM-dd'),
      params = `?min=${min}&max=${max}`

    api.get(`/schedules/${params}`).then(res => {
      console.log(res.data)
      setMonthSchedules(
        res.data.reduce((acc, current) => {
          console.log(current.date)
          console.log(parseISO(current.date))
          console.log(parseISO(current.date) - 1)
          return {
            ...acc,
            [getDate(parseISO(current.date)) - 1]: current,
          }
        }, {}),
      )
    })
  }, [pivotDate])

  return (
    <div className="card" {...otherProps}>
      <div className="calendar">
        <div className="calendar__month">
          <span
            onClick={() => {
              const newDate = subMonths(pivotDate, 1)
              if (onChange) onChange(newDate)
              setPivotDate(newDate)
            }}
          >
            &#8249;
          </span>
          <h5>
            {format(pivotDate, 'yyyy')} {format(pivotDate, 'LLLL')}
          </h5>
          <span
            onClick={() => {
              const newDate = addMonths(pivotDate, 1)
              if (onChange) onChange(newDate)
              setPivotDate(addMonths(pivotDate, 1))
            }}
          >
            &#8250;
          </span>
        </div>
        <div className="calendar__days-of-week">
          <span>sun</span>
          <span>mon</span>
          <span>tue</span>
          <span>wed</span>
          <span>thu</span>
          <span>fri</span>
          <span>sat</span>
        </div>
        <div className="calendar__dates">
          {getMonthDateElements(pivotDate, monthSchedules, onSelect)}
        </div>
      </div>
    </div>
  )
}

export default Calendar
