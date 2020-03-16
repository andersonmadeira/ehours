import React from 'react'
import Calendar from './components/Calendar'

const App = () => {
  return (
    <div className="app-container">
      <h1>ehours</h1>
      <Calendar
        style={{ marginRight: 20 }}
        onPickDate={date => console.log('Date picked: ', date)}
      />
      <Calendar date={new Date('2020-3-17')} style={{ marginBottom: 20 }} />
    </div>
  )
}

export default App
