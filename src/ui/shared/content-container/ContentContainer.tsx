import type { ReactElement } from 'react';
import styles from './ContentContainer.module.css';
import { PageHeader } from '../page-header';

type ContentContainerProps = {
  children: ReactElement;
  headerText: string;
  headerControls?: ReactElement;
  footer?: ReactElement;
};

/**
 * Content container layout
 */
function ContentContainer(props: ContentContainerProps) {
  const { children, headerControls, headerText, footer } = props;
  return (
    <div className={styles.container}>
      <PageHeader header={headerText} controls={headerControls} />
      <div className={styles.content}>{children}</div>
      {footer}
    </div>
  );
}

export default ContentContainer;
