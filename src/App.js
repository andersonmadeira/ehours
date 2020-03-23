import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import Modal from './components/Modal'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import ScheduleForm from './components/ScheduleForm'
import { logout, isAuthenticated } from './services/auth'
import { Redirect } from 'react-router-dom'
import api from './services/api'

const App = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (authenticated) {
      api.get('/auth/user').then(res => {
        setUserInfo(res.data.user.name)
      })
    }
  }, [authenticated])

  return authenticated ? (
    <>
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <h1>ehours</h1>
          </div>
          <div className="user-info">
            <span>{userInfo ? userInfo : 'Loading user...'}</span>
            <button
              onClick={() => {
                logout()
                setAuthenticated(false)
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <Calendar
          onSelect={date => {
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
          onSubmit={schedule => {
            setIsModalVisible(false)
          }}
        />
      </Modal>
    </>
  ) : (
    <Redirect to="/login" />
  )
}

export default App
