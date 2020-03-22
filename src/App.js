import React, { useState } from 'react'
import Calendar from './components/Calendar'
import Modal from './components/Modal'
import { format } from 'date-fns'
import ScheduleForm from './components/ScheduleForm'

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <>
      <div className="app-container">
        <h1>ehours</h1>
        <Calendar
          onPickDate={date => {
            setSelectedDate(date)
            setIsModalVisible(true)
          }}
        />
      </div>
      <Modal
        title={`Save my schedules - ${
          selectedDate ? format(selectedDate, 'yyyy/MM/dd') : ''
        }`}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false)
        }}
      >
        <ScheduleForm
          date={selectedDate}
          onSubmit={values => {
            console.log('Form submitted:', values)
            setIsModalVisible(false)
          }}
        />
      </Modal>
    </>
  )
}

export default App
