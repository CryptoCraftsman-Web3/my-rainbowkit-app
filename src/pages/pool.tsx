import { useEthersProvider } from '../combiners/clientProvider'
import { useEthersSigner } from "../combiners/clientSigner";
import { abis } from '../../contracts/'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button, Field, Label, Input } from '@headlessui/react'
import { SetStateAction, useState } from 'react'
import clsx from 'clsx'
import styles from '../styles/Home.module.css';
const { ethers } = require('ethers');

const categories = [
    {
        name: 'CreatePair',
    },
    {
        name: 'Add Liquidity',
    },
    {
        name: 'Remove Liquidity',
    },
]

const pool = () => {

    const [token1Amount, setToken1Amount] = useState(0)
    const [token2Amount, setToken2Amount] = useState(0)
    const [liquidity, setLiquidity] = useState("0")
    const [pairAddress, setPairAddress] = useState<string>();
    const [mintedAmount, setMintedAmount] = useState<string>();

    const [token1AmountR, setToken1AmountR] = useState("0")
    const [token2AmountR, setToken2AmountR] = useState("0")
    const [totalLiquidity, setTotalLiquidity] = useState('0')
    const [sliderValue, setSliderValue] = useState<number>(50);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSliderValue(parseInt(event.target.value, 10));
        console.log("VALUE:",event.target.value)
        // const a = getAmountFromWei(Number(totalLiquidity) * parseInt(event.target.value, 10) / 100)

        const percentage = parseInt(event.target.value, 10) / 100;
        const a = parseFloat(totalLiquidity)
        console.log("a:", a)
        const b = a * percentage;
        console.log("Percentage:", percentage);
        console.log("b:", b);
        setLiquidity(b.toString())
        // const b = ethers.formatUnits(percentage.toString(),  "ether");
        // const c = a * percentage;
        // setLiquidity(getAmountFromWei(c).toString())
    };
    const [token1Address, setToken1Address] = useState('0xd8983D8e73cb6387e33697480108E465d838aae5');// CreatePairTestToken token address
    // const [token1Address, setToken1Address] = useState('0xe5B8f6A62f71973f36C5f0C8D8f6cacF7a9Ba72a');// CreatePairTestToken token address
    // const [token1Address, setToken1Address] = useState('0x8C56fE7E2bcec0B138424e14840044116DB26A66');// CreatePairTestToken token address
    const handleToken1AddressChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setToken1Address(e.target.value);
    };

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const provider = useEthersProvider()
    const signer = useEthersSigner()
    const routerAddress = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008'; //Uniswap v2 Router contract address
    const factoryAddress = '0x7E0987E5b3a30e3f2828572Bb659A548460a3003'; // Uniswap V2 Factory contract address
    const token2Address = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'; // WETH token address

    function getAmountInWei(amount: string | number) {
        return ethers.parseEther(amount.toString(), "ether");
    }
    function getAmountFromWei(amount: string | number) {
        return Number(ethers.formatUnits(amount.toString(), "ether"));
    }
    const factory_contract = new ethers.Contract(factoryAddress, abis.factory, signer);
    const router_contract = new ethers.Contract(routerAddress, abis.router02, signer);


    // window.onload = async () => {
    //     console.log("####");
    //     const pairAddressTest = await factory_contract.getPair(token1Address, token2Address);
    //     console.log("####");
    //     const lpToken = await new ethers.Contract(pairAddressTest, abis.lptoken, signer);
    //     console.log("####");
    //     const removeLiquidity = await lpToken.balanceOf(signer?.address);           //TotalLpToken Amount      
    //     totalLiquidity = removeLiquidity;
    // }

    async function getStatus() {
        console.log("####");
        const pairAddressTest = await factory_contract.getPair(token1Address, token2Address);
        console.log("####", pairAddressTest);
        const lpToken = await new ethers.Contract(pairAddressTest, abis.lptoken, signer);
        console.log("####", lpToken);
        const removeLiquidity = await lpToken.balanceOf(signer?.address);           //TotalLpToken Amount
        console.log(removeLiquidity)
        setTotalLiquidity(getAmountFromWei(removeLiquidity).toString())
    }

    // const factory_contract = new ethers.Contract(factoryAddress, abis.factory, provider);
    async function createPair() {
        try {
            const factory_contract = new ethers.Contract(factoryAddress, abis.factory, signer);
            const pairAddress = await factory_contract.getPair(token1Address, token2Address)
            if (pairAddress)
                await pairAddress.wait()
            console.log("#####", pairAddress)
            if (pairAddress !== "0x00") {
                window.alert("Pair already exists at address:\n" + pairAddress);
                setPairAddress(pairAddress);
            } else {
                const new_pairAddress = await factory_contract.createPair(token1Address, token2Address);
                alert("Pair successfully created at address:\n" + new_pairAddress);
                setPairAddress(new_pairAddress)
                console.log('Pair is created pairAddress=%s', new_pairAddress);
            }
        } catch (error) {
            window.alert("An error occured. Pair already exists.");
            const errorObj = JSON.stringify(error);
            console.log("#########");
            console.log(JSON.stringify(error))
            console.log("########")
        }
    }

    async function addLiquidity() {
        try {
            const pairAddress = await factory_contract.getPair(token1Address, token2Address);
            const lpToken = await new ethers.Contract(pairAddress, abis.lptoken, provider);
            const preBalance = await lpToken.balanceOf(signer?.address);
            // if(preBalance)
            //     await preBalance.wait();
            const preMinted = getAmountFromWei(preBalance);
            setMintedAmount("Transaction is pendding now!");

            const token1Contract = new ethers.Contract(token1Address, abis.cptt, signer);
            const token2Contract = new ethers.Contract(token2Address, abis.weth, signer);

            const token1AmountInWei = getAmountInWei(token1Amount);
            const token2AmountInWei = getAmountInWei(token2Amount);

            const approveTx1 = await token1Contract.approve(routerAddress, token1AmountInWei);
            if (approveTx1)
                await approveTx1.wait();
            const approveTx2 = await token2Contract.approve(routerAddress, token2AmountInWei);
            if (approveTx2)
                await approveTx2.wait();

            console.log(signer?.address)
            const router_contract = new ethers.Contract(routerAddress, abis.router02, signer);
            const tx = await router_contract.addLiquidity(token1Address, token2Address, token1AmountInWei, token2AmountInWei, 0, 0, signer?.address, deadline);
            if (tx) {
                const receipt = await tx.wait();
                console.log('Liquidity added', receipt);

                console.log(receipt.events);
                const lpToken = await new ethers.Contract(pairAddress, abis.lptoken, provider);
                const preBalance = await lpToken.balanceOf(signer?.address);
                const afterMinted = getAmountFromWei(preBalance);
                const mintedAmount = afterMinted - preMinted;
                setMintedAmount(mintedAmount.toString());
                const events = receipt.events?.filter((event: { event: string; }) => event.event === 'LiquidityAdded'); // Adjust event name if necessary
                console.log(events.length);
                if (events.length > 0) {
                    const liquidity = events[0].args[2]; // Assuming liquidity is returned as the third argument
                    console.log(`Liquidity added: ${ethers.utils.formatUnits(liquidity, 18)}`); // Adjust decimals as needed
                } else {
                    console.log("No LiquidityAdded event found in transaction receipt.");
                }
            }
        } catch (error) {
            console.log("error", JSON.stringify(error))
        }
    }

    async function removeLiquidity() {
        console.log("####");
        // const liquidityAmount = getAmountInWei(liquidity);
        console.log("####");
        try {
            console.log("####");
            const pairAddress = await factory_contract.getPair(token1Address, token2Address);
            const lpToken = await new ethers.Contract(pairAddress, abis.lptoken, signer);
            const totalLP = await lpToken.balanceOf(signer?.address);           //TotalLpToken Amount
            
            console.log("####");
            console.log("liquidity=",liquidity);
            const removeLiquidityAmount = getAmountInWei(liquidity)
            console.log("####");

            const approveTx = await lpToken.approve(routerAddress, totalLP); // before removeLiquidity, approve from owner's LP to router
            setToken1AmountR('Transaction sent. Waiting for confirmation...');
            setToken2AmountR('Transaction sent. Waiting for confirmation...');
            await approveTx.wait()

            console.log("####");
            const router_contract = new ethers.Contract(routerAddress, abis.router02, signer);
            const tx = await router_contract.removeLiquidity.staticCall(token1Address, token2Address, removeLiquidityAmount, 0, 0, signer?.address, deadline);
            console.log("###", tx);
            // const receipt = await tx.wait();

            console.log(tx.amountA.toString())
            console.log(tx.amountB.toString())
            const realTx = await router_contract.removeLiquidity(token1Address, token2Address, removeLiquidityAmount, 0, 0, signer?.address, deadline);
            if (realTx) {
                console.log('Transaction sent. Waiting for confirmation...');
                const receipt = await realTx.wait();
                console.log('Transaction confirmed. Receipt:', receipt);
                const amountA = getAmountFromWei(tx.amountA.toString());
                const amountB = getAmountFromWei(tx.amountB.toString());
                setToken1AmountR(amountA.toString());
                setToken2AmountR(amountB.toString());
            }

        } catch (error) {
            console.error('Error in removeLiquidity:', error);
        }
    }

    let [isOpen, setIsOpen] = useState(true)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }
    return (
        <>
            <div className="flex flex-col container mx-auto sm">
                <h1 className={styles.title}>
                    Liquidty Operation
                </h1>
                <div className="self-center">
                    <ConnectButton />
                </div>
            </div>
            <div className="flex h-screen w-full justify-center pt-10 px-4">
                <div className="w-full max-w-md">
                    <TabGroup>
                        <TabList className="flex gap-4">
                            {categories.map(({ name }) => (
                                <Tab
                                    key={name}
                                    onClick={getStatus}
                                    className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    {name}
                                </Tab>
                            ))}
                        </TabList>
                        <TabPanels className="mt-3">
                            <TabPanel className="rounded-xl bg-white/5 p-3">
                                <ul>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">CreatePairTestToken Address:</Label>
                                                <Input className={clsx(
                                                    // pointer-events-none
                                                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                )} defaultValue={token1Address} onChange={handleToken1AddressChange} />
                                                {/* )} value={token1Address} onChange={handleToken1AddressChange}/> */}
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">WETH Token Address:</Label>
                                                <Input className={clsx(
                                                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                )} defaultValue={token2Address} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5 align-middle">
                                        <div className="flex justify-center self-center">
                                            <Button onClick={createPair} className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                CreatePair
                                            </Button>
                                        </div>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Pair Address</Label>
                                                <Input defaultValue="0x4D2c722a3084282F1a6b05d18c6B8EB28cf16E4E"
                                                    // {pairAddress} 
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                </ul>
                            </TabPanel>














                            <TabPanel className="rounded-xl bg-white/5 p-3">
                                <ul>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">CreatePairTestToken Amount:</Label>
                                                <Input type="number"
                                                    placeholder="0.0"
                                                    value={token1Amount}
                                                    min="0"
                                                    step='0.001'
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value)
                                                        setToken1Amount(isNaN(value) ? 0 : value)
                                                    }}
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">WETH Token Amount:</Label>
                                                <Input type="number"
                                                    placeholder="0.0"
                                                    value={token2Amount}
                                                    min="0"
                                                    step="0.001"
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value)
                                                        setToken2Amount(isNaN(value) ? 0 : value)
                                                    }}
                                                    className={clsx(
                                                        'mt-3 block w-full editable-false rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Liquidity Token Address:</Label>
                                                <Input type="text"
                                                    placeholder="0x4D2c722a3084282F1a6b05d18c6B8EB28cf16E4E"
                                                    value={pairAddress}
                                                    onChange={(e) => { setPairAddress(e.target.value) }}
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5 items-center justify-center">
                                        <div className="flex justify-center">
                                            <Button onClick={addLiquidity} className="inline-flex items-center justify-center align-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                AddLiquidity
                                            </Button>
                                        </div>

                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Minted Liquidity Token Amount:</Label>
                                                <Input type="text"
                                                    placeholder="0.0"
                                                    defaultValue={mintedAmount}
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                </ul>
                            </TabPanel>







                            <TabPanel className="rounded-xl bg-white/5 p-3">
                                <ul>
                                    {/* <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5 items-center justify-center">
                                        <div className="flex justify-center">
                                            <Button onClick={getStatus} className="inline-flex items-center justify-center align-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                GetInitialStatus
                                            </Button>
                                        </div>

                                    </li> */}
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Total LiquidityToken Amount:</Label>
                                                <Input type="number"
                                                    value={totalLiquidity}
                                                    onChange={(e) => { setTotalLiquidity(e.target.value) }}
                                                    // onChange={(e) => {
                                                    //     const value = parseFloat(e.target.value)
                                                    //     setLiquidity(isNaN(value) ? 0 : value)
                                                    // }}
                                                    placeholder="0.0"
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Token</Label>
                                                <div className="relative mb-6">
                                                    <input id="labels-range-input" type="range" min='0' max='100' step='1' value={sliderValue} onChange={handleSliderChange}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">0%</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">25%</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">50%</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">75%</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">100%</span>
                                                </div>
                                                <Label className="text-sm/6 font-medium text-white">Percentage(%)</Label>
                                                <input type='text' value={sliderValue} onChange={handleSliderChange}/>
                                                <br></br>
                                                <Label className="text-sm/6 font-medium text-white">Selected Liquidity Token Amount:</Label>
                                                <Input type="number"
                                                    value={liquidity}
                                                    onChange={(e) => { setLiquidity(e.target.value) }}
                                                    placeholder="0.0"
                                                    className={clsx(
                                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                    )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5 items-center justify-center">
                                        <div className="flex justify-center">
                                            <Button onClick={removeLiquidity} className="inline-flex items-center justify-center align-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                RemoveLiquidity
                                            </Button>
                                        </div>

                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Received TestToken Amount:</Label>
                                                <Input type="text" value={token1AmountR} onChange={(e) => { setToken1AmountR(e.target.value) }} className={clsx(
                                                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                )} />
                                            </div>
                                        </Field>
                                    </li>
                                    <li className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                                        <Field>
                                            <div className="flex flex-col">
                                                <Label className="text-sm/6 font-medium text-white">Received WETH Token Amount:</Label>
                                                <Input type="text" value={token2AmountR} onChange={(e) => { setToken2AmountR(e.target.value) }} className={clsx(
                                                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                                )} />
                                            </div>
                                        </Field>
                                    </li>
                                </ul>
                            </TabPanel>
                        </TabPanels>
                        {/* 
          <TabPanels className="mt-3">
            {categories.map(({ name, posts }) => (
              <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                <ul>
                  {posts.map((post) => (
                    <li key={post.id} className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5">
                      <a href="#" className="font-semibold text-white">
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                      <ul className="flex gap-2 text-white/50" aria-hidden="true">
                        <li>{post.date}</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.commentCount} comments</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.shareCount} shares</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
          </TabPanels> */}

                    </TabGroup>
                </div>
            </div>
        </>
    )
}

export default pool