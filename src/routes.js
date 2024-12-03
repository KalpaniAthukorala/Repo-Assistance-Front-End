import React from 'react'
import Landing from './views/Home/Landing'
import RepoForm from './views/Repo/RepoForm'
import ChatInterface from './views/Repo/ChatInterface'
// const Tool = React.lazy(() => import('./views/tool/Tool'))
 

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Dashboard', element: Landing  },
  { path: '/repo-assistance', name: 'RepositoryAssistance', element: RepoForm},
  { path: '/chat-interface', name: 'RepositoryExplainer', element: ChatInterface},
]

export default routes
