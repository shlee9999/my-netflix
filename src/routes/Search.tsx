import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getSearchResults } from '../api';

const Root = styled.div`
  height: 100vh;
`;

export const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const { data, isLoading } = useQuery(['movies', 'search'], () => getSearchResults(keyword || '', 1));
  console.log(data);
  return <Root>Search</Root>;
};
