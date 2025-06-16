import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch, useNavigate, Navigate
} from 'react-router-dom'
import { LoginElement } from './components/LoginElement'

const App = () => {
  return(
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <h1>Gamify your habits!</h1>
      <Routes>
        <Route path="/login" element={<LoginElement />}></Route>
      </Routes>
    </div>
  )
}
export default App
