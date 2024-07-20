import React from "react";
import cx from "classnames";
import UserProfile from "../../../../components/UserProfile/UserProfile";
import "./_user-list.scss";

function User({ icon, name, lastActive, isOnline, color, onClick, isActive }) {
  return (
    <button className={cx("user-list__users__user", { "is-active": isActive })} onClick={onClick}>
      <UserProfile icon={icon} name={name} color={color} />
      <div className="user-list__users__user__right-content">
        <div className="user-list__users__user__title">
          <p className="user-list__users__user__name">{name}</p>
          <p className={cx({ "user-list__users__user__online": isOnline })}>{isOnline ? "Online" : lastActive}</p>
        </div>
        {/* <p>{messages[userId]}</p> */}
      </div>
    </button>
  );
}

export default function UserList({ contacts, selectActiveContact, activeContact }) {
  return (
    <div className="user-list">
      <div className="user-list__header">
        <div className="user-list__header__left">
          <p>All Messages</p>
          <i className="fas fa-chevron-down" />
        </div>
        <i className="fas fa-cog" />
      </div>
      <div className="user-list__users">
        {contacts?.map((user) => {
          return (
            <User
              key={user.id}
              name={user.name}
              icon={"fas fa-comment-dots"}
              color={"#4DB8EF"}
              isOnline={user?.isOnline}
              onClick={() => selectActiveContact(user.number)}
              isActive={activeContact?.number === user.number}
            />
          );
        })}
      </div>
    </div>
  );
}
