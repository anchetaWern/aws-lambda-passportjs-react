import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ThemeProvider } from "emotion-theming";
import { Flex, Box } from "rebass";
import theme from "@rebass/preset";

import Home from "./screens/Home";
import Repos from "./screens/Repos";

import { UserContextProvider } from "./context/UserContext";

//
export default function App() {
  return (
    <UserContextProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <Flex>
            <Box
              sx={{
                maxWidth: 900,
                mx: "auto",
                px: 3
              }}
              p={5}
            >
              <Switch>
                <Route path="/repos">
                  <Repos />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Box>
          </Flex>
        </ThemeProvider>
      </Router>
    </UserContextProvider>
  );
}
//
