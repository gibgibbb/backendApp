let users = [];

const findByUsername = (username) => {
  return users.find(user => user.username === username);
};

const create = (user) => {
  const newUser = { ...user, id: users.length + 1 };
  users.push(newUser);
  return newUser;
};

const findById = (id) => {
  return users.find(user => user.id === id);
};

module.exports = {
  findByUsername,
  create,
  findById
};