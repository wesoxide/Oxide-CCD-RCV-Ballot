import camelCase from 'lodash.camelcase'
import React from 'react'
import _ from 'lodash'
// import ordinal from 'ordinal'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import styled from 'styled-components'

import { findPartyById } from '../utils/find'

import {
  ButtonEvent,
  RankCandidate,
  //Ranks,
  RankContest as RankContestInterface,
  RankCandidateVote,
  RanksVote,
  InputEvent,
  OptionalRankCandidate,
  Parties,
  Scrollable,
  ScrollDirections,
  ScrollShadows,
  UpdateVoteFunction,
  UpdateRankFunction,
} from '../config/types'

//import { ReactComponent as RemoveRank } from '../images/remove-icon.svg'
import { ReactComponent as UpRank } from '../images/uprank.svg'
import { ReactComponent as DownRank } from '../images/downrank.svg'

import BallotContext from '../contexts/ballotContext'

import GLOBALS from '../config/globals'
import Button from './Button'
import LinkButton from './LinkButton'
import Main from './Main'
import Modal from './Modal'
import Prose from './Prose'
import Text from './Text'

const tabletMinWidth = 720

const ContentHeader = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 35rem;
  padding: 1rem 0.75rem 0.5rem;
  @media (min-width: ${tabletMinWidth}px) {
    padding: 1rem 1.5rem 0.5rem;
    > div {
      padding-left: 3.5rem;
    }

    button {
      margin-top: 0.5rem;
    }
  }
`
const ContestSection = styled.div`
  text-transform: uppercase;
  font-size: 0.85rem;
  font-weight: 600;
`
const VariableContentContainer = styled.div<ScrollShadows>`
  display: flex;
  flex: 1;
  position: relative;
  overflow: auto;
  &::before,
  &::after {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 0.25rem;
    content: '';
    transition: opacity 0.25s ease;
  }
  &::before {
    top: 0;
    opacity: ${({ showTopShadow }) =>
      showTopShadow ? /* istanbul ignore next: Tested by Cypress */ 1 : 0};
    background: linear-gradient(
      to bottom,
      rgb(177, 186, 190) 0%,
      transparent 100%
    );
  }
  &::after {
    bottom: 0;
    opacity: ${({ showBottomShadow }) =>
      showBottomShadow ? /* istanbul ignore next: Tested by Cypress */ 1 : 0};
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgb(177, 186, 190) 100%
    );
  }
`
const ScrollContainer = styled.div`
  flex: 1;
  overflow: hidden;
`
const ScrollableContentWrapper = styled.div<Scrollable>`
  margin: 0 auto;
  width: 100%;
  max-width: 35rem;
  padding: 0.5rem 0.5rem 1rem;
  @media (min-width: ${tabletMinWidth}px) {
    padding-right: 1rem;
    padding-left: 1rem;
  }
`

const ChoicesGrid = styled.div`
  display: grid;
  grid-auto-rows: minmax(auto, 1fr);
  grid-gap: 0.75rem;
`

const ChoiceContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(33, 1fr);
`

const Choice = styled('label')<{ isSelected: boolean }>`
  display: grid;
  align-items: center;
  position: relative;
  border-radius: 0.125rem;
  box-shadow: 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.12),
    0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.2);
  background: ${({ isSelected }) => (isSelected ? '#028099' : '#FFFFFF')};
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? '#FFFFFF' : undefined)};
  transition: background 0.25s, color 0.25s;
  grid-column: span 26;
  button& {
    text-align: left;
  }
  :focus-within {
    outline: rgb(77, 144, 254) dashed 0.25rem;
  }
  ::before {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-right: 1px solid;
    border-color: ${({ isSelected }) =>
      isSelected ? '#028099' : 'rgb(211, 211, 211)'};
    border-radius: 0.125rem 0 0 0.125rem;
    background: #FFFFFF;
    width: 3rem;
    text-align: center;
    color: #028099;
    font-size: 2rem;
    font-weight: 700;
    content: '${({ isSelected }) => (isSelected ? '' : '')}';
  }
  & > div {
    padding: 0.5rem 0.5rem 0.5rem 4rem;
    @media (min-width: 480px) {
      padding: 1rem 1rem 1rem 4rem;
    }
  }
`
const ChoiceRank = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  width: 3rem;
  padding: 0.5rem;
  text-align: center;
  color: #028099;
  font-size: 2rem;
  font-weight: 700;

  @media (min-width: 480px) {
    padding: 1rem;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin: 1rem auto 0;
  max-width: 25rem;

  button {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    background-color: #afbdc4;
    width: 100%;
    transition: box-shadow 0.25s ease, background-color 0.25s ease,
      color 0.25s ease;
    &:disabled {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.12);
      background-color: #cfd9de;
      color: #ffffff;
    }
  }
