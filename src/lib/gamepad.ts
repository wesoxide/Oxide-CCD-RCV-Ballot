import mod from '../utils/mod'

function getFocusableElements(): HTMLElement[] {
  const tabbableElements = Array.from(
    document.querySelectorAll(
      'button:not([aria-hidden="true"]):not([disabled]), input:not([aria-hidden="true"]):not([disabled]), .focusable'
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
  const focusable = getFocusableElements()
  let nextIndex = mod(currentIndex + 1, focusable.length)
  let currentId = Object.values(focusable[currentIndex])[1].id

  let nextId = Object.values(focusable[nextIndex])[1].id
  while (currentId === nextId) {
    nextIndex = mod(nextIndex + 1, focusable.length)
    nextId = Object.values(focusable[nextIndex])[1].id
  }
  return nextIndex
}

function findPrevInput(currentIndex: number) {
  const focusable = getFocusableElements()
  let prevIndex = mod(currentIndex - 1, focusable.length)
  let prevVal = Object.values(focusable[prevIndex])[1].value
  while (prevVal === 'arrowControls') {
    prevIndex = mod(prevIndex - 1, focusable.length)
    prevVal = Object.values(focusable[prevIndex])[1].value
  }
  return prevIndex
}

function findRightInput(currentIndex: number) {
  const focusable = getFocusableElements()
  const currentId = Object.values(
    focusable[mod(currentIndex, focusable.length)]
  )[1].id
  let currentVal = Object.values(
    focusable[mod(currentIndex, focusable.length)]
  )[1].value
  let nextVal = Object.values(
    focusable[mod(currentIndex + 1, focusable.length)]
  )[1].value
  const inputIndex = focusable.findIndex(obj => obj.id === currentId)
  let returnIndex = inputIndex
  if (
    currentId !== undefined &&
    nextVal !== undefined &&
    currentVal === 'arrowControls' &&
    nextVal === 'arrowControls'
  ) {
    returnIndex = currentIndex + 1
  }
  return returnIndex
}

function noRightInput(currentIndex: number) {
  const focusable = getFocusableElements()
  const nextIndex = findRightInput(currentIndex)
  if (currentIndex !== -1) {
    const currentVal = Object.values(focusable[currentIndex])[1].value
    if (
      nextIndex === undefined ||
      currentVal === undefined ||
      currentVal !== 'arrowControls'
    ) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

// function findLeftInput(currentIndex: number) {
//   const focusable = getFocusableElements()
//   const currentId = Object.values(focusable[mod(currentIndex, focusable.length)])[1].id
//   let currentVal = Object.values(focusable[mod(currentIndex, focusable.length)])[1].value
//   let prevVal = Object.values(focusable[mod(currentIndex - 1, focusable.length)])[1].value
//   const inputIndex = focusable.findIndex(obj => obj.id === currentId)
//   let returnIndex = inputIndex
//   if (currentId!== undefined && prevVal !== undefined && currentVal === 'arrowControls' && prevVal === 'arrowControls') {
//     returnIndex = currentIndex - 1
//   }
//   return returnIndex
// }

// function noLeftInput(currentIndex: number) {
//   const focusable = getFocusableElements()
//   const prevIndex = findLeftInput(currentIndex)
//   const currentVal = Object.values(focusable[currentIndex])[1].value
//   if (prevIndex === undefined || currentVal === undefined || currentVal !== 'arrowControls') {
//     return true
//   } else {
//     return false
//   }
// }

function isChecked(currentIndex: number) {
  const focusable = getFocusableElements()
  if (currentIndex !== -1) {
    return Object.values(focusable[currentIndex])[1].checked
  } else {
    return false
  }
}

function findLeftInput(currentIndex: number) {
  const focusable = getFocusableElements()
  const currentId = Object.values(focusable[currentIndex])[1].id
  const focusableReverse = focusable.reverse()
  const reverseIndex = focusableReverse.findIndex(obj => obj.id === currentId)
  const finalIndex = focusable.length - 1 - reverseIndex
  return finalIndex
}

const getActiveElement = () => document.activeElement! as HTMLInputElement

function handleArrowUp() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  //const currentVal = Object.values(focusable[currentIndex])[1].value
  const prevIndex = mod(currentIndex - 1, focusable.length)
  const prevVal = Object.values(focusable[prevIndex])[1].value
  /* istanbul ignore else */
  // if (currentVal === 'arrowControls') {
  //   focusable[mod(currentIndex, focusable.length)].focus()
  // } else
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
  //const currentVal = Object.values(focusable[currentIndex])[1].value
  /* istanbul ignore else */
  const nextIndex = mod(currentIndex + 1, focusable.length)
  let currentId
  if (currentIndex > -1) {
    currentId = Object.values(
      focusable[mod(currentIndex + 1, focusable.length)]
    )[1].id
  } else {
    currentId = Object.values(
      focusable[mod(currentIndex - 1, focusable.length)]
    )[1].id
  }
  const nextId = Object.values(focusable[nextIndex])[1].id
  // if (currentVal === 'arrowControls') {
  //   focusable[mod(currentIndex, focusable.length)].focus()
  // } else
  if (focusable.length > 1 && currentId === nextId) {
    if (currentId) {
      focusable[mod(findNextInput(currentIndex), focusable.length)].focus()
    } else if (focusable.length) {
      focusable[mod(currentIndex + 1, focusable.length)].focus()
    }
  } else if (focusable.length) {
    focusable[mod(currentIndex + 1, focusable.length)].focus()
  }
}

// function handleArrowLeft() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())

//   const prevButton = document.getElementById('previous') as HTMLButtonElement

//   if (currentIndex > -1) {
//     const currentVal = Object.values(focusable[currentIndex])[1].value
//     const prevIndex = mod(currentIndex - 1, focusable.length)
//     const prevVal = Object.values(focusable[prevIndex])[1].value
//     if (prevVal === 'arrowControls' || currentVal === 'arrowControls') {
//       focusable[mod(prevIndex, focusable.length)].focus()
//     } else if (prevButton) {
//       prevButton.click()
//     }
//   } else if (prevButton) {
//     prevButton.click()
//   }
// }

// function handleArrowRight() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())
//   const nextButton = document.getElementById('next') as HTMLButtonElement

//   if (currentIndex > -1) {
//     const nextIndex = mod(currentIndex + 1, focusable.length)
//     const currentId = Object.values(focusable[currentIndex])[1].id
//     const nextId = Object.values(focusable[nextIndex])[1].id
//     const currentVal = Object.values(focusable[currentIndex])[1].value
//     if (currentId === nextId || currentVal === 'arrowControls') {
//       focusable[mod(nextIndex, focusable.length)].focus()

//     } else if (nextButton) {
//       nextButton.click()
//     }
//   } else if (nextButton) {
//     nextButton.click()
//   }
// }

// function getClickedElement(focusable: HTMLElement[], currentIndex: number) {
//   return Object.values(focusable[currentIndex])
// }

// function getParentElement(el: HTMLElement) {
//   if (el.parentElement !== undefined) {
//     return el.parentElement
//   }
// }

// function noParent(el: HTMLElement) {
//   if (el === undefined) {
//     return true
//   } else {
//     return false
//   }
// }

// const getActiveElement = () => document.activeElement! as HTMLInputElement

// function handleArrowUp() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())
//   /* istanbul ignore else */
//   if (focusable.length) {
//     if (currentIndex > -1) {
//       focusable[mod(currentIndex - 1, focusable.length)].focus()
//     } else {
//       focusable[focusable.length - 1].focus()
//     }
//   }
// }

// function handleArrowDown() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())
//   /* istanbul ignore else */
//   if (focusable.length) {
//     focusable[mod(currentIndex + 1, focusable.length)].focus()
//   }
// }

// function handleArrowLeft() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())
//   const currentElement = focusable[currentIndex]
//   const prevButton = document.getElementById('previous') as HTMLButtonElement
//   let noparent = noParent(currentElement)

//   if (noparent && prevButton) {
//     prevButton.click()
//   } else {
//     const parentElement = getParentElement(currentElement)
//     const currentVal = Object.values(focusable[currentIndex])[1].value
//     if (
//       parentElement &&
//       parentElement.classList.contains('choice') &&
//       focusable.length
//     ) {
//       if (currentIndex > -1) {
//         focusable[mod(currentIndex - 1, focusable.length)].focus()
//       } else {
//         focusable[focusable.length - 1].focus()
//       }
//     } else if (
//       currentVal &&
//       currentVal === 'arrowControls' &&
//       focusable.length
//     ) {
//       if (currentIndex > -1) {
//         focusable[mod(currentIndex - 1, focusable.length)].focus()
//       } else {
//         focusable[focusable.length - 1].focus()
//       }
//     } else if (prevButton) {
//       prevButton.click()
//     }
//     noparent = true
//   }
// }

function handleArrowLeft() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  const checked = isChecked(currentIndex)
  /* istanbul ignore else */
  if (checked) {
    focusable[mod(findLeftInput(currentIndex), focusable.length)].focus()
  } else if (focusable.length) {
    if (currentIndex > -1) {
      focusable[mod(currentIndex - 1, focusable.length)].focus()
    } else {
      focusable[focusable.length - 1].focus()
    }
  }
  // if (focusable.length) {
  //   if (currentIndex > -1) {
  //     focusable[mod(currentIndex - 1, focusable.length)].focus()
  //   } else {
  //     focusable[focusable.length - 1].focus()
  //   }
  // }
}

function handleArrowRight() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  const isNoRightInput = noRightInput(currentIndex)
  /* istanbul ignore else */
  if (focusable.length) {
    if (isNoRightInput) {
      focusable[mod(currentIndex + 1, focusable.length)].focus()
    } else {
      let currentVal = Object.values(focusable[currentIndex])[1].value
      if (currentVal === 'arrowControls') {
        let nextIndex = findRightInput(currentIndex)
        if (Object.values(focusable[nextIndex])[1].value === 'arrowControls') {
          focusable[mod(nextIndex, focusable.length)].focus()
        }
      }
    }
  }
}

// function handleArrowRight() {
//   const focusable = getFocusableElements()
//   const currentIndex = focusable.indexOf(getActiveElement())
//   const currentElement = focusable[currentIndex]
//   const nextButton = document.getElementById('next') as HTMLButtonElement
//   let noparent = noParent(currentElement)

//   if (noparent && nextButton) {
//     nextButton.click()
//   } else {
//     const parentElement = getParentElement(currentElement)
//     const currentVal = Object.values(focusable[currentIndex])[1].value
//     if (
//       parentElement &&
//       parentElement.classList.contains('choice') &&
//       focusable.length
//     ) {
//       focusable[mod(currentIndex + 1, focusable.length)].focus()
//     } else if (
//       currentVal &&
//       currentVal === 'arrowControls' &&
//       focusable.length
//     ) {
//       focusable[mod(currentIndex + 1, focusable.length)].focus()
//     } else if (nextButton) {
//       nextButton.click()
//     }
//     noparent = true
//   }
// }

// function handleClick() {
//   getActiveElement().click()
// }

// function checkIfPage(currentIndex: number) {
//   const focusable = getFocusableElements()
//   console.log(focusable[currentIndex])
// }

function handleClick() {
  const focusable = getFocusableElements()
  const currentIndex = focusable.indexOf(getActiveElement())
  const currentId = focusable[currentIndex].id
  if (currentIndex > -1) {
    const currentVal = Object.values(focusable[currentIndex])[1].value
    if (
      currentVal === 'arrowControls' ||
      currentId === 'next' ||
      currentId === 'back'
    ) {
      getActiveElement().dispatchEvent(new Event('click'))
    } else if (getActiveElement().classList.contains('hasbutton')) {
      focusable[currentIndex + 1].click()
    } else {
      getActiveElement().click()
    }
  } else {
    getActiveElement().click()
  }
}

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
      handleClick()
      break
    case 'Enter':
      handleClick()
      break
    // no default
  }
}
