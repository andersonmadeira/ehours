import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import Modal from './components/Modal'
import { format, startOfMonth, endOfMonth, getDate, parseISO } from 'date-fns'
import ScheduleForm from './components/ScheduleForm'
import { logout, isAuthenticated } from './services/auth'
import { Redirect } from 'react-router-dom'
import api from './services/api'

const App = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [monthSchedules, setMonthSchedules] = useState({})
  const [pivotDate, setPivotDate] = useState(new Date())

  const selectedSchedule = monthSchedules[getDate(selectedDate) - 1]

  useEffect(() => {
    const min = format(startOfMonth(pivotDate), 'yyyy-MM-dd'),
      max = format(endOfMonth(pivotDate), 'yyyy-MM-dd'),
      params = `?min=${min}&max=${max}`

    api.get(`/schedules/${params}`).then(res => {
      console.log(res.data)
      setMonthSchedules(
        res.data.reduce(
          (acc, current) => ({
            ...acc,
            [getDate(parseISO(current.date)) - 1]: current,
          }),
          {},
        ),
      )
    })
  }, [pivotDate])

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
          date={pivotDate}
          monthSchedules={monthSchedules}
          onChange={date => setPivotDate(date)}
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
          scheduleId={
            selectedSchedule !== undefined ? selectedSchedule._id : null
          }
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
