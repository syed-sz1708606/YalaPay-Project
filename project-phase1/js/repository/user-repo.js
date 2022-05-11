const db = new Localbase('yalapay.db')

export class UserRepo {
    addUser(user) {
        try {
            return db.collection('user').add(user)
        } catch (e) {
            console.log(e)
        }
    }

    async getUserByEmail(email) {
        try {
            const users = await this.getAllUsers();
            for (const user of users) {
                if (user.email == email) return user
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    getAllUsers() {
        try {
            return db
                .collection('user')
                .get()
        } catch (e) {
            console.log(e)
        }
    }
}
