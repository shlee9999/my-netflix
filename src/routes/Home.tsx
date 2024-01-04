import { useQuery } from 'react-query';
import styled from 'styled-components';
import { IGetMoviesResult, getMovies } from '../api';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';

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
  background-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),
    url(${(props) => props.$bgPhoto});
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
    scale: 1.3,
    y: -30,
    transition: {
      delay: 0.2,
      type: 'tween',
      duration: 0.2,
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
      delay: 0.2,
      type: 'tween',
      duration: 0.2,
    },
  },
};
export const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
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

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}
          >
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
                      variants={boxVariants}
                      key={movie.id}
                      initial='normal'
                      whileHover='hover'
                      transition={{
                        type: 'tween',
                      }}
                    >
                      <BoxImg $bgPhoto={makeImagePath(movie.poster_path)} />
                      <Info variants={infoVariants}>{movie.title}</Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};
