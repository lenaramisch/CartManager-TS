import domain from "../domain/domain";
import { UserDTO} from './models';
import { UserDomain } from '../domain/models';

module.exports = {
    getAllUsers: async function () {
        try {
            const usersArr = await domain.getAllUsers();
            if (Object.keys(usersArr).length === 0) {
                return { status: 404, message: 'No users found'};
            }
            if (usersArr instanceof Error) {
                return { status: 500, message: 'Internal Server Error'};
            }
            const dtoUsers = usersArr.map((user: UserDomain) => new UserDTO(user.id, user.username));
            return { status: 200, data: dtoUsers };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    addUser: async function (username: string) {
        try {
            if (!username) {
                return { status: 400, message: 'Bad Request' };
            }
            domain.addUser(username);
            return { status: 201, message: `Added user ${username}` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    getUserById: async function (userId: number) {
        if (isNaN(userId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const userResult = await domain.getUserById(userId);
            if (userResult instanceof Error) {
                return { status: 500, message: 'Internal Server Error'};
            }
            if (userResult instanceof Error) {
                return { status: 500, message: 'Internal Server Error'};
            }
            const userDto = new UserDomain(userResult.id, userResult.username)
            if (Object.keys(userDto).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userId})`};
            }
                return { status: 200, data: userDto };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    updateUserById: async function (userId: number, username: string) {
        if (isNaN(userId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            //check if user exists;
            const userResult = await domain.getUserById(userId);
            if (Object.keys(userResult).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userId})` };
            }
            await domain.updateUserById(userId, username);
            return { status: 200, message: 'Update done' };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    deleteUserById: async function (userId: number) {
        if (isNaN(userId)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            //check if user exists;
            const userResult = await domain.getUserById(userId);
            if (Object.keys(userResult).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userId})` };
            }
            await domain.deleteUserById(userId);
            return { status: 200, message: `Deleted user (user ID: ${userId})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
};
