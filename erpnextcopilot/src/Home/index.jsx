import React from 'react'
import { ChatView } from './Component/ChatView'
import { nanoid } from 'nanoid'

export const HomePage = () => {
  return (
    <div><ChatView sessionID={nanoid()}/></div>
  )
}
