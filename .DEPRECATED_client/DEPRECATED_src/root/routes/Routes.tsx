import React from 'react';
import { Route } from 'react-router-dom';

import About from './about';
import Dashboard from './dashboard';
import Landing from './landing';
import Library from './library';
import Login from './login';
import Notation from './notation';
import Search from './search';
import Signup from './signup';
import Upload from './notation/new';

import { inContainer } from 'enhancers';

const withMarginTop = (Wrapped: React.Component, marginTop: string): any => (
  inContainer(Wrapped, { style: { marginTop } })
);

const Routes = () => (
  <div className="App__routes">
    <Route exact path="/" component={Landing} />
    <Route path="/about" component={About} />
    <Route path="/library" component={withMarginTop(Library, '7%')} />
    <Route path="/login" component={withMarginTop(Login, '5%')} />
    <Route path="/signup" component={withMarginTop(Signup, '5%')} />
    <Route path="/search" component={withMarginTop(Search, '2%')} />
    <Route path="/upload" component={withMarginTop(Upload, '5%')} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/n" component={Notation} />
  </div>
);

const scrollToTop = (): void => window.scrollTo(null, 0);

export default Routes;
