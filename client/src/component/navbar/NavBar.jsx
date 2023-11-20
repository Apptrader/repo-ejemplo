import { Link } from 'react-router-dom'
import styles from './navbar.module.css'

function NavBar() {
  return (
    <div className={styles.container}>
        <div className={styles.logoWrapper}>
        <img src='../../../public/images/logo.png' alt='logo' className={styles.logo}/>
        <Link to="/home"><p><span className={styles.info}>Info</span><span className={styles.games}>Games</span></p></Link>
        </div>
        <div className={styles.btnWrapper}>
        <Link to="/home"><span className={styles.navBarBtn}>Home</span></Link>
        <Link to="/about"><span className={styles.navBarBtn}>About</span></Link>
        <Link to="/create"><span className={styles.navBarBtn}>Create</span></Link>
        </div>
    </div>
  )
}

export default NavBar
