import React, { useContext } from 'react'
import styled from 'styled-components'

import BallotContext from '../contexts/ballotContext'

import LinkButton from '../components/LinkButton'
import Main, { MainChild } from '../components/Main'
import Prose from '../components/Prose'

const Seal = styled.div`
  margin: 0 auto 1rem;
  max-width: 320px;
`

const SealImage = styled.img`
  max-width: 320px;
`

const StartPage = () => {
  const { ballotStyleId, election, precinctId } = useContext(BallotContext)
  const { title, state, county, date, seal, sealURL } = election!

  return (
    <Main>
      <MainChild center>
        {seal ? (
          <Seal aria-hidden="true" dangerouslySetInnerHTML={{ __html: seal }} />
        ) : sealURL ? (
          <Seal aria-hidden="true">
            <SealImage alt="" src={sealURL} />
          </Seal>
        ) : (
          <React.Fragment />
        )}
        <Prose textCenter>
          <div className="focusable startfocus hasbutton" tabIndex={-1}>
            <h1 aria-label={`${title}.`}>{title}</h1>
            <p aria-hidden="true">
              {date}
              <br />
              {county.name}, {state}
              <br />
              Ballot Style {ballotStyleId}
              <br />
              Precinct {precinctId}
            </p>
          </div>
          <p>
            <LinkButton
              primary
              to="/instructions/"
              id="next"
              aria-label="Select Next to start voting."
            >
              Start voting
            </LinkButton>
          </p>
        </Prose>
      </MainChild>
    </Main>
  )
}

export default StartPage
