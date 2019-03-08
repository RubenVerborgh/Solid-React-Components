import {
  array, element, func, number, object, string,
  oneOfType,
} from 'prop-types';

const ldflexExpression = oneOfType([string, object]);
const numberString = oneOfType([number, string]);

const children = oneOfType([array, string, element]);
const needsChildren = { children: children.isRequired };
const srcAndChildren = { src: ldflexExpression.isRequired, children };

function setPropTypes(Component, ...propTypes) {
  Component.propTypes = Object.assign({}, ...propTypes);
}

import LoggedIn from './components/LoggedIn';
setPropTypes(LoggedIn, needsChildren);

import LoggedOut from './components/LoggedIn';
setPropTypes(LoggedOut, needsChildren);

import LoginButton from './components/LoginButton';
setPropTypes(LoginButton, { popup: string });

import AuthButton from './components/AuthButton';
setPropTypes(AuthButton, LoginButton.propTypes);

import Value from './components/Value';
setPropTypes(Value, srcAndChildren);

import Image from './components/Image';
setPropTypes(Image, srcAndChildren, { defaultSrc: string });

import Link from './components/Link';
setPropTypes(Link, { href: ldflexExpression.isRequired, children });

import Label from './components/Label';
setPropTypes(Label, srcAndChildren);

import Name from './components/Name';
setPropTypes(Name, srcAndChildren);

import List from './components/List';
setPropTypes(List, {
  src: ldflexExpression.isRequired,
  container: func,
  children: func,
  limit: numberString,
  offset: numberString,
  filter: func,
});

import LiveUpdate from './components/LiveUpdate';
setPropTypes(LiveUpdate, { subscribe: oneOfType([array, string]) });
