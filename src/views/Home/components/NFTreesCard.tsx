import React from 'react'
import styled from 'styled-components'
// import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
// import pools from 'config/constants/pools'
// import { Pool } from 'state/types'

const StyledNFTrees = styled(Card)`
  background-image: url('https://treedefi.com/wp-content/uploads/2021/04/nftreecard.jpg');
  background-size: cover;
  background-color: #cccccc;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background-blend-mode: multiply;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const NFTreesCard = () => {
  return (
    <StyledNFTrees>
      <CardBody>
        <Heading color="white" size="lg">
          Discover the
        </Heading>
        <CardMidContent color="white" style={{ lineHeight: '4.5rem', letterSpacing: '2px' }}>
          NFTrees
        </CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="white" size="lg">
            the first nft backed by real trees
          </Heading>
          <NavLink exact activeClassName="active" to="/nftrees" id="nftrees-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledNFTrees>
  )
}

export default NFTreesCard
