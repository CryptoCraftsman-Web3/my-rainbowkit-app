import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEthersProvider } from '../combiners/clientProvider'
import { useEthersSigner } from "../combiners/clientSigner";
import { ethers } from 'ethers'
import { abis } from '../../contracts/'
import { useWalletClient } from "wagmi";
import { Button } from '@headlessui/react'



const Home: NextPage = () => {
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const routerAddress = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008'; //Uniswap v2 Router contract address
  const factoryAddress = '0x7E0987E5b3a30e3f2828572Bb659A548460a3003'; // Uniswap V2 Factory contract address

  const token1Address = '0x01f11dB48F21D9dC32376134401BC9358DA96716'; // ET1 token address
  const token2Address = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'; // WETH token address

  // const factory_contract = new ethers.Contract(factoryAddress, abis.factory, provider);
  const { data: walletClient } = useWalletClient()
  async function createPair() {
    try {
      console.log('New pair creating....');

      const hash = await walletClient?.writeContract({
        address: factoryAddress,
        abi: abis.factory,
        functionName: 'createPair',
        args: [token1Address, token2Address]
      })
      console.log('New pair created !!!....', hash);

    } catch (error) {
      console.error('Error creating pair:', error);

    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          UniSwap
        </h1>
        <ConnectButton />
        <div className={styles.grid}>
          <a className={styles.card} href="/swap">
            <h2 className='items-center justify-center'>Swap</h2>
            <p>Swap anytime, anywhere. You can swap your CustomToken to WETH</p>
          </a>
          <a className={styles.card} href="/pool">
            <h2>Add/Remove Liquidity</h2>
            <p>You can create pair and Add/Remove liquidity.</p>
          </a>


        </div>
      </main>
    </div>
  );
};

export default Home;
