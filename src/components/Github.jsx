import React from "react";
import { useState } from "react";
import { Octokit } from "@octokit/core";
import "../App.css";
import Commits from "./Commits";
import axios from "axios";
import ReadLater from "./ReadLater";

const Github = () => {
  const [githubUser, setGithubUser] = useState("abdullahomar1997");
  const [githubRepo, setGithubRepo] = useState([]);
  const [githubToken, setGithubToken] = useState(
    "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"
  );
  const [searchField, setSearchField] = useState("");
  const [commits, setCommits] = useState([]);
  const [readLater, setReadLater] = useState([]);
  const [toggle, setToggle] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    fetch_user_repos();
    fetch_commits_from_all_repos();
  }
  
  function fetch_user_repos() {
    axios({
      method: "get",
      url: `https://api.github.com/users/${githubUser}/repos`,
    })
      .then((res) => {
        setGithubRepo(res.data);
      })
      .catch((err) => {
        setGithubRepo([]);
        setCommits([]);
        setReadLater([]);
        console.log(err);
      });
  }

  function fetch_commits_from_all_repos() {
    githubRepo.forEach((repo) => {
      if (repo.size !== 0) {
        console.log(repo);
        fetch_commits_from_a_repo(repo);
      }
      setCommits(commits);
    });
  }

  async function fetch_commits_from_a_repo(repo) {
    const octokit = new Octokit({
      auth: githubToken,
    });

    await octokit
      .request("GET /repos/{owner}/{repo}/commits", {
        owner: githubUser,
        repo: repo.name,
      })
      .then((data) => {
        data.data.forEach((commit) => {
          commits.push(commit);
        });
      });

    if (localStorage.getItem("commits") !== null) {
      setReadLater(JSON.parse(localStorage.getItem("commits")));
    }
  }

  return (
    <div>
      <div className="search_user">
        <input
          value={githubUser}
          placeholder="Github Username"
          onChange={(e) => setGithubUser(e.target.value)}
          className="input_search"
        />
        <input
          value={githubToken}
          placeholder="Github Token"
          onChange={(e) => setGithubToken(e.target.value)}
          className="input_search"
        />
        <button onClick={handleSubmit} className="search_button">
          Search Github User
        </button>
      </div>
      <div>
        <h1>Latest Changes</h1>
        <button onClick={() => setToggle(false)} className="search_button">
          All Changes
        </button>
        <button onClick={() => setToggle(true)} className="search_button">
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
    </div>
  );
};

export default Github;
