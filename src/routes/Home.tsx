import { useQuery } from 'react-query';
import styled from 'styled-components';
import { IGetMoviesResult, IMovie, getMovies } from '../api';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMatch } from 'react-router-dom';

const Wrapper = styled.div`
  background: black;
  height: 200vh;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface BannerProps {
  $bgPhoto: string;
}
const Banner = styled.div<BannerProps>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${(props) => props.$bgPhoto});
`;
const Title = styled.h2`
  width: 50%;
  font-weight: 500;
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  width: 50%;
  font-size: 36px;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  border-radius: 10px;
  cursor: pointer;
  overflow-x: auto;
  /* ㄴ grid 내에서 nowrap으로 인한 가로폭 늘어남 방지 css*/
  height: 300px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
interface BoxImgProps {
  $bgPhoto: string;
}
const BoxImg = styled.div<BoxImgProps>`
  width: 100%;
  height: 250px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};
const offset = 6;
const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    y: -30,
    zIndex: 99,
    transition: {
      type: 'tween',
      duration: 0.1,
    },
  },
};
const Info = styled(motion.div)`
  padding: 0 15px;
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.black.lighter};
  line-height: 50px;
  opacity: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;
const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.1,
    },
  },
};
const Overlay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
`;
const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;
const BigTitle = styled.p`
  position: relative;
  top: -34px;
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 24px;
  font-weight: 500;
`;
const BigOverview = styled.p`
  position: relative;
  top: -34px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  height: 350px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
`;
export const Home = () => {
  const nav = useNavigate();
  const bigMovieMatch = useMatch('movies/:movieId');
  const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    nav(`/movies/${movieId}`);
  };
  const clickedMovie: '' | IMovie | undefined =
    bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id + '' === bigMovieMatch.params.movieId);
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner onClick={increaseIndex} $bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                key={index}
                transition={{
                  type: 'tween',
                  duration: 1,
                }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      variants={boxVariants}
                      key={movie.id}
                      initial='normal'
                      whileHover='hover'
                      transition={{
                        type: 'tween',
                      }}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <BoxImg $bgPhoto={makeImagePath(movie.backdrop_path)} />
                      <Info variants={infoVariants}>{movie.title}</Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch && (
              <Overlay
                animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => {
                  nav('/');
                }}
              >
                <BigMovie onClick={(e) => e.stopPropagation()} style={{}} layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${makeImagePath(
                            clickedMovie.backdrop_path + ''
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </Overlay>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};
