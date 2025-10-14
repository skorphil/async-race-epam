import type { ReactElement } from 'react';
import styles from './PageHeader.module.css';

type PageHeaderProps = {
  header: string;
  controls?: ReactElement;
};

function PageHeader(props: PageHeaderProps) {
  const { controls, header } = props;
  return (
    <header className={styles.header}>
      <h2>{header}</h2>
      {controls}
    </header>
  );
}

export default PageHeader;
