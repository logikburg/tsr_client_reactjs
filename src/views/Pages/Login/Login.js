import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { connect } from 'react-redux';
import { login } from '../../../_actions/login.actions';
import PropTypes from 'prop-types';

class Login extends Component {
	constructor(props) {
		super(props);
		let { from } = this.props.location.state || { from: { pathname: "/" } };
		this.state = from;
		//this.state = {};
		this.onSubmit = this.onSubmit.bind(this);
		this.onPress = this.onPress.bind(this);
	}


	render() {
		let { username, password } = this.state;
		let { isLoginPending, isLoginSuccess, loginError } = this.props;
		const { formState, currentlySending, loggedIn, error } = this.props.data.userReducer

		console.log('*** this.state:', this.state)

		//Always Clear localStorage
		//localStorage.removeItem('user');

		return (
			<form name="loginForm" onSubmit={this.onSubmit}>
				<div className="app flex-row align-items-center login-container-wrapper">
					<div class="background-image">
					</div>
					<Container className="login-container">
						<Row className="justify-content-center">
							<Col md="6">
								<CardGroup>
									<Card className="p-4 login-box">
										<CardBody>
											<div className="login-logo">
												<img src="/assets/img/logo.png" />
											</div>

											{(currentlySending || loggedIn) && <div><i className="fa fa-spin fa-spinner"></i> going in...</div>}
											{loggedIn && <Redirect to="/" />}

											{!(currentlySending || loggedIn) && <div>
												<Row>	{isLoginPending && <div>
													<Col xs="16"><div className="float-right"><div><h5><i className="fa fa-spin fa-spinner"></i>&nbsp;Checking ...</h5></div></div></Col>
												</div>}
													{error && <div>
														<Col xs="16"><div className="message"><div><h5>{error}</h5></div></div></Col>
													</div>}
													{!isLoginPending && !error && <Col><div>&nbsp;</div></Col>}
												</Row>

												<InputGroup className="mb-3">
													<InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
													<Input id="login-form-username" type="text" placeholder="Username" onChange={e => this.setState({ username: e.target.value })} value={username} />
												</InputGroup>
												<InputGroup className="mb-4">
													<InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
													<Input id="login-form-password" type="password" placeholder="Password" onKeyPress={this.onPress} onChange={e => this.setState({ password: e.target.value })} value={password} />
												</InputGroup>


												<Row>
													<Col></Col>
													<Col xs="12">
														<Button size="lg" id="login-form-submit" color="primary" className={isLoginPending ? "hidden" : "show"} onClick={this.onSubmit} block>Login</Button>
													</Col>
													<Col></Col>
												</Row>
											</div>}


										</CardBody>
									</Card>
								</CardGroup>
							</Col>
						</Row>
					</Container>
				</div>

			</form>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		let { username, password, pathname } = this.state;
		//this.props.login(username, password);

		this.props.dispatch(login({ username, password, pathname }))
	}

	onPress(e) {
		if (e.which == 13 || e.keyCode == 13) {
			e.target.blur();
			//onSubmit(e);
			let { username, password } = this.state;
			//this.props.login(username, password);
			this.props.dispatch(login({ username, password }))

			//this.updateLoadingState(true);
			//setTimeout(this.handleLoginOnClick,100);
		}
	}
}
/*
const mapStateToProps = (state) => {
	return {
		isLoginPending: state.userReducer.isLoginPending,
		isLoginSuccess: state.userReducer.isLoginSuccess,
		loginError: state.userReducer.loginError
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (username, password) => dispatch(login(username, password))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
*/
Login.propTypes = {
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
export default connect(select)(Login)