import User from "../models/user.model.js";
import BaseRepository from "./base.repository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // Additional methods specific to user operations can be defined here
  // For example, findByEmail, findByUsername, etc.
}

export default UserRepository;
