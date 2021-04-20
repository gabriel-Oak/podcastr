import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import styles from './styles.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <Image
        src="/logo.svg"
        alt="Podcastr"
        width={163}
        height={40}
      />

      <p>O melhor para você ouvir, sempre</p>

      <span>{format(new Date(), 'EEEE, d MMMM', { locale: ptBR })}</span>
    </header>
  );
}

export default Header;