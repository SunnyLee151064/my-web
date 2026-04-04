import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>李文泉</h1>
        <p className={styles.intro}>一个还没疯的程序员</p>
      </main>
    </div>
  );
}