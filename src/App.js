import React, { useState } from 'react'
import Calendar from './components/Calendar'
import Modal from './components/Modal'
import { format } from 'date-fns'

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <>
      <div className="app-container">
        <h1>ehours</h1>
        <Calendar
          style={{ marginRight: 20 }}
          onPickDate={date => {
            setSelectedDate(date)
            setIsModalVisible(true)
          }}
        />
      </div>
      <Modal
        title="Save my schedules"
        visible={isModalVisible}
        onClose={() => {
          console.log('Saved!')
          setIsModalVisible(false)
        }}
      >
        <p style={{ margin: 0 }}>
          Save schedules for{' '}
          {selectedDate ? format(selectedDate, 'yyyy/MM/dd') : ''}
        </p>
      </Modal>
    </>
  )
}

export default App
