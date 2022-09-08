import React from "react";

const Commits = ({ commits, readLater, searchField }) => {
  const handle = (commit) => {
    console.log("rl", commit);
    console.log("read", readLater);
    if (!readLater.includes(commit.sha)) {
      readLater.push(commit.sha);
    }

    localStorage.setItem("commits", JSON.stringify(readLater));
  };

  return (
    <div className="tbl">
      <table>
        <tbody>
          <tr>
            <td className="commit">Commit Message</td>
            <td className="later heading">Action</td>
          </tr>
          {commits
            .sort((a, b) => {
              return -a.commit.author.date.localeCompare(b.commit.author.date);
            })
            .filter((search) => search.commit.message.includes(searchField))
            .map((commit) => (
              <tr key={commit.sha}>
                <td className="commit">{commit.commit.message}</td>
                <td className="later" onClick={() => handle(commit)}>
                  Save To Read Later
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Commits;
