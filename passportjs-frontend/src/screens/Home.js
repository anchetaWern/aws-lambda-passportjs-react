import React, { Component } from "react";
import { Card, Image, Heading, Button, Link } from "rebass";

import { withRouter } from "react-router";

import { UserContext } from "../context/UserContext";

class Home extends Component {
  static contextType = UserContext;

  render() {
    const { user } = this.context;

    return (
      <React.Fragment>
        {!user && (
          <Link href="/auth/github">
            <Button variant="primary" mr={2}>
              Login with GitHub
            </Button>
          </Link>
        )}

        {user && (
          <Card width={256}>
            <Image src={user.profile_pic} />
            <Heading pb={2}>{user.display_name}</Heading>

            <Link href="/repos">
              <Button variant="primary" mr={2}>
                View Repos
              </Button>
            </Link>

            <Button
              variant="secondary"
              mr={2}
              onClick={() => {
                console.log("logging out..");
                localStorage.removeItem("user");
                window.location.replace("/logout");
              }}
            >
              Logout
            </Button>
          </Card>
        )}
      </React.Fragment>
    );
  }
  //
}
//
export default withRouter(Home);
