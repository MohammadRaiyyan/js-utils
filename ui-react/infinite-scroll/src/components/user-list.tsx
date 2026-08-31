import type { FC } from "react";
import type { User } from "../types";
import Styles from "./user-style.module.css";
import UserListItem from "./user-list-item";

interface UserListProps {
  users: Array<User>;
}

const UserList: FC<UserListProps> = ({ users }) => {
  return (
    <ul className={Styles.user_list}>
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};

export default UserList;
