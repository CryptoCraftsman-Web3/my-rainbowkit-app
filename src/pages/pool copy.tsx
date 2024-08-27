async function removeLiquidity() {
    const liquidityAmount = getAmountInWei(liquidity);
    try {
        const pairAddress = await factory_contract.getPair(token1Address, token2Address);
        const lpToken = await new ethers.Contract(pairAddress, abis.lptoken, signer);
        const removeLiquidity = await lpToken.balanceOf(signer?.address);           //TotalLpToken Amount
        setTotalLiquidity(removeLiquidity);
        console.log("TotalLPToken:", removeLiquidity)
        // console.log("LiquidityAmount:", liquidityAmount)

        console.log("slierValue=",sliderValue);
        // const selected_liquidity = getAmountFromWei(String(Number(lpToken) * (Number(sliderValue) / 100)));
        // const selected_liquidity = getAmountInWei(String(Number(removeLiquidity) * (Number(sliderValue) / 100)))// remove percentage TotalLiquidity

        const liquidityAmount = getAmountFromWei(removeLiquidity) * sliderValue/100;
        console.log("///", liquidityAmount);
        const liquidityAmountDisplay = liquidityAmount
        setLiquidity(liquidityAmount.toString());
        const removeLiquidityAmount = getAmountInWei(liquidityAmount);

        // const removeLiq = ethers.utils.parseEther(String(Number(totalLiquidity) * (Number(liquidity) / 100)))// remove percentage TotalLiquidity

        const approveTx = await lpToken.approve(routerAddress, removeLiquidity); // before removeLiquidity, approve from owner's LP to router
        await approveTx.wait()

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



async function removeLiquidity() {
    const liquidityAmount = getAmountInWei(liquidity);
    try {
        const pairAddress = await factory_contract.getPair(token1Address, token2Address);
        const lpToken = await new ethers.Contract(pairAddress, abis.lptoken, signer);
        const removeLiquidity = await lpToken.balanceOf(signer?.address);           //TotalLpToken Amount
        setTotalLiquidity(removeLiquidity);
        console.log("TotalLPToken:", removeLiquidity)
        // console.log("LiquidityAmount:", liquidityAmount)

        console.log("slierValue=", sliderValue);
        // const selected_liquidity = getAmountFromWei(String(Number(lpToken) * (Number(sliderValue) / 100)));
        // const selected_liquidity = getAmountInWei(String(Number(removeLiquidity) * (Number(sliderValue) / 100)))// remove percentage TotalLiquidity

        const liquidityAmount = getAmountFromWei(removeLiquidity) * sliderValue / 100;
        console.log("///", liquidityAmount);
        const liquidityAmountDisplay = liquidityAmount
        // setLiquidity(liquidityAmount.toString());
        // const removeLiquidityAmount = getAmountInWei(liquidityAmount);

        const removeLiquidityAmount = getAmountInWei(liquidity)

        const approveTx = await lpToken.approve(routerAddress, removeLiquidity); // before removeLiquidity, approve from owner's LP to router
        setToken1AmountR('Transaction sent. Waiting for confirmation...');
        setToken2AmountR('Transaction sent. Waiting for confirmation...');
        await approveTx.wait()

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

