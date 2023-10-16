To use styled-components for your project, you can create a separate file for each component you want to style and import the styled function from styled-components. You can then define your styles inside the styled function as template literals.

For example, let's say you have a Button component. You can create a Button.styles.js file and define your styles as follows:

```javascript
import styled from 'styled-components';

export const ButtonWrapper = styled.button`
  background-color: ${props => props.backgroundColor || 'white'};
  color: ${props => props.color || 'black'};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.hoverBackgroundColor || 'lightgray'};
  }
`;
```

In this example, we're defining a ButtonWrapper styled component that renders a button HTML element. The styles are defined using the styled function from styled-components. We're using template literals to define the styles and we're using props to make the styles customizable.

To use this component in your code, you can import the ButtonWrapper component from Button.styles.js and render it like this:

```javascript
import React from 'react';
import { ButtonWrapper } from './Button.styles.js';

const Button = () => {
  return (
    <ButtonWrapper backgroundColor="blue" color="white" hoverBackgroundColor="darkblue">
      Click me!
    </ButtonWrapper>
  );
};

export default Button;
```

In this example, we're rendering the ButtonWrapper component and passing in some props to customize its styles.

For global styles, you can use the createGlobalStyle function from styled-components. You can define your global styles as follows:

```javascript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: lightgray;
  }

  h1 {
    font-size: 32px;
  }
`;

export default GlobalStyle;
```

In this example, we're defining a GlobalStyle component using the createGlobalStyle function from styled-components. We're using template literals to define the styles and we're targeting body and h1 elements. You can then import this component into your code and render it at the top-level of your app like this:

```javascript
import React from 'react';
import GlobalStyle from './GlobalStyle';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <h1>Hello, world!</h1>
    </>
  );
};

export default App;
```

In this example, we're rendering the GlobalStyle component at the top-level of our app to apply the global styles.

<!--  -->

Yes, it's definitely possible to use SCSS with React and styled-components. You can create a separate SCSS file to define your colors, typography, and other reusable styles, and then import that file into your styled-components.

Here's an example of how you can define a theme using SCSS and then use it in your styled-components:

Create a theme.scss file in your src folder:

```css
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$warning-color: #ffc107;
$danger-color: #dc3545;

$font-family: "Open Sans", sans-serif;
$font-size-base: 1rem;
$font-weight-bold: 700;
```

Import the theme.scss file into your index.js file:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import "./theme.scss";

ReactDOM.render(
  <ThemeProvider theme={{}}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
```

Pass the theme as a prop to the ThemeProvider:
css

```javascript
import styled from "styled-components";

const Button = styled.button`
  background-color: ${props => props.theme.primaryColor};
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: ${props => props.theme.fontSizeBase};
  font-weight: ${props => props.theme.fontWeightBold};
`;

const App = () => (
  <div>
    <Button>Click Me</Button>
  </div>
);

export default App;
```

This way, you can define all your reusable styles in the theme.scss file and then use them in your styled-components by passing the theme object as a prop to the ThemeProvider.