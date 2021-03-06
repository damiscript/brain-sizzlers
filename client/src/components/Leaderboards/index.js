import React from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../actions/";
import Loader from "../Loader";

class LeaderBoards extends React.Component {
  state = { users: null };
  componentDidMount() {
    this.fetchUsers();
  }
  /**
   * Fetches the users with the highest amount of points from the database
   */
  fetchUsers = async () => {
    const users = await fetchUsers({
      limit: 5,
      sort: "points",
      order: "desc",
    });
    this.setState({ users: users });
  };
  renderList = () => {
    return this.state.users.map((user, index) => {
      return (
        <div className="flex space-x-4 py-2 items-center" key={index}>
          <div>
            <h3 className="text-lg font-bold">{index + 1}.</h3>
          </div>
          <img
            src={user.picture}
            className="rounded-full md:w-16 w-12 "
            alt={`${user.name}-thumbnail`}
          />
          <div className="flex-grow flex justify-between items-center border-t border-b py-4">
            <div className="flex flex-col space-y-2">
              <Link to={`/users/${user.name}`} className="text-lg text-primary">
                {user.name}
              </Link>
              <p className="text-gray-300">{user.points} Points</p>
            </div>
          </div>
          <Link to={`/users/${user.name}`}>
            <Button>View </Button>
          </Link>
        </div>
      );
    });
  };
  render() {
    if (!this.state.users) {
      return <Loader size={48} />;
    } else if (this.state.users.length === 0) {
      return (
        <h3 className="text-xl text-center font-bold">
          There are no leaders yet
        </h3>
      );
    }
    return <div className="leader-boards lg:px-32">{this.renderList()}</div>;
  }
}

export default LeaderBoards;
