import bcrypt from "bcrypt";
import { config } from "../config";
import UserDao, { IUserModel } from "./../daos/UserDao";
import { IUser } from "../models/User";
import {
  UnableToSaveError,
  InvalidUsernameOrPasswordError,
} from "../utils/LibraryError";

export async function register(user: IUser): Promise<IUserModel> {
  const ROUNDS = config.server.rounds;
  try {
    const hashPassword = await bcrypt.hash(user.password, ROUNDS);
    const saved = new UserDao({ ...user, password: hashPassword });
    return await saved.save();
  } catch (error: any) {
    throw new UnableToSaveError(error.message);
  }
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<IUserModel> {
  const { email, password } = credentials;
  try {
    const user = await UserDao.findOne({ email });
    if (!user) {
      throw new InvalidUsernameOrPasswordError("Invalid username and password");
    } else {
      const validPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );

      if (validPassword) {
        return user;
      } else {
        throw new InvalidUsernameOrPasswordError(
          "Invalid username and password"
        );
      }
    }
  } catch (error: any) {
    throw new InvalidUsernameOrPasswordError(error.message);
  }
}
