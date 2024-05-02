import axios from "axios";

const API_KEY = '43582333-b71aa2f7f7d4d82dcec6d74cc';
const BASE_URL = 'https://pixabay.com/api/'

export default class NewApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }
    fetchArticles() {
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;
        return axios.get(url);     
    }

    resetpage() {
        this.page = 1;
    }

    incrementPage() {
        this.page += 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery =  newQuery
        }   
}