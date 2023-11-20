import { useEffect } from 'react';
import styles from './landing.module.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('home');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  useEffect(() => {
    const component = document.getElementById('landingComponent');
    if (component) {
      component.focus();
    }
  }, []);

  return (
    <div
      id="landingComponent"
      tabIndex="0"
      onKeyDown={handleKeyPress}
    >
      <div className={styles.welcomeCard}>
        <h1>Bienvenido a InfoGames</h1>
        <div className={styles.infoWrapper}>
          <p className={styles.infoParagraph}>
            Aquí encontrarás información útil sobre Videojuegos, explora nuestra biblioteca e inicia tu aventura gamer
          </p>
          <p className={styles.infoParagraph}>Presiona ENTER para continuar</p>
          <img
            src="../../../public/images/enter.png"
            alt="enter button"
            className={styles.enterImg}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Landing;
