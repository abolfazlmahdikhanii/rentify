import styles from "./infocard.module.css";

export function InfoCards({data}) {

  return (
    <div className={styles.infoCards}>
      {data?.map((card, index) => (
        <div key={index} className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <h3 className={styles.infoCardTitle}>{card.title}</h3>
            <div className={`${styles.infoCardIcon} ${styles[card.icon]}`}></div>
          </div>
          <div className={styles.infoCardContent}>
            <div className={styles.infoCardValue}>
              {card.value} <span className={styles.infoCardUnit}>{card.unit}</span>
            </div>
            <div className={`${styles.infoCardChange} ${card.changeType==="increase"?styles.increase:styles.decrease}`}>{card.change!==null?card.change:card.changeType==="increase"?1:-1} نسبت به ماه قبل</div>
          </div>
        </div>
      ))}
    </div>
  )
}