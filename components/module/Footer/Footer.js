import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.containers}>
        <div className={styles.column}>
          <div className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt="Rentify Logo"
              width={120}
              height={48}
            />
            <p className={styles.tagline}>
              در بین بیش از ۵۰۰۰ آگهی ملکی ثبت شده{" "}
            </p>
            <p className={styles.subTagline}>
              روزانه جستجو کنید و ملک مورد نظرتان را پیدا کنید.{" "}
            </p>
            <div className={styles.socialIcons}>
              <Link href="#" aria-label="Telegram">
                <div className={styles.socialIcon}>
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <div className={styles.socialIcon}>
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
              <Link href="#" aria-label="Facebook">
                <div className={styles.socialIcon}>
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
              <Link href="#" aria-label="Telegram">
                <div className={styles.socialIcon}>
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.certifications}>
            <div className={styles.certItem}>
              <Image
                src="/images/amlak2.png"
                alt="Certification 1"
                width={80}
                height={50}
              />
            </div>
            <div className={styles.certItem}>
              <Image
                src="/images/enamad2.png"
                alt="Certification 2"
                width={80}
                height={50}
              />
            </div>
            <div className={styles.certItem}>
              <Image
                src="/images/enamad.png"
                alt="Certification 3"
                width={80}
                height={50}
              />
            </div>
          </div>
        </div>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>محصول</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="#">ویژگی ها</Link>
              </li>
              <li>
                <Link href="#">قیمت گذاری</Link>
              </li>
              <li>
                <Link href="#">مطالعات موردی</Link>
              </li>
              <li>
                <Link href="#">بررسی کردن</Link>
              </li>
              <li>
                <Link href="#">قیمت گذاری</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>شرکت</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="#">ارتباط با ما</Link>
              </li>
              <li>
                <Link href="#">وبلاگ</Link>
              </li>
              <li>
                <Link href="#">فرهنگ</Link>
              </li>
              <li>
                <Link href="#">درباره</Link>
              </li>
              <li>
                <Link href="#">وبلاگ</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>پشتیبانی</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="#">شرایط کردن</Link>
              </li>
              <li>
                <Link href="#">مرکز کمک</Link>
              </li>
              <li>
                <Link href="#">تنظیمات سرور</Link>
              </li>
              <li>
                <Link href="#">گزارش اشکال</Link>
              </li>
              <li>
                <Link href="#">پشتیبانی چت</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>ارتباط با ما</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>rentify@gmail.com</span>
              </li>
              <li className={styles.contactItem}>
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>۰۲۱-۴۳۰۰۳۰۲۰</span>
              </li>
              <li className={styles.contactItem}>
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  تهران - زعفرانیه - <br />
                  پلاک ۲۱۳
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
