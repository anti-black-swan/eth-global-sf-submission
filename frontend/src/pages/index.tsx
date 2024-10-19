import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import DepositComponent from '../components/connected/deposit';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ETH Hackathon | Login</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className={styles.header}>
          <ConnectButton />
      </div>
      <div className={styles.depositinput}>
        <DepositComponent />
      </div>
    </div>
  );
};

export default Home;
