import React, { Component } from "react";
import axios from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 1000,
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

export const UserContext = React.createContext({});
const user = localStorage.getItem("user");

export class UserContextProvider extends Component {
  state = {
    user: user,
    repos: null
  };

  async componentDidMount() {
    if (user) {
      console.log("zack");
      this.setState({
        user: JSON.parse(user)
      });
    } else {
      const res = await instance.get("/user");
      if (res.data) {
        console.log("got user: ", res.data);
        this.setState({
          user: { ...res.data }
        });

        localStorage.setItem("user", JSON.stringify(res.data));
      } else {
        console.log("no user");

        //this.props.history.push("/");
      }
    }
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          updateRepos: this.updateRepos
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }

  updateRepos = repos => {
    this.setState({
      repos
    });
  };
}