`

const ChoiceInput = styled.input.attrs({
  type: 'checkbox',
  role: 'option',
})`
  margin-right: 0.5rem;
`

const ButtonControlContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  grid-column: span 6;

  button {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    background-color: #afbdc4;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.75rem;
    transition: box-shadow 0.25s ease, background-color 0.25s ease;

    svg {
      width: 1rem;
      fill: #ffffff;
    }

    &:disabled {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.12);
      background-color: #cfd8dc;

      svg {
        path {
          fill: #edeff0;
        }
      }
    }
  }
`

const ContentFooter = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 35rem;
  padding: 0.5rem 0.5rem;
  @media (min-width: ${tabletMinWidth}px) {
    padding: 0.5rem 1rem;
  }
`

const WriteInCandidateForm = styled.div`
  margin: 1rem 0 -1rem;
  border-radius: 0.25rem;
  background-color: rgb(211, 211, 211);
  padding: 0.25rem;
`

const WriteInCandidateFieldSet = styled.fieldset`
  margin: 0.5rem 0.5rem 1rem;
`

const WriteInCandidateInput = styled.input.attrs({
  readOnly: true,
  type: 'text',
})`
  outline: none;
  border: 1px solid rgb(169, 169, 169);
  box-shadow: 0 0 3px -1px rgba(0, 0, 0, 0.3);
  width: 100%;
  padding: 0.25rem 0.35rem;
