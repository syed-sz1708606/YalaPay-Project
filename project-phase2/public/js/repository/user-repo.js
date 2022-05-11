class UserRepo {

    async getAllUsers() {
        const data = await fetch("/api/users")
        const users = await data.json()
        return users
    }

    async getUserByEmail(email) {
        const data = await fetch(`/api/users/email/${email}`)
        const user = await data.json()
        return user
    }

}
export default new UserRepo()