import VideoGameCards from "../../component/videogame_cards/VideoGameCards.jsx"
import { useDispatch, useSelector } from 'react-redux';
import { getGenres, getPlatforms, getVideogames } from "../../redux/actions/index.js";
import { useEffect } from "react";

function Home() {
  const videogames = useSelector((state) => state?.videogames)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getVideogames())
    dispatch(getGenres())
    dispatch(getPlatforms())
  }, [])

  videogames && console.log(videogames)

  return (
    <div>
      <VideoGameCards />
    </div>
  )
}

export default Home
