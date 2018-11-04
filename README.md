# React for Solid
Efficiently build [Solid](https://solid.inrupt.com/) apps and components
with [React](https://reactjs.org/)

[![npm version](https://img.shields.io/npm/v/@solid/react.svg)](https://www.npmjs.com/package/@solid/react)
[![Build Status](https://travis-ci.org/solid/react-components.svg?branch=master)](https://travis-ci.org/solid/react-components)
[![Coverage Status](https://coveralls.io/repos/github/solid/react-components/badge.svg?branch=master)](https://coveralls.io/github/solid/react-components?branch=master)
[![Dependency Status](https://david-dm.org/solid/react.svg)](https://david-dm.org/solid/react)

🚧 Work in progress:
you currently get components to _read_ data.
Writing is still underway.

⚠️ This library explores one way of developing Solid apps,
but does not aim to be _the_ way or the _only_ way.

## Purpose
✨ [Solid](https://solid.inrupt.com/) is an ecosystem for people, data, and apps
in which people can store their data where they want,
independently of the apps they use.

⚛️ This library aims to:
1. provide React developers with components to develop fun Solid apps 👨🏿‍💻
2. enable React developers to build their own components for Solid 👷🏾‍♀️

Solid uses 🔗 [Linked Data](https://solid.inrupt.com/docs/intro-to-linked-data),
so people's data from all over the Web can be connected together
instead of needing to be stored in one giant space.
This library makes working with Linked Data easier, too.

## Installation and usage
First add the package:
```bash
yarn add @solid/react # or
npm install @solid/react
```

Then you can import components like this:
```JavaScript
import { LoginButton, Value } from '@solid/react';
```

## Components
The [demo app](https://github.com/solid/react-components/tree/master/demo)
will inspire you on how to use the components listed below.

### 👮🏻‍♀️ Authentication
#### Showing different content to logged in users
```jsx
<LoggedOut>
  <p>You are not logged in, and this is a members-only area!</p>
</LoggedOut>
<LoggedIn>
  <p>You are logged in and can see the special content.</p>
</LoggedIn>
```

#### Logging in and out
You will need a copy of [popup.html](https://solid.github.io/solid-auth-client/dist/popup.html) in your application folder.
```jsx
<LoginButton popup="popup.html"/>
<LogoutButton/>
// Shows LoginButton or LogoutButton depending on the user's status
<AuthButton/>
```

### 🖥️ Showing Solid data
#### 🈯 The LDflex language
Solid React data components
use the [LDFlex](https://github.com/solid/query-ldflex/) language
to build paths to the data you want.

For example:
- `"user.firstName"` will resolve to the logged in user's first name
- `"user.friends.firstName"` will resolve to the first name of the user's friends
- `"[https://ruben.verborgh.org/profile/#me].homepage"` will resolve to Ruben's homepage
- `"[https://ruben.verborgh.org/profile/#me].friends.firstName"` will resolve to Ruben's friends' names

#### Data components
```jsx
<LoggedIn>
  <p>Welcome back, <Value src="user.firstName"/></p>
  <Image src="user.image" defaultSrc="profile.svg" className="pic"/>
  <ul>
    <li><Link href="user.inbox">Your inbox</Link></li>
    <li><Link href="user.homepage">Your homepage</Link></li>
  </ul>
</LoggedIn>

<h2>Random friend of <Name src="[https://ruben.verborgh.org/profile/#me]"/></h2>
<Value src="[https://ruben.verborgh.org/profile/#me].friends.firstName"/>

<h2>All friends</h2>
<List src="[https://ruben.verborgh.org/profile/#me].friends.firstName"/>

<h2>Random blog post</h2>
<Link href="[https://ruben.verborgh.org/profile/#me].blog[schema:blogPost]"/>

<h2>All blog posts</h2>
<List src="[https://ruben.verborgh.org/profile/#me].blog[schema:blogPost].label"/>

```

### 💪🏾 Building your own components
The Solid React library makes it easy
to build your own components
to interact with the current user
and to fetch Linked Data from the Web.
To this end,
the library ships with
[Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
that do the heavy lifting for your components.

The easiest way is to look at the [implementation](https://github.com/solid/react-components/tree/master/src/components)
of built-in components like
[AuthButton](https://github.com/solid/react-components/blob/master/src/components/AuthButton.jsx),
[Name](https://github.com/solid/react-components/blob/master/src/components/Name.jsx),
and
[List](https://github.com/solid/react-components/blob/master/src/components/List.jsx).
They are all relatively straightforward,
since the complexity is abstracted
by the mechanisms listed below.

```JavaScript
import { withWebId, evaluateExpressions, evaluateList } from '@solid/react';
```

#### Components that access the user's WebID
In Solid, people are identified by a WebID,
which is a URL that points to them
and leads to their data.

By wrapping your component definition with `withWebId`,
the `webId` property will automatically be set on your component's instances
whenever the login status changes.

```jsx
const MyComponent = withWebId(props =>
  <p>Hey user, your WebID is {props.webID}.</p>);
```
```jsx
<MyComponent/>
```

#### Components that use LDflex expressions
To use data from LDflex expressions,
wrap your component definition with `evaluateExpressions`.
The first argument is an array of properties
in which you expect expressions.
Your component will then get back the result
in the property of the same name.

```jsx
const MyComponent = evaluateExpressions(['name'], props =>
  <p>The name is {`${props.name}`}.</p>);
```
```jsx
<MyComponent name="user.friends.name"/>
```
Note how we force `props.name` into a string through `${props.name}`
(or, alternatively, `props.name.toString()` or `'' + props.name`).
This is needed because `props.name` is a special object
that _looks_ like a string but isn't quite a string.

If a property contains a list of things rather than a single value,
pass its name to the second parameter:

```jsx
const MyComponent = evaluateExpressions(['name'], ['friends'], props =>
  <p>Your name is {`${props.name}`} and you have {props.friends.length} friends.</p>);
```
```jsx
<MyComponent name="user.name" friends="user.friends"/>
```

Specifically for building lists of things,
there is the `evaluateList` helper.
The built-in [List](https://github.com/solid/react-components/blob/master/src/components/List.jsx) component is an example.

```jsx
const Greetings = evaluateList('people', ({ people, greeting }) =>
  <ul>{people.map(person =>
    <li key={person}>{greeting} {`${person}`}!</li>
  )}</ul>
);
```
```jsx
<Greetings people="user.friends" greeting="Hello"/>
```

### Configuring webpack
When using webpack to create a distribution that includes `@solid/react`,
ensure that browser versions of dependencies are not included.
In your webpack configuration file, set:

```JavaScript
module.exports = {
  // ...
  externals: require('@solid/react/webpack/webpack.bundle.config').externals,
  // ...
};
```

If you are using _Create React App_,
you might need to `npm run eject` to expose your webpack config.

## License
©2018–present [Ruben Verborgh](https://ruben.verborgh.org/),
[MIT License](https://github.com/solid/react-components/blob/master/LICENSE.md).
