import { NextPage } from "next";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { Field, Label, Input } from '@headlessui/react';



const Home: NextPage = () => {
    const [tokenFrom, setTokenFrom] = useState('');
    const [tokenTo, setTokenTo] = useState('');
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');

    const handleTokenFromChange = (e) => {
        setAmountFrom(e.target.value);
        // Here you would typically calculate amountTo based on exchange rates
    };

    const handleTokenToChange = (e) => {
        setAmountTo(e.target.value);
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
                        className="mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={amountFrom}
                        onChange={handleTokenFromChange}
                        placeholder="0.0"
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
                        className="mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white"
                        value={amountTo}
                        onChange={handleTokenToChange}
                        placeholder="0.0"
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
        </div>
    );
};

export default Home;
