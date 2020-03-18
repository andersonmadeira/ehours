import React, { useState } from 'react'
import {
  getDaysInMonth,
  getMonth,
  getYear,
  format,
  getDay,
  addMonths,
  subMonths,
  isAfter,
  getDate,
  isToday,
  isEqual,
} from 'date-fns'
import classNames from 'classnames'

function getMonthDateElements(date, onSelectDate) {
  const activeMonth = getMonth(date)
  const activeYear = getYear(date)
  const activeDay = getDate(date)
  const startMonth = getDay(new Date(activeYear, activeMonth, 1))
  const startStyle = { gridColumn: startMonth + 1 }

  return [...new Array(getDaysInMonth(date))].map((d, i) => {
    const isFuture = isAfter(
      new Date(activeYear, activeMonth, i + 1),
      new Date(),
    )

    const isDateToday = isToday(new Date(activeYear, activeMonth, i + 1))
    const isDateSelected = isEqual(
      date,
      new Date(activeYear, activeMonth, i + 1),
    )

    const btnClasses = classNames({
      future: isFuture,
      today: isDateToday,
      selected: isDateSelected,
    })
    const dateString = `${activeYear}-${activeMonth + 1}-${i + 1}`

    return (
      <button
        key={i}
        className={btnClasses}
        style={i === 0 ? startStyle : null}
        onClick={!isFuture ? () => onSelectDate(new Date(dateString)) : null}
      >
        <time dateTime={`${dateString}`}>{i + 1}</time>
      </button>
    )
  })
}

const Calendar = ({ date = new Date(), onPickDate, ...otherProps }) => {
  const [activeDate, setActiveDate] = useState(date)

  return (
    <div className="card" {...otherProps}>
      <div className="calendar">
        <div className="calendar__month">
          <span onClick={() => setActiveDate(subMonths(activeDate, 1))}>
            &#8249;
          </span>
          <h5>
            {format(activeDate, 'yyyy')} {format(activeDate, 'LLLL')}
          </h5>
          <span onClick={() => setActiveDate(addMonths(activeDate, 1))}>
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
          {getMonthDateElements(activeDate, date => {
            setActiveDate(date)
            if (onPickDate) onPickDate(date)
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar
