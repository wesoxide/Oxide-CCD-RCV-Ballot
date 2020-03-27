import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styled from 'styled-components'

const StyledScreen = styled.div`
  display: grid;
  grid-template-areas: 'chrometop' 'main' 'chromebottom';
  grid-template-rows: 3.75rem calc(100vh - 7.5rem) 3.75rem;
  height: 100vh;
  &:focus {
    outline: none;
  }
`

class Screen extends React.Component<RouteComponentProps> {
  public screen = React.createRef<HTMLDivElement>()
  public componentDidMount() {
    this.focus()
  }
  public componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.focus()
    }
  }
  public focus = () => {
    const elementToFocus =
      document.getElementById('audiofocus') || this.screen.current!
    elementToFocus.focus()
    elementToFocus.click()
  }
  public render() {
    return (
      <StyledScreen ref={this.screen} tabIndex={-1}>
        {this.props.children}
      </StyledScreen>
    )
  }
}

export default withRouter(Screen)
