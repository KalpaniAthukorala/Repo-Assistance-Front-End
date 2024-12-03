import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibMarketo,
  cilMap,
  cilSpeedometer,
  cilUser,
  cilPeople,
  cilLockLocked,
  cilLocationPin,
  cilHome,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,

  },
  {
    component: CNavGroup,
    name: 'Repository Assistance',
    to: '/Tool-management',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Repository Assistance',
        to: '/repo-assistance',

      },
      {
        component: CNavItem,
        name: 'Repository Explainer',
        to: '/chat-interface',
      },

    ],
  },

]

export default _nav
