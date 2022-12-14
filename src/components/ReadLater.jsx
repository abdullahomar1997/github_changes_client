import React from "react";

const ReadLater = ({ readLater, commits, searchField, setReadLater }) => {
  const delete_handle = (commit) => {
    setReadLater(readLater.filter((f) => f !== commit.sha));
    localStorage.setItem(
      "commits",
      JSON.stringify(readLater.filter((f) => f !== commit.sha))
    );
    alert("Deleted From Read Later Succesfully");
  };
  return (
    <div className="tbl">
      <table>
        <tbody>
          <tr>
            <td className="commit heading">Commit Message</td>
            <td className="commit heading">Repository</td>
            <td className="later marked action_heading">Action</td>
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
            .filter((value) => readLater.includes(value.sha))
            .map((commit) => (
              <tr key={commit.sha}>
                <td className="commit">{commit.commit.message}</td>
                <td className="commit">{commit.repo_name}</td>

                <td
                  className="later marked"
                  onClick={() => delete_handle(commit)}
                >
                  Delete Read Later
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReadLater;
