import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import HABot from '../../components/HABot/';
import { connect } from 'react-redux';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import {
  getConfigListUILoading
} from "../../_actions";


class DefaultLayout extends Component {
  constructor(props) {
    super(props);
  }
  parentKeepData(name, data) {
    let obj = {};
    obj[name] = data;
    this.setState({ ...obj });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getConfigListUILoading());
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <div className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (<Route key={idx + Math.random()} path={route.path} exact={route.exact} name={route.name} render={props => (
                    <route.component {...props} />
                  )} />)
                    : (null);
                },
                )}
                <Redirect from="/" to="/reqlist/inprogress" />
              </Switch>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </Container>
          </div>
          <AppAside fixed>
            <DefaultAside />
          </AppAside>
        </div>

        {
          <AppFooter>
            <DefaultFooter />

            <HABot parentCallBack={(name, data) => this.parentKeepData(name, data)} />

          </AppFooter>
        }
        {
          //<HABot parentCallBack={(name, data) => this.parentKeepData(name, data)} />
        }


      </div>
    );
  }
}

//export default DefaultLayout;
export default connect(
)(DefaultLayout)