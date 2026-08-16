import styles from "./ProductFilm.module.css";

export function ProductFilm() {
  return (
    <section id="product-film" className={styles.section}>
      <header>
        <div className={styles.eyebrow}>SEE IT IN MOTION</div>
        <div className={styles.innerContainer}>
          <div className={styles.title}>
            Learn Czech by listening.
            <br />
            Remember it by design.
          </div>
          <div className={styles.description}>
            Choose any topic and MLUV turns it into a personal audio lesson—translation first, slow Czech next, natural speech after, with smart repetition until every phrase feels familiar.
          </div>
        </div>
      </header>
      <div className={styles.video}>
        <video src="./" />
      </div>
    </section>
  )
}
