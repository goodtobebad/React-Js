import React, { useEffect, useState } from 'react';
import { LoginForm } from './App/LoginForm'
import { Site } from './App/Site';
import { apiFetch } from './utils/api'

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(function () {
    apiFetch('/me')
      .then(setUser)
      .catch(() => setUser(false))
  }, [])

  if (user === null) {
    return null;
  }

  return (
    user ? <Site /> : <LoginForm onConnect={setUser} />
  );
}