import React, { useContext } from 'react'

import Breadcrumbs from '../components/Breadcrumbs'
import ButtonBar from '../components/ButtonBar'
import LinkButton from '../components/LinkButton'
import Main, { MainChild } from '../components/Main'
import Prose from '../components/Prose'
import Text from '../components/Text'
import BallotContext from '../contexts/ballotContext'

const InstructionsPage = () => {
  const { contests, election } = useContext(BallotContext)
  const { bmdConfig } = election!
  const { showHelpPage, showSettingsPage } = bmdConfig!
  let contestText = 'contests'
  if (contests.length === 1) {
    contestText = 'contest'
  }
  return (
    <React.Fragment>
      <Main>
        <MainChild center id="audiofocus">
          <Breadcrumbs step={1} />
          <Prose textCenter>
            <div className="focusable findfocus" tabIndex={-1}>
              <h1 aria-label="Mark your ballot.">Mark your ballot</h1>
              <Text narrow>{`This ballot has ${
                contests.length
              } ${contestText}.`}</Text>
            </div>
            <p>
              <LinkButton
                primary
                big
                to="/contests/"
                id="next"
                aria-label="Select Next to Start Voting."
              >
                Start voting
              </LinkButton>
            </p>
          </Prose>
        </MainChild>
      </Main>
      <ButtonBar secondary separatePrimaryButton>
        <div />
        {showHelpPage && <LinkButton to="/help">Help</LinkButton>}
        {showSettingsPage && <LinkButton to="/settings">Settings</LinkButton>}
      </ButtonBar>
    </React.Fragment>
  )
}

export default InstructionsPage
