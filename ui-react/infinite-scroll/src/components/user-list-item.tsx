import type { FC } from "react";
import type { User } from "../types";
import Styles from "./user-style.module.css";

interface UserListItemProps {
  user: User;
}

const UserListItem: FC<UserListItemProps> = ({ user }) => {
  return (
    <li className={Styles.user_list__item}>
      {user.firstName} {user.lastName}
    </li>
  );
};

export default UserListItem;
