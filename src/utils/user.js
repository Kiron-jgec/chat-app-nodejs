const users = [];

//add user , remove user, get User, get user in room

const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // validate the data

  if (!username || !room) {
    return {
      error: "User name and room are required !",
    };
  }

  // check for exsiting user

  const existingUser = users.find((user) => {
    return user.room === room && user.username == username;
  });

  // validate username

  if (existingUser) {
    return {
      error: " User name is in use ",
    };
  }

  //stor user

  const user = { id, username, room };

  users.push(user);

  return { user };
};

//remve user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};
// get room
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
