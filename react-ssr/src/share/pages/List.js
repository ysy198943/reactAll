import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getList } from '../store/actions/user.action'

function List(props) {
  useEffect(() => {
    props.dispatch(getList())
  }, [])
  return (
    <div>
      List
      <ul>
      {
        props.user.list.map(item => <li key={item.id}>
          {item.name}
          </li>)
      }
        
      </ul>
    </div>
  )
}

function loadData(store) {
  return store.dispatch(getList())
}

export default {
  component: connect(({ user }) => ({ user }))(List),
  loadData,
};
