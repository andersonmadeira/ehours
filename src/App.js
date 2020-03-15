import React from 'react'
import Calendar from './components/Calendar'

const App = () => {
  return (
    <div className="app-container">
      <h1>ehours</h1>
      <Calendar style={{ marginRight: 20 }} />
      <Calendar date={new Date(1989, 4)} style={{ marginBottom: 20 }} />
    </div>
  )
}

export default App
