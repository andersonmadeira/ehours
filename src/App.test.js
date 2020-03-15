import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders title element', () => {
  const { getByText } = render(<App />)
  const titleElement = getByText(/ehours/i)
  expect(titleElement).toBeInTheDocument()
})
