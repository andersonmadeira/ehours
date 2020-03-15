import React, { useState } from 'react'
import {
  getDaysInMonth,
  getMonth,
  getYear,
  format,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'

function getMonthDateElements(date) {
  const activeMonth = getMonth(date)
  const activeYear = getYear(date)
  const startMonth = getDay(date)
  const startStyle = { gridColumn: startMonth + 1 }

  return [...new Array(getDaysInMonth(date))].map((d, i) => {
    return (
      <button key={i} style={i === 0 ? startStyle : null}>
        <time
          dateTime={
            `
        ${activeYear}-` +
            `${activeMonth} + 1)`.padStart(2, '0') +
            `-${i + 1}`
          }
        >
          {i + 1}
        </time>
      </button>
    )
  })
}

const Calendar = ({ date = new Date(), ...otherProps }) => {
  const [activeDate, setActiveDate] = useState(date)

  return (
    <div className="card" {...otherProps}>
      <div className="calendar">
        <div className="calendar__year">
          <h3>{format(activeDate, 'yyyy')}</h3>
        </div>
        <div className="calendar__month">
          <span onClick={() => setActiveDate(subMonths(activeDate, 1))}>
            &#8249;
          </span>
          <h4>{format(activeDate, 'LLLL')}</h4>
          <span onClick={() => setActiveDate(addMonths(activeDate, 1))}>
            &#8250;
          </span>
        </div>
        <div className="calendar__days-of-week">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>
        <div className="calendar__dates">
          {getMonthDateElements(activeDate)}
        </div>
      </div>
    </div>
  )
}

export default Calendar
