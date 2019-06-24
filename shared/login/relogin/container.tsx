import * as React from 'react'
import * as LoginGen from '../../actions/login-gen'
import * as ProvisionGen from '../../actions/provision-gen'
import * as SignupGen from '../../actions/signup-gen'
import HiddenString from '../../util/hidden-string'
import Login from '.'
import {connect, TypedState, TypedDispatch} from '../../util/container'
import * as I from 'immutable'

type OwnProps = {
  navigateAppend: (...args: Array<any>) => any
}

const mapStateToProps = (state: TypedState) => ({
  _users: state.config.configuredAccounts,
  error: state.login.error.stringValue(),
  selectedUser: state.config.defaultUsername,
})

const mapDispatchToProps = (dispatch: TypedDispatch, ownProps: OwnProps) => ({
  onFeedback: () => dispatch(ownProps.navigateAppend(['feedback'])),
  onForgotPassword: () => dispatch(LoginGen.createLaunchForgotPasswordWebPage()),
  onLogin: (username: string, password: string) =>
    dispatch(LoginGen.createLogin({password: new HiddenString(password), username})),
  onSignup: () => dispatch(SignupGen.createRequestAutoInvite()),
  onSomeoneElse: () => dispatch(ProvisionGen.createStartProvision()),
})

const mergeProps = (stateProps: ReturnType<typeof mapStateToProps>, dispatchProps) => {
  const users = stateProps._users
    .map(account => account.username)
    .sort()
    .toArray()
  let inputError = ''
  let bannerError = ''
  if (stateProps.error === 'You are offline.') {
    bannerError = stateProps.error
  } else {
    inputError = stateProps.error
  }

  return {
    bannerError,
    inputError,
    loggedInMap: I.Map(stateProps._users.map(account => [account.username, account.hasStoredSecret])),
    onFeedback: dispatchProps.onFeedback,
    onForgotPassword: dispatchProps.onForgotPassword,
    onLogin: dispatchProps.onLogin,
    onSignup: dispatchProps.onSignup,
    onSomeoneElse: dispatchProps.onSomeoneElse,
    selectedUser: stateProps.selectedUser,
    users,
  }
}

type State = {
  password: string
  showTyping: boolean
  selectedUser: string
  inputKey: number
}

type Props = {
  bannerError: string
  inputError: string
  loggedInMap: I.Map<string, boolean>
  onFeedback: () => void
  onForgotPassword: () => void
  onLogin: (user: string, password: string) => void
  onSignup: () => void
  onSomeoneElse: () => void
  selectedUser: string
  users: Array<string>
}

class LoginWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      inputKey: 1,
      password: '',
      selectedUser: props.selectedUser,
      showTyping: false,
    }
  }

  _selectedUserChange = (selectedUser: string) => {
    this.setState({selectedUser})
    if (this.props.loggedInMap.get(selectedUser, false)) {
      this.props.onLogin(selectedUser, '')
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Clear the password when there's an error.
    if (this.props.inputError !== prevProps.inputError) {
      this.setState(p => ({inputKey: p.inputKey + 1, password: ''}))
    }
    if (this.props.selectedUser !== prevProps.selectedUser) {
      this.setState({selectedUser: this.props.selectedUser})
    }
  }

  render() {
    return (
      <Login
        bannerError={this.props.bannerError}
        inputError={this.props.inputError}
        inputKey={String(this.state.inputKey)}
        onFeedback={this.props.onFeedback}
        onForgotPassword={this.props.onForgotPassword}
        onLogin={this.props.onLogin}
        onSignup={this.props.onSignup}
        onSomeoneElse={this.props.onSomeoneElse}
        onSubmit={() => this.props.onLogin(this.state.selectedUser, this.state.password)}
        password={this.state.password}
        passwordChange={password => this.setState({password})}
        selectedUser={this.state.selectedUser}
        selectedUserChange={this._selectedUserChange}
        showTypingChange={showTyping => this.setState({showTyping})}
        showTyping={this.state.showTyping}
        users={this.props.users}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(LoginWrapper)
