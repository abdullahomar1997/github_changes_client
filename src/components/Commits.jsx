import React from "react";

const Commits = ({ commits, readLater, searchField }) => {
  const handle = (commit) => {
    if (!readLater.includes(commit.sha)) {
      readLater.push(commit.sha);
    }

    alert("Added to Read Later Succesfully");

    localStorage.setItem("commits", JSON.stringify(readLater));
  };

  return (
    <div className="tbl">
      <table>
        <tbody>
          <tr>
            <td className="commit heading">Commit Message</td>
            <td className="commit heading">Repository</td>
            <td className="later action_heading">Action</td>
          </tr>
          {commits
            .sort((a, b) => {
              return -a.commit.author.date.localeCompare(b.commit.author.date);
            })
            .filter((search) =>
              search.commit.message
                .toLowerCase()
                .includes(searchField.toLowerCase())
            )
            .map((commit) => (
              <tr key={commit.sha}>
                <td className="commit">{commit.commit.message}</td>
                <td className="commit">{commit.repo_name}</td>
                <td
                  className={
                    commit.isSavedForLater ? "later unmarked" : "later"
                  }
                  onClick={() => handle(commit)}
                >
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
