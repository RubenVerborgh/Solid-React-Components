# Core React Components for Solid
A core set of [React](https://reactjs.org/) components and hooks
for building your own [Solid](https://solid.inrupt.com/) components and apps.

[![npm version](https://img.shields.io/npm/v/@solid/react.svg)](https://www.npmjs.com/package/@solid/react)
[![Build Status](https://travis-ci.org/solid/react-components.svg?branch=master)](https://travis-ci.org/solid/react-components)
[![Coverage Status](https://coveralls.io/repos/github/solid/react-components/badge.svg?branch=master)](https://coveralls.io/github/solid/react-components?branch=master)
[![Dependency Status](https://david-dm.org/solid/react-components.svg)](https://david-dm.org/solid/react-components)

### Purpose
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

### Example apps
These apps have already been built with React for Solid:
- [Profile viewer](https://github.com/solid/profile-viewer-react) 👤
- [LDflex playground](https://solid.github.io/ldflex-playground/) ⚾
- [Demo app](https://github.com/solid/react-components/blob/master/demo/app.jsx) 🔍
- [Another profile viewer](https://gitlab.com/angelo-v/solid-profile-viewer) 👤
- […add yours!](https://github.com/solid/react-components/edit/master/README.md)

### Install and go
First add the package:
```bash
yarn add @solid/react # or
npm install @solid/react
```

Then you can import components like this:
```JavaScript
import { LoginButton, Value } from '@solid/react';
```

## Build Solid apps from React components
The [demo app](https://github.com/solid/react-components/tree/master/demo)
will inspire you on how to use the components listed below.

### 👮🏻‍♀️ Authentication
#### Log the user in and out
You will need a copy of [popup.html](https://solid.github.io/solid-auth-client/dist/popup.html) in your application folder.
```jsx
<LoginButton popup="popup.html"/>
<LogoutButton>Log me out</LogoutButton>
// Shows LoginButton or LogoutButton depending on the user's status
<AuthButton popup="popup.html" login="Login here!" logout="Log me out"/>
```

#### Display different content to logged in users
```jsx
<LoggedOut>
  <p>You are not logged in, and this is a members-only area!</p>
</LoggedOut>
<LoggedIn>
  <p>You are logged in and can see the special content.</p>
</LoggedIn>
```

### 🖥️ Get data from Solid
#### Load data from the user and from the Web
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

#### Write data expressions with LDflex
Solid React data components
use the [LDFlex](https://github.com/solid/query-ldflex/) language
to build paths to the data you want.

For example:
- `"user.firstName"` will resolve to the logged in user's first name
- `"user.friends.firstName"` will resolve to the first name of the user's friends
- `"[https://ruben.verborgh.org/profile/#me].homepage"` will resolve to Ruben's homepage
- `"[https://ruben.verborgh.org/profile/#me].friends.firstName"` will resolve to Ruben's friends' names

Learn how to [write your own LDflex expressions](https://github.com/solid/query-ldflex/#creating-data-paths).


## 💪🏾 Create your own components
The Solid React library makes it easy
to create your own components
that interact with the current user
and fetch Linked Data from the Web.
This is easy thanks to [hooks](https://reactjs.org/docs/hooks-intro.html),
introduced in React 16.8.
A good way to get started is by looking at the [implementation](https://github.com/solid/react-components/tree/master/src/components)
of built-in components like
[AuthButton](https://github.com/solid/react-components/blob/master/src/components/AuthButton.jsx),
[Name](https://github.com/solid/react-components/blob/master/src/components/Name.jsx),
and
[List](https://github.com/solid/react-components/blob/master/src/components/List.jsx).

Not a hooks user yet,
or prefer writing components with functions instead of classes?
Our [higher-order components](https://github.com/solid/react-components/blob/v1.3.1/README.md#-building-your-own-components)
will help you out.

#### Identify the user
In Solid, people are identified by a WebID,
a URL that points to them and leads to their data.

The `useWebID` hook gives you the WebID
of the currently logged in user as a string,
which changes automatically whenever someone logs in or out.
The `useLoggedIn` and `useLoggedOut` hooks
provide similar functionality, but return a boolean value.

```jsx
import { useWebId, useLoggedIn, useLoggedOut } from '@solid/react';

function WebIdStatus() {
  const webId = useWebId();
  return <span>Your WebID is {webId}.</span>;
}

function Greeting() {
  const loggedOut = useLoggedOut();
  return <span>You are {loggedOut ? 'anonymous' : 'logged in' }.</span>;
}
```

#### Load data from the user or the Web
The `useLDflexValue` and `useLDflexList` hooks
let you load a single result or multiple results
of an LDflex expression.

```jsx
import { useLDflexValue, useLDflexList } from '@solid/react';

function ConnectionCount() {
  const name = useLDflexValue('user.firstName') || 'unknown';
  const friends = useLDflexList('user.friends');
  return <span>{`${name}`} is connected to {friends.length} people.</span>;
}
```
Note how we force `name` into a string through `` `${name}` ``
(or, alternatively, `name.toString()` or `'' + name`).
This is needed because LDflex values are special objects
that _look_ like a string, but actually provide extra functionality.

Finally, the `useLDflex` hook also returns status information about the expression.
When its optional second argument is `true`, it returns a list.

```jsx
import { List, useLDflex } from '@solid/react';

function BlogPosts({ author = 'https://ruben.verborgh.org/profile/#me' }) {
  const expression = `[${author}].blog[schema:blogPost].label`;
  const [posts, pending, error] = useLDflex(expression, true);

  if (pending)
    return <span>loading <em>({posts.length} posts so far)</em></span>;
  if (error)
    return <span>loading failed: {error.message}</span>;

  return <ul>{posts.map((label, index) =>
           <li key={index}>{`${label}`}</li>)}
         </ul>;
}
```

## License
©2018–present [Ruben Verborgh](https://ruben.verborgh.org/),
[MIT License](https://github.com/solid/react-components/blob/master/LICENSE.md).
