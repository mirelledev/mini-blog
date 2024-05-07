//CSS
import styles from "./About.module.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className={styles.about}>
      <h2>
        Sobre o Mini <span>BLOG</span>
        <p>
          Este projeto consiste em um blog feito com React no Front-End e
          FireBase no Back-End
        </p>
        <div>
          <Link to="/posts/create" className="btn">
            Criar Post
          </Link>
        </div>
      </h2>
    </div>
  );
};

export default About;
