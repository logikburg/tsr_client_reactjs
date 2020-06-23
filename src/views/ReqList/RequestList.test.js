import React from 'react';
import SavedReq from './RequestList';
import { shallow } from 'enzyme'

it('renders without crashing', () => {
  shallow(<RequestList />);
});
