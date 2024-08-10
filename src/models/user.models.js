var users = [
  {
    id: 1,
    email: "john@Mail.com",
    username: "john",
    password: "john1234",
  },
];

export default class UserModel {
  constructor(id, email, username, password) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  static getAllUsers() {
    return users;
  }

  static register(data) {
    const newUser = new UserModel(
      users.length + 1,
      data.email,
      data.username,
      data.password
    );
    users.push(newUser);
    return newUser;
  }

  static findUserByEmail(email) {
    return users.find((user) => user.email === email);
  }

  static findUserByUsername(username) {
    return users.find((user) => user.username === username);
  }

  static login(data) {
    const user = users.find(
      (user) => user.username == data.username && user.password == data.password
    );

    if (user) {
      return user;
    } else {
      return null; // Return the user object if the login succeeded
    }
  }
}
