import React from 'react'
import LoadingIndicator from './LoadingIndicator'
import PropTypes from 'prop-types';

function LoadingButton(props) {
  return (
    <a href='#' className={props.className + ' btn btn--loading'}>
      <LoadingIndicator />
    </a>
  )
}

LoadingButton.propTypes = {
  className: PropTypes.string
}

export default LoadingButton