import axios from 'axios';

export default class DuoAPI {
    constructor(credentials) {
        this.username = credentials.username;
        this.password = credentials.password;
        this.baseUrl = "https://www.duolingo.com/";
        this.jwt = null;
    }

    async login() {
        const result = await axios({
            url: this.baseUrl + "login",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                login: this.username,
                password: this.password
            }
        });

        this.jwt = result.headers.jwt;
        return result.data;
    }

    async getLearnedWords() {
        const result = await axios({
            url: this.baseUrl + "users/" + this.username,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.jwt
            }
        });

        const data = result.data;
        let words = [];

        data.language_data["ja"].skills.forEach(topic => {
            if(topic.learned){
                words = words.concat(topic['words']);
            }
        });

        return words;
    }
}