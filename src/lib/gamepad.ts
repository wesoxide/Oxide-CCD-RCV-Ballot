import mod from '../utils/mod'

function getFocusableElements(): HTMLElement[] {
  const tabbableElements = Array.from(
    document.querySelectorAll(
      'button:not([aria-hidden="true"]):not([disabled]), input:not([aria-hidden="true"]):not([disabled])'
    )
  )
  const ariaHiddenTabbableElements = Array.from(
    document.querySelectorAll(
      '[aria-hidden="true"] button, [aria-hidden="true"] input'
    )
  )
  return tabbableElements.filter(
    element => ariaHiddenTabbableElements.indexOf(element) === -1
  ) as HTMLElement[]
}

function findNextInput(currentIndex: number) {
  const focusable = Object.values(getFocusableElements())
  let nextIndex = mod(currentIndex + 1, focusable.length)
  const currentId = Object.values(focusable[currentIndex])[1].id
  let nextId = Object.values(focusable[nextIndex])[1].id
  while (currentId === nextId) {
    nextIndex = mod(nextIndex + 1, focusable.length)
    nextId = Object.values(focusable[nextIndex])[1].id
  }
  return nextIndex
}

function findPrevInput(currentIndex: number) {
  const focusable = Object.values(getFocusableElements())
  let prevIndex = mod(currentIndex - 1, focusable.length)
  let prevVal = Object.values(focusable[prevIndex])[1].value
  while (prevVal === 'arrowControls') {
    prevIndex = mod(prevIndex - 1, focusable.length)
    prevVal = Object.values(focusable[prevIndex])[1].value
  }
  return prevIndex
}

const getActiveElement = () => document.activeElement! as HTMLInputElement

function handleArrowUp() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  const prevIndex = mod(currentIndex - 1, focusable.length)
  const prevVal = Object.values(focusable[prevIndex])[1].value
  /* istanbul ignore else */
  if (prevVal === 'arrowControls') {
    focusable[mod(findPrevInput(currentIndex), focusable.length)].focus()
  } else if (focusable.length) {
    if (currentIndex > -1) {
      focusable[mod(currentIndex - 1, focusable.length)].focus()
    } else {
      focusable[focusable.length - 1].focus()
    }
  }
}

function handleArrowDown() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  /* istanbul ignore else */
  const nextIndex = mod(currentIndex + 1, focusable.length)
  let currentId
  if (currentIndex > -1) {
    currentId = Object.values(focusable[currentIndex])[1].id
  } else {
    currentId = Object.values(focusable[focusable.length - 1])[1].id
  }
  const nextId = Object.values(focusable[nextIndex])[1].id
  if (currentId === nextId) {
    if (currentId !== undefined) {
      focusable[mod(findNextInput(currentIndex), focusable.length)].focus()
    } else if (focusable.length) {
      focusable[mod(currentIndex + 1, focusable.length)].focus()
    }
  } else if (focusable.length) {
    focusable[mod(currentIndex + 1, focusable.length)].focus()
  }
}

function handleArrowLeft() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())

  const prevButton = document.getElementById('previous') as HTMLButtonElement

  if (currentIndex > -1) {
    const currentVal = Object.values(focusable[currentIndex])[1].value
    const prevIndex = mod(currentIndex - 1, focusable.length)
    const prevVal = Object.values(focusable[prevIndex])[1].value
    if (prevVal === 'arrowControls' || currentVal === 'arrowControls') {
      focusable[mod(prevIndex, focusable.length)].focus()
    } else if (prevButton) {
      prevButton.click()
    }
  } else if (prevButton) {
    prevButton.click()
  }
}

function handleArrowRight() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  const nextButton = document.getElementById('next') as HTMLButtonElement

  if (currentIndex > -1) {
    const nextIndex = mod(currentIndex + 1, focusable.length)
    const currentId = Object.values(focusable[currentIndex])[1].id
    const nextId = Object.values(focusable[nextIndex])[1].id
    const currentVal = Object.values(focusable[currentIndex])[1].value
    if (currentId === nextId || currentVal === 'arrowControls') {
      focusable[mod(nextIndex, focusable.length)].focus()
    } else if (nextButton) {
      nextButton.click()
    }
  } else if (nextButton) {
    nextButton.click()
  }
}

function handleClick() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  if (currentIndex > -1) {
    const currentVal = Object.values(focusable[currentIndex])[1].value
    if (currentVal === 'arrowControls') {
      getActiveElement().dispatchEvent(new Event('click'))
    } else {
      getActiveElement().click()
    }
  } else {
    getActiveElement().click()
  }
}

// function getClickedElement(focusable: HTMLElement[], currentIndex: number) {
//   return Object.values(focusable[currentIndex])
// }

export function handleGamepadButtonDown(buttonName: string) {
  switch (buttonName) {
    case 'DPadUp':
      handleArrowUp()
      break
    case 'A':
    case 'DPadDown':
      handleArrowDown()
      break
    case 'DPadLeft':
      handleArrowLeft()
      break
    case 'DPadRight':
      handleArrowRight()
      break
    case 'B':
      handleClick()
      break
    // no default
  }
}

// Add Cypress tests if this solution will become permanent
// https://docs.cypress.io/api/commands/type.html
export /* istanbul ignore next - triggering keystrokes issue - https://github.com/votingworks/bmd/issues/62 */ function handleGamepadKeyboardEvent(
  event: KeyboardEvent
) {
  switch (event.key) {
    case 'ArrowUp':
      handleArrowUp()
      break
    case '[':
    case 'ArrowDown':
      handleArrowDown()
      break
    case 'ArrowLeft':
      handleArrowLeft()
      break
    case 'ArrowRight':
      handleArrowRight()
      break
    case ']':
    case 'Enter':
      handleClick()
      break
    // no default
  }
}
