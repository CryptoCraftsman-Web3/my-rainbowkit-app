import { NextPage } from "next";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { Field, Label, Input } from '@headlessui/react';
import { useEthersProvider } from '../combiners/clientProvider'
import { useEthersSigner } from "../combiners/clientSigner";
const { ethers } = require('ethers');
import { abis } from '../../contracts/'
import {useWalletClient, useAccount} from 'wagmi';



// import { SwapWidget } from '@uniswap/widgets'
// import '@uniswap/widgets/fonts.css'



const Home: NextPage = () => {
    const [tokenFrom, setTokenFrom] = useState('0xd8983D8e73cb6387e33697480108E465d838aae5 : CPPT');
    const [tokenTo, setTokenTo] = useState('0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9 : WETH');
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');
    const [tokenAmount, setTokenAmount] = useState('0');
    const [wethAmount, setWethAmount] = useState('0');

    const [token1Address, setToken1Address] = useState('0xd8983D8e73cb6387e33697480108E465d838aae5');// CreatePairTestToken token address
    const {address, isConnecting, isDisconnected}  = useAccount()
    const [reserveIn, setReserveIn] = useState('0')
    const [reserveOut, setReserveOut]  = useState('0')

    const provider = useEthersProvider()
    const signer = useEthersSigner()
    const routerAddress = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008'; //Uniswap v2 Router contract address
    const factoryAddress = '0x7E0987E5b3a30e3f2828572Bb659A548460a3003'; // Uniswap V2 Factory contract address
    const token2Address = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'; // WETH token address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const routerContract = new ethers.Contract(routerAddress, abis.router02, signer)

    const handleTokenFromChange = async (e: any) => {
        console.log("1");
        setAmountFrom(e.target.value);
        console.log("1", e.target.value);

        // const amountsOut = await routerContract.getAmountsOut(
        //     ethers.parseUnits(e, 'ether'), // Input amount in wei
        //     [token1Address, token2Address] // Array of token addresses
        // )
        // console.log("1");

        // setAmountTo(ethers.utils.formatUnits(amountsOut[1], 'ether'))
        // console.log("1");

        // Here you would typically calculate amountTo based on exchange rates

    };
    async function handleSwapFromTokenToETH() {
        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
            const routerContract = new ethers.Contract(routerAddress, abis.router02, signer)
            console.log('swapping TokenAmount : ', tokenAmount)
            const amountETH = await routerContract.swapExactTokensForETH(ethers.utils.parseUnits(tokenAmount, 'ether'), 0, [token1Address, token2Address], address, deadline)
            console.log('Swapped amountETH : ' + amountETH[0])
            // handleReserve()
            handlePoolAmount()
        } catch (error) {
            console.error('Error swap ETH:', error);
        }
    }
    async function handleSwapFromETHToToken() {
        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
            const routerContract = new ethers.Contract(routerAddress, abis.router02, signer)
            console.log('swapping ETHAmount : ', wethAmount)
            const value = ethers.utils.parseUnits(String(Number(wethAmount)), 'ether')
            console.log('swapping value : ', value)
            const amountToken = await routerContract.swapETHForExactTokens(ethers.utils.parseUnits(tokenAmount, 'ether'), [token2Address, token1Address], address, deadline, { value: value })
            console.log('Swapped amountToken : ' + amountToken[1])
            // handleReserve()
            handlePoolAmount()
        } catch (error) {
            console.error('Error swap TOKEN:', error);
        }
    }

    const handlePoolAmount = async () => {
        try {
            const factoryContract = new ethers.Contract(factoryAddress, abis.factory, signer)
            const pairAddress = await factoryContract.getPair(token1Address, token2Address)
            const tokenContract = new ethers.Contract(token1Address, abis.cptt, provider)
            const WETHContract = new ethers.Contract(token2Address, abis.weth, provider)
            const reserveIn = await tokenContract.balanceOf(pairAddress)
            const reserveOut = await WETHContract.balanceOf(pairAddress)
            setReserveIn(ethers.utils.formatUnits(reserveIn, 'ether'))
            console.log('reserveIn : ' + ethers.utils.formatUnits(reserveIn, 'ether'))
            setReserveOut(ethers.utils.formatUnits(reserveOut, 'ether'))
            console.log('reserveOut : ' + ethers.utils.formatUnits(reserveOut, 'ether'))
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleTokenToChange = async (e: any) => {
        setAmountTo(e.target.value);
        const amountsIn = await routerContract.getAmountsIn(
            ethers.parseUnits(e, 'ether'), // Input amount in wei
            [token2Address, token1Address] // Array of token addresses
        );
        setAmountFrom(ethers.utils.formatUnits(amountsIn[0], 'ether'));
        // Here you would typically calculate amountFrom based on exchange rates
    };

    const handleSwap = () => {
        // Logic to perform the token swap
        console.log('Swapping', amountFrom, tokenFrom, 'for', amountTo, tokenTo);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>RainbowKit App</title>
                <meta
                    content="Generated by @rainbow-me/create-rainbowkit"
                    name="description"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>
            <div className="flex flex-col container mx-auto sm">
                <h1 className={styles.title}>
                    Swap anytime, anywhere.
                </h1>
                <div className="self-center">
                    <ConnectButton />
                </div>
            </div>
            <div className="flex flex-col max-w-md mx-auto p-4">
                <h1 className="text-lg font-bold text-white mb-4">Swap</h1>

                {/* Token From Field */}
                <Field>
                    <Label className="text-sm font-medium text-white">From</Label>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={amountFrom}
                        onChange={handleTokenFromChange}
                        placeholder="0.00"
                    />
                    <Input
                        className="mt-1 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={tokenFrom}
                        onChange={(e) => setTokenFrom(e.target.value)}
                        placeholder="Token Address or Symbol"
                    />
                </Field>

                {/* Token To Field */}
                <Field>
                    <Label className="text-sm font-medium text-white">To</Label>
                    <Input
                        type="number"
                        min='0'
                        step='0.01'
                        className="mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={amountTo}
                        onChange={handleTokenToChange}
                        placeholder="0.00"
                    />
                    <Input
                        className="mt-1 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={tokenTo}
                        onChange={(e) => setTokenTo(e.target.value)}
                        placeholder="Token Address or Symbol"
                    />
                </Field>

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    className="mt-4 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Swap
                </button>
            </div>
            {/* <div className="Uniswap">
                <SwapWidget />
            </div> */}
        </div>
    );
};

export default Home;
