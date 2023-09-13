import styles from './Spinner.module.css';
import { SpinnerProps } from './types';

export default function Spinner({}: SpinnerProps) {
  return <div className={styles.spinner} />;
}
