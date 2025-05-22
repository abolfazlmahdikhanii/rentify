import styles from "./infocard.module.css";

export function InfoCards() {
  const cards = [
    {
      title: "درآمد کل",
      value: "۴۵,۲۳۱,۰۰۰",
      unit: "تومان",
      change: "+۲۰.۱٪",
      icon: "money",
    },
    {
      title: "املاک اجاره‌ای",
      value: "۲,۳۵۰",
      unit: "ملک",
      change: "+۱۸.۱٪",
      icon: "home",
    },
    {
      title: "قراردادهای جدید",
      value: "۱,۲۳۴",
      unit: "قرارداد",
      change: "+۱۹٪",
      icon: "document",
    },
    // {
    //   title: "بازدیدهای امروز",
    //   value: "۵۷۳",
    //   unit: "بازدید",
    //   change: "+۲۰۱",
    //   icon: "chart",
    // },
  ]

  return (
    <div className={styles.infoCards}>
      {cards.map((card, index) => (
        <div key={index} className={styles.infoCard}>
          <div className={styles.infoCardHeader}>
            <h3 className={styles.infoCardTitle}>{card.title}</h3>
            <div className={`${styles.infoCardIcon} ${styles[card.icon]}`}></div>
          </div>
          <div className={styles.infoCardContent}>
            <div className={styles.infoCardValue}>
              {card.value} <span className={styles.infoCardUnit}>{card.unit}</span>
            </div>
            <div className={styles.infoCardChange}>{card.change} نسبت به ماه قبل</div>
          </div>
        </div>
      ))}
    </div>
  )
}