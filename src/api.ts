const API_KEY = 'c7300e6dc631fef9451d69f74f7fc07d';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: object;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}

export function getSearchResults(keyword: string, page: number) {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?query=dune&include_adult=false&language=en-US&page=1&api_key=c7300e6dc631fef9451d69f74f7fc07d`
  ).then((response) => response.json());
}
