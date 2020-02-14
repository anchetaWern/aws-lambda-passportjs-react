import React, { Component } from "react";

import { withRouter } from "react-router";

import { Label, Input } from "@rebass/forms";
import { Box, Link } from "rebass";
import { Tiles } from "@rebass/layout";

import axios from "axios";

import { UserContext } from "../context/UserContext";

class Repos extends Component {
  state = {
    query: "",
    filtered_repos: [] // repos to display
  };

  static contextType = UserContext;

  componentDidMount() {
    if (!this.context.user) {
      this.props.history.push("/");
    }
  }

  render() {
    const { query } = this.state;

    return (
      <React.Fragment>
        <Box width={300}>
          <Label htmlFor="repo">Search repos</Label>
          <Input
            id="repo"
            name="repo"
            type="text"
            onChange={this.searchRepos}
            value={query}
          />
        </Box>
        <Box width={900}>
          <Tiles width={[96, null, 128]}>{this.renderRepos()}</Tiles>
        </Box>
      </React.Fragment>
    );
  }

  searchRepos = async evt => {
    const query = evt.target.value;
    const { user, repos } = this.context;

    this.setState({
      query
    });

    let repos_data = repos;

    if (!repos_data) {
      const res = await axios.get(
        `https://api.github.com/users/${user.username}/repos`
      );

      repos_data = res.data
        .filter(repo => repo["private"] === false)
        .map(
          ({
            id,
            name,
            html_url,
            fork,
            stargazers_count,
            watchers_count,
            forks_count
          }) => {
            return {
              id,
              name,
              html_url,
              fork,
              stargazers_count,
              watchers_count,
              forks_count
            };
          }
        );

      this.context.updateRepos(repos_data);
    }

    const pattern = new RegExp(`${query}`, "gi");

    // filter repos to be displayed
    const filtered_repos = repos_data.filter(repo => {
      return repo.name.match(pattern) !== null;
    });

    this.setState({
      filtered_repos
    });
  };

  renderRepos = () => {
    const { filtered_repos } = this.state;

    if (filtered_repos) {
      return filtered_repos.map(
        ({
          id,
          name,
          html_url,
          stargazers_count,
          watchers_count,
          forks_count
        }) => {
          return (
            <div
              key={id}
              style={{
                padding: "10px",
                border: "1px dashed #f3f3f3",
                margin: "5px 0",
                wordBreak: "break-all"
              }}
            >
              <Link href={html_url} target="_blank">
                {name}
              </Link>

              <div
                style={{
                  fontSize: 12,
                  color: "#333",
                  marginTop: 5
                }}
              >
                <div>stargazers: {stargazers_count}</div>
                <div>forks: {watchers_count}</div>
                <div>watchers: {forks_count}</div>
              </div>
            </div>
          );
        }
      );
    }

    return null;
  };
}

export default withRouter(Repos);
