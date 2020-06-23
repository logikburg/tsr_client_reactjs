import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from './Form'
import PropTypes from 'prop-types';

import { loginRequest } from './actions'

class SagaLogin extends Component {
  constructor(props) {
    super(props)

    this._login = this._login.bind(this)
  }

  render() {
    const { dispatch } = this.props
    const { formState, currentlySending, error } = this.props.data
    //localStorage.removeItem('user');

    return (
      <div className='form-page__wrapper'>
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
          </div>
          <Form data={formState} dispatch={dispatch} history={this.props.history} onSubmit={this._login} btnText={'Login'} error={error} currentlySending={currentlySending} />
        </div>
      </div>
    )
  }

  _login(username, password) {
    this.props.dispatch(loginRequest({ username, password }))
  }
}

SagaLogin.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object,
  dispatch: PropTypes.func
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(SagaLogin)