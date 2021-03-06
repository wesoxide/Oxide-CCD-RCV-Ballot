import { createContext } from 'react'
import GLOBALS from '../config/globals'

import { BallotContextInterface, TextSizeSetting } from '../config/types'

const ballot: BallotContextInterface = {
  activateBallot: () => undefined,
  ballotStyleId: '',
  contests: [],
  election: undefined,
  markVoterCardUsed: async () => false,
  precinctId: '',
  resetBallot: () => undefined,
  setUserSettings: () => undefined,
  updateVote: () => undefined,
  updateRank: () => undefined,
  userSettings: { textSize: GLOBALS.TEXT_SIZE as TextSizeSetting },
  votes: {},
  ranks: {},
}

const BallotContext = createContext(ballot)

export default BallotContext
