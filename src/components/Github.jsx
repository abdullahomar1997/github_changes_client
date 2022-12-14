import React from "react";
import { useState } from "react";
import { Octokit } from "@octokit/core";
import "../App.css";
import Commits from "./Commits";
import axios from "axios";
import ReadLater from "./ReadLater";

const Github = () => {
  const [githubUser, setGithubUser] = useState("abdullahomar1997");
  const [githubToken, setGithubToken] = useState("");
  const [searchField, setSearchField] = useState("");
  const [commits, setCommits] = useState([]);
  const [readLater, setReadLater] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch_commits();
  }

  function fetch_commits() {
    setLoading(true);

    axios({
      method: "get",
      url: `https://api.github.com/users/${githubUser}/repos`,
    })
      .then((res) => {
        setErrors("");
        fetch_commits_from_all_repos(res.data);
      })
      .catch((err) => {
        setErrors(githubUser + " does not exist");
        setCommits([]);
        setReadLater([]);
        setLoading(false);
        console.log(err);
      });
  }

  function fetch_commits_from_all_repos(repos) {
    setCommits([]);
    repos.forEach((repo) => {
      if (repo.size !== 0) {
        fetch_commits_from_a_repo(repo);
      }
    });
    setCommits(commits);
    setLoading(false);
  }

  async function fetch_commits_from_a_repo(repo) {
    const octokit = new Octokit({
      auth: githubToken,
    });

    if (localStorage.getItem("commits") !== null) {
      setReadLater(JSON.parse(localStorage.getItem("commits")));
    }

    await octokit
      .request("GET /repos/{owner}/{repo}/commits", {
        owner: githubUser,
        repo: repo.name,
      })
      .then((data) => {
        data.data.forEach((commit) => {
          if (commit.commit.author.name === githubUser) {
            var isSavedForLater = false;
            if (
              JSON.parse(localStorage.getItem("commits")).includes(commit.sha)
            ) {
              isSavedForLater = true;
            }

            commit.repo_name = repo.name;
            commit.isSavedForLater = isSavedForLater;
            setCommits((prev) => [...prev, commit]);
          }
        });
      })
      .catch((err) => {
        setErrors(githubUser + " Is not Authenticated");
      });
  }

  return (
    <div>
      <div className="search_user">
        <input
          value={githubUser}
          placeholder="Enter Username"
          onChange={(e) => setGithubUser(e.target.value)}
          className="input_search"
        />
        <input
          value={githubToken}
          placeholder="Personal Access Token"
          onChange={(e) => setGithubToken(e.target.value)}
          className="input_search"
        />
        <button onClick={handleSubmit} className="search_button">
          {loading ? "Searching ......" : "Search Github Client"}
        </button>
      </div>
      <div>
        <h2>Latest Changes</h2>
        <button onClick={() => setToggle(false)} className="menu_button">
          All Changes
        </button>
        <button onClick={() => setToggle(true)} className="menu_button">
          Read Later
        </button>
        <div></div>

        <div className="search_change">
          <input
            value={searchField}
            placeholder="Search Change"
            onChange={(e) => setSearchField(e.target.value)}
            className="input_search"
          />
        </div>

        {!errors ? (
          <div>
            {toggle ? (
              <ReadLater
                commits={commits}
                readLater={readLater}
                searchField={searchField}
                setReadLater={setReadLater}
              />
            ) : (
              <Commits
                commits={commits}
                readLater={readLater}
                searchField={searchField}
              />
            )}
          </div>
        ) : (
          <h1>{errors}</h1>
        )}
      </div>
    </div>
  );
};

export default Github;
