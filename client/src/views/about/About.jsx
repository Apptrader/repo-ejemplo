import styles from './about.module.css'

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Welcome to <span className={styles.info}>Info</span><span className={styles.games}>Games</span>!</div>
      <img className={styles.image} src="https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/characters/mushroom-kingdom/chars-mariogroup" alt='pi photo' />
      <p className={styles.information}> My name is Ramiro Alet, welcome to my PI!</p>
      <p className={styles.information}>
      Info Games is an individual project for the Henry boot camp. We utilize an API to navigate through video games, allowing users to view their information, platforms, and genres. Additionally, you can create a new game and have it displayed on the home page. The project incorporates technologies such as React.js, Node.js, Sequelize, PostgreSQL, HTML, and CSS Modules. Feel free to explore the site, search, and filter results. Enjoy your time on the platform!
      </p>
    </div>
  )
}

export default About