`

interface Props {
  contest: RankContestInterface
  parties: Parties
  vote: RankCandidateVote
  updateVote: UpdateVoteFunction
  rank: RanksVote
  updateRank: UpdateRankFunction
}

interface State {
  attemptedOvervoteCandidate: OptionalRankCandidate
  candidatePendingRemoval: OptionalRankCandidate
  isScrollAtBottom: boolean
  isScrollAtTop: boolean
  isScrollable: boolean
  writeInCandateModalIsOpen: boolean
  writeInCandidateName: string
  nextRank: number
  isSortedByRank: boolean
  isUpRank: boolean
}

const initialState = {
  attemptedOvervoteCandidate: undefined,
  candidatePendingRemoval: undefined,
  isScrollable: true,
  isScrollAtBottom: true,
  isScrollAtTop: true,
  writeInCandateModalIsOpen: false,
  writeInCandidateName: '',
  nextRank: 1,
  isSortedByRank: true,
  isUpRank: false,
}

class RankContest extends React.Component<Props, State> {
  public static contextType = BallotContext
  public state: State = initialState
  private keyboard = React.createRef<Keyboard>()
  private scrollContainer = React.createRef<HTMLDivElement>()

  public componentDidMount() {
    const startFocus = document.querySelector('.startfocus') as HTMLElement
    startFocus.focus()
    this.updateContestChoicesScrollStates()
    window.addEventListener('resize', this.updateContestChoicesScrollStates)
    this.updateRanks()
    if (this.props.vote.length > 0) {
      this.setState({
        isSortedByRank: false,
      })
    }
  }

  public componentDidUpdate(prevProps: Props) {
    /* istanbul ignore else */
    if (this.props.vote.length !== prevProps.vote.length) {
      this.updateContestChoicesScrollStates()
      //this.setState({ isUpRank: false })
      if (!this.state.isUpRank) {
        this.updateRanks()
      }
    }
    if (!this.state.isUpRank) {
      this.updateRanks()
    }
    // this.updateRanks()
  }

  public componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateContestChoicesScrollStates)
  }

  public findCandidateById = (candidates: RankCandidate[], id: string) =>
    candidates.find(c => c.id === id)

  public addCandidateToVote = (id: string) => {
    const { contest, vote } = this.props
    const { candidates } = contest
    const candidate = this.findCandidateById(candidates, id)!
    const rankNumber = vote.length + 1
    candidate.rank = rankNumber.toString()
    this.props.updateVote(contest.id, [...vote, candidate])
    for (let index = 0, votes = vote; index < votes.length; index++) {
      let v = votes[index]
      let r = index + 1
      v.rank = r.toString()
    }
  }

  public removeCandidateFromVote = (id: string) => {
    const { contest, vote } = this.props
    const newVote = vote.filter(c => c.id !== id)
    const { candidates } = contest
    const candidate = this.findCandidateById(candidates, id)!
    candidate.rank = ''
    this.props.updateVote(contest.id, newVote)
    for (let index = 0, votes = vote; index < votes.length; index++) {
      let v = votes[index]
      let r = index + 1
      v.rank = r.toString()
    }
  }

  public updateRanks = () => {
    const { vote } = this.props

    for (let index = 0, votes = vote; index < votes.length; index++) {
      let v = votes[index]
      let r = index + 1
      v.rank = r.toString()
    }
  }

  public handleDisabledClick = () => {
    // maybe we'll do more when a disabled item is clicked, for now nothing.
  }

  public handleUpdateSelection = (event: InputEvent) => {
    const { vote } = this.props
    const id = (event.target as HTMLInputElement).value
    const candidate = this.findCandidateById(vote, id)
    if (candidate) {
      if (candidate.isWriteIn) {
        this.setState({ candidatePendingRemoval: candidate })
      } else {
        this.removeCandidateFromVote(id)
        candidate.rank = ''
      }
    } else {
      this.addCandidateToVote(id)
    }
    this.setState({ isSortedByRank: false })
    this.setState({ isUpRank: false })
  }

  public handleCandidateFromVote = (event: any) => {
    const { vote } = this.props
    const id = event.currentTarget.id
    const candidate = this.findCandidateById(vote, id)
    const currentInput = document.querySelector('input#' + id) as HTMLElement
    if (candidate && currentInput) {
      this.removeCandidateFromVote(id)
      candidate.rank = ''
      currentInput.focus()
    }
    this.setState({ isSortedByRank: false })
    this.setState({ isUpRank: false })
  }

  public updateCandidateToVote = (id: string) => {
    const { contest, vote } = this.props
    const { candidates } = contest
    const candidate = this.findCandidateById(candidates, id)!
    this.props.updateVote(contest.id, [...vote, candidate])
  }

  public UpdateRemoveCandidateFromVote = (id: string) => {
    const { contest, vote } = this.props
    const newVote = vote.filter(c => c.id !== id)
    this.props.updateVote(contest.id, newVote)
  }

  public upRank = (id: string) => {
    const { vote } = this.props
    const candidate = this.findCandidateById(vote, id)!
    const candidateIndex = _.findIndex(vote, function(o) {
      return o.id === id
    })
    const originalRank = candidate.rank
    const switchIndex = candidateIndex - 1
    const switchCandidate = vote[switchIndex]
    if (candidateIndex !== 0) {
      candidate.rank = candidateIndex.toString()
      switchCandidate.rank = originalRank
    }
  }

  public handleUpRank = (event: any) => {
    const { vote } = this.props
    const id = event.currentTarget.id
    this.upRank(id)
    this.setState({ isSortedByRank: false })
    this.setState({ isUpRank: true })
    vote.sort((a, b) => (a.rank > b.rank ? 1 : -1))
    let candidateRank = this.findCandidateById(vote, id)
    const currentInput = document.querySelector('input#' + id) as HTMLElement
    if (candidateRank && candidateRank.rank === '1' && currentInput) {
      currentInput.focus()
    }
  }

  public downRank = (id: string) => {
    const { vote } = this.props
    const candidate = this.findCandidateById(vote, id)!
    const candidateIndex = _.findIndex(vote, function(o) {
      return o.id === id
    })
    const originalRank = candidate.rank
    const switchIndex = candidateIndex + 1
    const switchCandidate = vote[switchIndex]

    if (candidateIndex + 1 !== vote.length) {
      candidate.rank = switchCandidate.rank
      switchCandidate.rank = originalRank
    }
  }

  public handleDownRank = (event: any) => {
    const { vote } = this.props
    const id = event.currentTarget.id
    this.downRank(id)
    this.setState({ isSortedByRank: false })
    this.setState({ isUpRank: true })
    vote.sort((a, b) => (a.rank > b.rank ? 1 : -1))
    let candidateRank = this.findCandidateById(vote, id)
    const voteLength = vote.length.toString()
    const currentInput = document.querySelector('input#' + id) as HTMLElement
    if (candidateRank && candidateRank.rank === voteLength && currentInput) {
      currentInput.focus()
    }
  }

  public toggleReorderByRank = (event: any) => {
    //const { vote } = this.props
    this.setState({
      isSortedByRank: true,
    })
    // const firstId = vote[0].id
    // const firstInput = document.querySelector('input#' + firstId) as HTMLElement
    // firstInput.focus()
    const focusElement = document.querySelector('.findfocus') as HTMLElement
    focusElement.focus()
    const direction = (event.target as HTMLElement).dataset
      .direction as ScrollDirections
    const scrollContainer = this.scrollContainer.current!
    const currentScrollTop = scrollContainer.scrollTop
    const offsetHeight = scrollContainer.offsetHeight
    const scrollHeight = scrollContainer.scrollHeight
    const idealScrollDistance = Math.round(offsetHeight * 0.75)
    const maxScrollableDownDistance =
      scrollHeight - offsetHeight - currentScrollTop
    const maxScrollTop =
      direction === 'down'
        ? currentScrollTop + maxScrollableDownDistance
        : currentScrollTop
    const idealScrollTop =
      direction === 'down'
        ? currentScrollTop + idealScrollDistance
        : currentScrollTop - idealScrollDistance
    const top = idealScrollTop > maxScrollTop ? maxScrollTop : idealScrollTop
    scrollContainer.scrollTo({ behavior: 'smooth', left: 0, top })
  }

  public handleChangeVoteAlert = (
    attemptedOvervoteCandidate: OptionalRankCandidate
  ) => {
    this.setState({ attemptedOvervoteCandidate })
  }

  public closeAttemptedVoteAlert = () => {
    this.setState({ attemptedOvervoteCandidate: undefined })
  }

  public confirmRemovePendingWriteInCandidate = () => {
    this.removeCandidateFromVote(this.state.candidatePendingRemoval!.id)
    this.clearCandidateIdPendingRemoval()
  }

  public clearCandidateIdPendingRemoval = () => {
    this.setState({ candidatePendingRemoval: undefined })
  }

  public initWriteInCandidate = () => {
    this.toggleWriteInCandidateModal(true)
  }

  public normalizeName = (name: string) =>
    name
      .trim()
      .replace(/\t+/g, ' ')
      .replace(/\s+/g, ' ')

  public addWriteInCandidate = () => {
    const { contest, vote } = this.props
    const normalizedCandidateName = this.normalizeName(
      this.state.writeInCandidateName
    )
    this.props.updateVote(contest.id, [
      ...vote,
      {
        id: `write-in__${camelCase(normalizedCandidateName)}`,
        isWriteIn: true,
        name: normalizedCandidateName,
      },
    ])
    this.setState({ writeInCandidateName: '' })
    this.toggleWriteInCandidateModal(false)
  }

  public cancelWriteInCandidateModal = () => {
    this.setState({ writeInCandidateName: '' })
    this.toggleWriteInCandidateModal(false)
  }

  public toggleWriteInCandidateModal = (writeInCandateModalIsOpen: boolean) => {
    this.setState({ writeInCandateModalIsOpen })
  }

  public onKeyboardInputChange = (writeInCandidateName: string) => {
    this.setState({ writeInCandidateName })
  }

  public updateContestChoicesScrollStates = () => {
    const target = this.scrollContainer.current
    /* istanbul ignore next - `target` should aways exist, but sometimes it doesn't. Don't know how to create this condition in testing.  */
    if (!target) {
      return
    }
    const isTabletMinWidth = target.offsetWidth >= tabletMinWidth
    const targetMinHeight =
      GLOBALS.FONT_SIZES[this.context.userSettings.textSize] * 8 // magic number: room for buttons + spacing
    const windowsScrollTopOffsetMagicNumber = 1 // Windows Chrome is often 1px when using scroll buttons.
    const windowsScrollTop = Math.ceil(target.scrollTop) // Windows Chrome scrolls to sub-pixel values.
    this.setState({
      isScrollable:
        isTabletMinWidth &&
        /* istanbul ignore next: Tested by Cypress */
        target.scrollHeight > target.offsetHeight &&
        /* istanbul ignore next: Tested by Cypress */
        target.offsetHeight > targetMinHeight,
      isScrollAtBottom:
        windowsScrollTop +
          target.offsetHeight +
          windowsScrollTopOffsetMagicNumber >= // Windows Chrome "gte" check.
        target.scrollHeight,
      isScrollAtTop: target.scrollTop === 0,
    })
  }

  public scrollContestChoices = /* istanbul ignore next: Tested by Cypress */ (
    event: ButtonEvent
  ) => {
    const direction = (event.target as HTMLElement).dataset
      .direction as ScrollDirections
    const scrollContainer = this.scrollContainer.current!
    const currentScrollTop = scrollContainer.scrollTop
    const offsetHeight = scrollContainer.offsetHeight
    const scrollHeight = scrollContainer.scrollHeight
    const idealScrollDistance = Math.round(offsetHeight * 0.75)
    const maxScrollableDownDistance =
      scrollHeight - offsetHeight - currentScrollTop
    const maxScrollTop =
      direction === 'down'
        ? currentScrollTop + maxScrollableDownDistance
        : currentScrollTop
    const idealScrollTop =
      direction === 'down'
        ? currentScrollTop + idealScrollDistance
        : currentScrollTop - idealScrollDistance
    const top = idealScrollTop > maxScrollTop ? maxScrollTop : idealScrollTop
    scrollContainer.scrollTo({ behavior: 'smooth', left: 0, top })
  }

  public render() {
    const { contest, parties, vote } = this.props

    if (this.state.isSortedByRank) {
      contest.candidates.sort((a, b) => {
        if (a.rank === b.rank) {
          return 0
        } else if (a.rank === '' || b.rank === '') {
          return a.rank ? -1 : 1
        }
        return a.rank.localeCompare(b.rank)
      })
    }

    const hasReachedMaxSelections = contest.seats === vote.length
    const {
      attemptedOvervoteCandidate,
      candidatePendingRemoval,
      isScrollable,
      isScrollAtBottom,
      isScrollAtTop,
      writeInCandidateName,
      writeInCandateModalIsOpen,
      isSortedByRank,
    } = this.state
    const maxWriteInCandidateLength = 40
    return (
      <React.Fragment>
        <Main noOverflow noPadding>
          <ContentHeader id="contest-header">
            <Prose aria-hidden="false" id="audiofocus">
              <div className="focusable startfocus" tabIndex={-1}>
                <h1 aria-label={`${contest.title}.`}>
                  <ContestSection>{contest.section}</ContestSection>
                  {contest.title}
                </h1>
                <p
                  aria-label={`Vote for ${contest.seats}. You have ranked ${
                    vote.length
                  }. Use the down arrow to hear your options. Use the right arrow to move to the next contest.`}
                >
                  There are {contest.seats} candidates. Rank the candidates in
                  the order of your choice. You may rank as many or as few as
                  you wish.{' '}
                </p>
              </div>
              <p className="focusable findfocus" tabIndex={-1}>
                <strong>
                  You have ranked {vote.length}. You can rank{' '}
                  {contest.seats - vote.length} more.
                </strong>
                <br />
                {/*isFullRanked ? (
                  <br />
                ) : (
                  <strong>Select your {ordinal(vote.length + 1)}.</strong>
                )*/}
              </p>
            </Prose>
            <Button
              aria-hidden
              data-direction="up"
              disabled={isScrollAtTop}
              fullWidth
              onClick={this.scrollContestChoices}
            >
              ↑ See more
            </Button>
          </ContentHeader>
          <VariableContentContainer
            showTopShadow={!isScrollAtTop}
            showBottomShadow={!isScrollAtBottom}
          >
            <ScrollContainer
              ref={this.scrollContainer}
              onScroll={this.updateContestChoicesScrollStates}
            >
              <ScrollableContentWrapper isScrollable={isScrollable}>
                <ChoicesGrid>
                  {contest.candidates
                    //.sort((a, b) => (a.rank==="")>(b.rank==="") ? 1 : -1)
                    .map(candidate => {
                      const isChecked = !!this.findCandidateById(
                        vote,
                        candidate.id
                      )

                      let isUpRankReady = true
                      if (isChecked && candidate.rank !== '1') {
                        isUpRankReady = false
                      }

                      let isDownRankReady = true
                      if (
                        isChecked &&
                        candidate.rank !== vote.length.toString()
                      ) {
                        isDownRankReady = false
                      }

                      const isDisabled = hasReachedMaxSelections && !isChecked
                      const handleDisabledClick = () => {
                        if (isDisabled) {
                          this.handleChangeVoteAlert(candidate)
                        }
                      }
                      const party =
                        candidate.partyId &&
                        findPartyById(parties, candidate.partyId)
                      const rank = candidate.rank
                      return (
                        <ChoiceContainer key={candidate.name}>
                          <Choice
                            key={candidate.id}
                            htmlFor={candidate.id}
                            isSelected={isChecked}
                            onClick={handleDisabledClick}
                            aria-label={`${candidate.name}, ${
                              party ? party.name : ''
                            }. rank: ${rank}`}
                            className="choice"
                          >
                            <ChoiceInput
                              id={candidate.id}
                              name={candidate.name}
                              value={candidate.id}
                              onChange={
                                isDisabled
                                  ? this.handleDisabledClick
                                  : this.handleUpdateSelection
                              }
                              checked={isChecked}
                              className="visually-hidden"
                            />
                            <ChoiceRank>{rank}</ChoiceRank>
                            <Prose>
                              <Text wordBreak>
                                <strong>{candidate.name}</strong>
                                <br />
                                {party ? party.name : ''}
                              </Text>
                            </Prose>
                          </Choice>
                          {isChecked ? (
                            <ButtonControlContainer>
                              <LinkButton
                                value="arrowControls"
                                id={candidate.id}
                                disabled={isUpRankReady}
                                onClick={this.handleUpRank}
                                handleArrows={isUpRankReady}
                              >
                                <UpRank />
                              </LinkButton>
                              <LinkButton
                                value="arrowControls"
                                id={candidate.id}
                                disabled={isDownRankReady}
                                onClick={this.handleDownRank}
                                handleArrows={isDownRankReady}
                              >
                                <DownRank />
                              </LinkButton>
                            </ButtonControlContainer>
                          ) : (
                            <ButtonControlContainer />
                          )}
                        </ChoiceContainer>
                      )
                    })}
                  {contest.allowWriteIns &&
                    vote
                      .filter(c => c.isWriteIn)
                      .map(candidate => {
                        return (
                          <Choice
                            key={candidate.id}
                            htmlFor={candidate.id}
                            isSelected
                          >
                            <ChoiceInput
                              id={candidate.id}
                              name={contest.id}
                              value={candidate.id}
                              onChange={this.handleUpdateSelection}
                              checked
                              className="visually-hidden"
                            />
                            <Prose>
                              <p aria-label={`${candidate.name}.`}>
                                <strong>{candidate.name}</strong>
                              </p>
                            </Prose>
                          </Choice>
                        )
                      })}
                  {contest.allowWriteIns && !hasReachedMaxSelections && (
                    <Choice
                      as="button"
                      isSelected={false}
                      onClick={this.initWriteInCandidate}
                    >
                      <Prose>
                        <p aria-label="add write-in candidate.">
                          <em>add write-in candidate</em>
                        </p>
                      </Prose>
                    </Choice>
                  )}
                </ChoicesGrid>
              </ScrollableContentWrapper>
            </ScrollContainer>
          </VariableContentContainer>
          <ContentFooter>
            <Button
              aria-hidden
              data-direction="down"
              disabled={isScrollAtBottom}
              fullWidth
              onClick={this.scrollContestChoices}
            >
              ↓ See more
            </Button>
            <ButtonContainer>
              <LinkButton
                disabled={isSortedByRank}
                data-direction="up"
                onClick={this.toggleReorderByRank}
              >
                <strong>Show in your ranked order</strong>
              </LinkButton>
            </ButtonContainer>
          </ContentFooter>
        </Main>
        <Modal
          isOpen={!!attemptedOvervoteCandidate}
          ariaLabel=""
          content={
            <Prose>
              <Text id="modalaudiofocus">
                You may only select {contest.seats}{' '}
                {contest.seats === 1 ? 'candidate' : 'candidates'} in this
                contest. To vote for{' '}
                {attemptedOvervoteCandidate && attemptedOvervoteCandidate.name},
                you must first unselect selected{' '}
                {contest.seats === 1 ? 'candidate' : 'candidates'}.
                <span aria-label="Use the select button to continue." />
              </Text>
            </Prose>
          }
          actions={
            <Button
              primary
              autoFocus
              onClick={this.closeAttemptedVoteAlert}
              aria-label="use the select button to continue."
            >
              Okay
            </Button>
          }
        />
        <Modal
          isOpen={!!candidatePendingRemoval}
          content={
            <Prose>
              <Text>
                Do you want to unselect and remove{' '}
                {candidatePendingRemoval && candidatePendingRemoval.name}?
              </Text>
            </Prose>
          }
          actions={
            <>
              <Button
                danger
                onClick={this.confirmRemovePendingWriteInCandidate}
              >
                Yes, Remove.
              </Button>
              <Button onClick={this.clearCandidateIdPendingRemoval}>
                Cancel
              </Button>
            </>
          }
        />
        <Modal
          isOpen={writeInCandateModalIsOpen}
          content={
            <div>
              <Prose>
                <h2>Write-In Candidate</h2>
                <Text>
                  Enter the name of a person who is <strong>not</strong> on the
                  ballot using the on-screen keyboard.
                </Text>
                {writeInCandidateName.length > 35 && (
                  <Text error>
                    <strong>Note:</strong> You have entered{' '}
                    {writeInCandidateName.length} of maximum{' '}
                    {maxWriteInCandidateLength} characters.
                  </Text>
                )}
              </Prose>
              <WriteInCandidateForm>
                <WriteInCandidateFieldSet>
                  <legend>
                    <label htmlFor="WriteInCandidateName">
                      <Prose>
                        <Text bold small>
                          {contest.title} (write-in)
                        </Text>
                      </Prose>
                    </label>
                  </legend>
                  <WriteInCandidateInput
                    id="WriteInCandidateName"
                    value={writeInCandidateName}
                    placeholder="candidate name"
                  />
                </WriteInCandidateFieldSet>
                <Keyboard
                  ref={this.keyboard}
                  layout={{
                    default: [
                      'Q W E R T Y U I O P',
                      'A S D F G H J K L -',
                      'Z X C V B N M , .',
                      '{space} {bksp}',
                    ],
                  }}
                  display={{ '{bksp}': '⌫ delete', '{space}': 'space' }}
                  mergeDisplay
                  disableCaretPositioning
                  maxLength={maxWriteInCandidateLength}
                  layoutName="default"
                  theme="hg-theme-default vs-simple-keyboard"
                  onChange={this.onKeyboardInputChange}
                  useButtonTag
                />
              </WriteInCandidateForm>
            </div>
          }
          actions={
            <>
              <Button
                primary={this.normalizeName(writeInCandidateName).length > 0}
                onClick={this.addWriteInCandidate}
                disabled={this.normalizeName(writeInCandidateName).length === 0}
              >
                Accept
              </Button>
              <Button onClick={this.cancelWriteInCandidateModal}>Cancel</Button>
            </>
          }
        />
      </React.Fragment>
    )
  }
}

export default RankContest
