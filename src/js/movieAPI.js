import axios from 'axios';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'bc23d88e8c379b88dcc9e69c75bc8f78';

//? Create class 'MovieAPI'

export class MovieAPI {
  constructor() {
    this.page = 1;
    this.language = 'en-US';
    this.adult = false;
    this.id = null;
  }

  async fetchMovieTrending(page) {
    page = page || 1;
    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}trending/movie/day`, {
        params: {
          api_key: API_KEY,
          page: page,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMovieTop(page) {
    page = page || 1;
    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: API_KEY,
          page: page,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMovieKeyword(searchQuery, page) {
    page = page || 1;

    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}search/movie`, {
        params: {
          api_key: API_KEY,
          language: this.language,
          query: searchQuery,
          page: page,
          include_adult: this.adult,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMovieById() {
    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}movie/${this.id}`, {
        params: {
          api_key: API_KEY,
          language: this.language,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMGenres() {
    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}genre/movie/list`, {
        params: {
          api_key: API_KEY,
          language: this.language,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMovieYouTube() {
    try {
      Loading.pulse({
        svgColor: 'orange',
      });
      const response = await axios.get(`${BASE_URL}movie/${this.id}/videos`, {
        params: {
          api_key: API_KEY,
          language: this.language,
        },
      });
      Loading.remove();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
