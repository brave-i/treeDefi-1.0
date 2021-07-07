import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

import QuestionHelper from 'components/QuestionHelper'
import useI18n from 'hooks/useI18n'

const Wrapper = styled(CardHeader) <{ isFinished?: boolean; activeBackground?: string; isAutoSeed?: boolean }>`
  background: ${({ isFinished, activeBackground, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[activeBackground]};
  border-radius: ${({ theme, isAutoSeed }) =>
    isAutoSeed ? '31px 31px 0 0' : `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  image: string
  sousId: number
  isOldSyrup: boolean
  isFinished?: boolean
  isComing?: boolean
  isAutoSeed?: boolean
}> = ({
  earningTokenSymbol,
  stakingTokenSymbol,
  image,
  sousId,
  isOldSyrup = false,
  isFinished = false,
  isComing = false,
  isAutoSeed = false,
}) => {
    const TranslateString = useI18n()
    const isPromoted = earningTokenSymbol === 'TREE' && stakingTokenSymbol === 'SEED'
    const activeBackground = isPromoted ? 'bubblegum' : 'cardHeader'

    return (
      <Wrapper isAutoSeed={isAutoSeed} isFinished={isFinished} activeBackground={activeBackground}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Flex alignItems="center">
              {isComing ? (
                <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
                  {TranslateString(414, 'Your Project?')}
                </Heading>
              ) : isAutoSeed ? (
                <Heading color='body' size="lg">
                  {TranslateString(9999, 'Auto SEED')}
                </Heading>
              ) : (
                <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
                  {isOldSyrup && '[OLD]'} {earningTokenSymbol} {TranslateString(348, 'Pool')}
                </Heading>
              )}

              {sousId === 6 && (
                <QuestionHelper
                  text={TranslateString(9999, 'Rewards (250 TREE) are provided directly from the Dev Vault.')}
                />
              )}
              {sousId === 19 && (
                <QuestionHelper
                  text={TranslateString(
                    9999,
                    'MATIC Token is hosted on apeswap DEX. Please visit https://dex.apeswap.finance/ to sell or swap.',
                  )}
                />
              )}
            </Flex>
            {isAutoSeed ? (
              <Text color='textSubtle'>Automatic restaking</Text>
            ) : !isComing ? (
              <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>Stake {stakingTokenSymbol}</Text>
            ) : null}
          </Flex>
          {
            isComing
              ? <Image src="/images/bunny-question.svg" width={64} height={64} alt="Your project here" />
              : <Image src={`/images/tokens/${image || earningTokenSymbol}.png`} width={64} height={64} disabled={isFinished} alt={earningTokenSymbol} />
          }
        </Flex>
      </Wrapper>
    )
  }

export default StyledCardHeader
