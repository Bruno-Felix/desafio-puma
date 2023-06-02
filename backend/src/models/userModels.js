module.exports = {
    maxUsersNumber: 5,

    Users: [],

    checkUserListLimit() {
        if (this.Users.length >= this.maxUsersNumber){
            throw new Error("Máximo de usuários atingido");
        }
    },

    getUserIndex(username) {
        return this.Users.findIndex(item => item.username == username);
    },

    addUser(user) {
        try {
            this.checkUserListLimit();
            const userIndex = this.getUserIndex(user.username);
            
            if (userIndex != -1) throw new Error('Usuário já está na lista');

            this.Users.push(user);
        }catch(err){
            throw new Error(`${err}`);
        }
    },

    removeUser(username) {
        try {
            const userIndex = this.getUserIndex(username);
            
            if (userIndex == -1) throw new Error('Usuário não está na lista');
            
            this.Users.splice(userIndex, 1);
        }catch(err){
            throw new Error(`${err}`);
        }
    }
}