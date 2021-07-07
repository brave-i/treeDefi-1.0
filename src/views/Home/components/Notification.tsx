import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Link } from '@pancakeswap-libs/uikit' // Skeleton, Text,
import useI18n from 'hooks/useI18n'
// import { useGetStats } from 'hooks/api'

const StyledNotification = styled(Card)`
  background: transparent;
  align-items: center;
  display: flex;
  flex: 1;
  text-align: center;
  width: 100%;
  box-shadow: none;
  & > div {
    width: 100%;
    background-image: url('/images/donation-week.png');
    background-repeat: no-repeat;
    background-position: center;
    margint-bottom: 0px;
    min-height: 115px;
    background-size: cover;
  }
`

// const Label = styled.div`
//   color: ${({ theme }) => theme.colors.textSubtle};
//   font-size: 14px;
// `

const NotificationCard = () => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  // const tpt = 8053 + 2257
  // const co2 = 21.7

  return (
    <StyledNotification>
      <CardBody>
        <Link  href="/#/donation" style={{textAlign:"center", margin:"auto"}}>
            <Heading color="contrast" size="lg" mb="24px">
            {TranslateString(999, 'Donation Week!')}
            </Heading>
        </Link>
        <h4 style={{marginTop:"-20px"}} >We donate 1000$ every day for a week!</h4> 
      </CardBody>
    </StyledNotification>
  )
}

export default NotificationCard
