import React, { useState } from 'react'
// import styled from 'styled-components'
import { Modal, Text, Flex, Image, Button, BalanceInput, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
// import { BIG_TEN } from 'utils/bigNumber'
import { useCakeVaultContract } from 'hooks/useContract'
// import useTheme from 'hooks/useTheme'
import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Pools/types'
import ModalActions from 'components/ModalActions'
import { convertCakeToShares } from '../../helpers'
import FeeSummary from './FeeSummary'

interface VaultStakeModalProps {
  pool: Pool
  stakingMax: BigNumber
  stakingTokenPrice: BigNumber
  userInfo: VaultUser
  isRemovingStake?: boolean
  pricePerFullShare?: BigNumber
  vaultFees?: VaultFees
  setLastUpdated: () => void
  onDismiss?: () => void
}

// const StyledButton = styled(Button)`
//   flex-grow: 1;
// `

const VaultStakeModal: React.FC<VaultStakeModalProps> = ({
  pool,
  stakingMax,
  stakingTokenPrice,
  pricePerFullShare,
  userInfo,
  isRemovingStake = false,
  vaultFees,
  onDismiss,
  setLastUpdated,
}) => {
  const { account } = useWallet()
  const { stakingTokenName, tokenDecimals: stakingTokenDecimals } = pool
  const cakeVaultContract = useCakeVaultContract()
  // const { theme } = useTheme()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  // const [percent, setPercent] = useState(0)
  const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(userInfo.lastDepositedTime))
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())
  // const BASE_EXCHANGE_URL = 'https://exchange.treedefi.com'

  const handleStakeInputChange = (input: string) => {
    // if (input) {
    //   const convertedInput = new BigNumber(input).multipliedBy(BIG_TEN.pow(stakingTokenDecimals))
    //   const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
    //   setPercent(percentage > 100 ? 100 : percentage)
    // } else {
    //   setPercent(0)
    // }
    setStakeAmount(input)
  }

  // const handleChangePercent = (sliderPercent: number) => {
  //   if (sliderPercent > 0) {
  //     const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
  //     const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingTokenDecimals, stakingTokenDecimals)
  //     setStakeAmount(amountToStake)
  //   } else {
  //     setStakeAmount('')
  //   }
  //   setPercent(sliderPercent)
  // }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true)
    const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare)
    // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
    const triggerWithdrawAllThreshold = new BigNumber(1000000000000)
    const sharesRemaining = userInfo.shares.minus(shareStakeToWithdraw.sharesAsBigNumber)
    const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold)

    if (isWithdrawingAll) {
      cakeVaultContract.methods
        .withdrawAll()
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', () => {
          // console.log('success')
          setPendingTx(false)
          onDismiss()
          setLastUpdated()
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          setPendingTx(false)
        })
    } else {
      cakeVaultContract.methods
        .withdraw(shareStakeToWithdraw.sharesAsBigNumber.toString())
        // .toString() being called to fix a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        .send({ from: account })
        .on('sending', () => {
          setPendingTx(true)
        })
        .on('receipt', () => {
          // console.log('success')
          setPendingTx(false)
          onDismiss()
          setLastUpdated()
        })
        .on('error', (error) => {
          console.error(error)
          // Remove message from toast before prod
          setPendingTx(false)
        })
    }
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    // console.log("convertedStakeAmount ", convertedStakeAmount)
    cakeVaultContract.methods
      .deposit(convertedStakeAmount.toString())
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        // console.log('success')
        setPendingTx(false)
        onDismiss()
        setLastUpdated()
      })
      .on('error', (error) => {
        console.error(error)
        // Remove message from toast before prod

        setPendingTx(false)
      })
  }

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingTokenDecimals)
    setPendingTx(true)
    // unstaking
    if (isRemovingStake) {
      handleWithdrawal(convertedStakeAmount)
      // staking
    } else {
      handleDeposit(convertedStakeAmount)
    }
  }

  return (
    <Modal
      title={isRemovingStake ? 'Unstake' : 'Stake in Pool'}
      onDismiss={onDismiss}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? 'Unstake' : 'Stake'}:</Text>
        <Flex alignItems="center" minWidth="70px">
  {/*        <Image src={`/images/tokens/${stakingTokenName}.png`} width={24} height={24} alt={stakingTokenName} /> */}
          <Image src="/images/tokens/seed.png" width={24} height={24} alt={stakingTokenName} />
          <Text ml="4px" bold>
            {stakingTokenName}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={`~${usdValueStaked || 0} USD`}
      />
      <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        Balance: {getFullDisplayBalance(stakingMax, stakingTokenDecimals)}
      </Text>
      {isRemovingStake && hasUnstakingFee && (
        <FeeSummary
          stakingTokenSymbol={stakingTokenName}
          lastDepositedTime={userInfo.lastDepositedTime}
          vaultFees={vaultFees}
          stakeAmount={stakeAmount}
        />
      )}
      <ModalActions>
        <Button fullWidth variant="secondary" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        >
          {pendingTx ? 'Confirming' : 'Confirm'}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default VaultStakeModal
