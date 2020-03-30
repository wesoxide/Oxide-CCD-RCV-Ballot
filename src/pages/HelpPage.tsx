import React from 'react'

import ButtonBar from '../components/ButtonBar'
import LinkButton from '../components/LinkButton'
import Main, { MainChild } from '../components/Main'
import Prose from '../components/Prose'

const HelpPage = () => {
  return (
    <>
      <Main>
        <MainChild>
          <Prose>
            <h1>Help</h1>
            <br />
            <p>
              <strong>What is Ranked Choice Voting?</strong>
            </p>
            <p>
              With Ranked Choice Voting, you mark your preferences for the
              candidates in order, instead of just choosing one.
            </p>
            <br />
            <p>
              <strong>Do I have to rank all the candidates?</strong>
            </p>
            <p>No, you do not have to rank all candidates</p>
            <ul>
              <li>Rank at least one candidate for your 1st choice</li>
              <li>
                You can rank as many or as few of the candidates as you wish
              </li>
              <li>
                Ranking other candidates does not affect your vote for your 1st
                choice.
              </li>
            </ul>
            <br />
            <p>
              <strong>How do I rank candidates?</strong>
            </p>
            <p>
              Select the candidates in the order you want to rank them using the
              touchscreen or the keypad. The candidates will be numbered in
              order as you select them.
            </p>
            <br />
            <p>
              <strong>
                How do I see the candidates in the order I ranked them?
              </strong>
            </p>
            <p>
              Select the <strong>Put In Order</strong> button at the bottom of
              the list of candidates
            </p>
            <br />
            <p>
              <strong>How do I change the rank of a candidate?</strong>
            </p>
            <p>Using the touchscreen or the keypad:</p>
            <ul>
              <li>
                Select a candidate you have ranked, with a number next to the
                name.
              </li>
              <li>
                Controls will appear on the right that let you move the
                candidate up or down or remove the candidate from the ranking
              </li>
              <li>
                If you are using the keypad, use the left and right arrows to
                access the controls for adjusting the rank
              </li>
            </ul>
            <br />
            <p>
              <strong>How do I move to the next contest?</strong>
            </p>
            <p>Select the Next button at the bottom of the screen.</p>
            <p>
              If you are using the keypad, use the down arrow to move all the
              way down to the Next button.
            </p>
          </Prose>
        </MainChild>
      </Main>
      <ButtonBar>
        <div />
        <LinkButton goBack>Back</LinkButton>
        <div />
        <div />
      </ButtonBar>
    </>
  )
}

export default HelpPage
