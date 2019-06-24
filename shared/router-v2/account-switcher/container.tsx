import * as LoginGen from '../../actions/login-gen'
import * as ProfileGen from '../../actions/profile-gen'
import * as RouteTreeGen from '../../actions/route-tree-gen'
import * as SettingsConstants from '../../constants/settings'
import * as TrackerConstants from '../../constants/tracker2'
import AccountSwitcher, {Props} from './index'
import {connect, TypedState, TypedDispatch} from '../../util/container'
import {memoize} from '../../util/memoize'
import * as ConfigGen from '../../actions/config-gen'
import * as ProvisionGen from '../../actions/provision-gen'
import * as SignupGen from '../../actions/signup-gen'

type OwnProps = {}

const mapStateToProps = (state: TypedState) => ({
  accountRows: state.config.configuredAccounts
    .filter(account => account.username !== state.config.username)
    .sortBy(account => account.username),
  fullname: TrackerConstants.getDetails(state, state.config.username).fullname || '',
  username: state.config.username,
})

const mapDispatchToProps = (dispatch: TypedDispatch) => ({
  _onProfileClick: username => dispatch(ProfileGen.createShowUserProfile(username)),
  onAddAccount: () => dispatch(ProvisionGen.createStartProvision()),
  onCancel: () => dispatch(RouteTreeGen.createNavigateUp()),
  onCreateAccount: () => dispatch(SignupGen.createRequestAutoInvite()),
  onSelectAccountLoggedIn: username => dispatch(LoginGen.createLogin({password: null, username})),
  onSelectAccountLoggedOut: username => {
    dispatch(ConfigGen.createSetDefaultUsername({username}))
    dispatch(RouteTreeGen.createSwitchRouteDef({loggedIn: false, path: ''}))
  },
  onSignOut: () => dispatch(RouteTreeGen.createNavigateAppend({path: [SettingsConstants.logOutTab]})),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps: OwnProps): Props => ({
    accountRows: stateProps.accountRows.toArray(),
    fullname: stateProps.fullname,
    onAddAccount: dispatchProps.onAddAccount,
    onCancel: dispatchProps.onCancel,
    onCreateAccount: dispatchProps.onCreateAccount,
    onProfileClick: () => dispatchProps._onProfileClick(stateProps.username),
    onSelectAccount: (username: string) => {
      const rows = stateProps.accountRows.filter(account => account.username === username)
      const loggedIn = rows.isEmpty() ? false : rows.get(0).hasStoredSecret
      return loggedIn
        ? dispatchProps.onSelectAccountLoggedIn(username)
        : dispatchProps.onSelectAccountLoggedOut(username)
    },
    rightActions: [
      {
        // TODO: color: 'red',
        label: 'Sign out',
        onPress: dispatchProps.onSignOut,
      },
    ],

    title: '',
    username: stateProps.username,
  })
)(AccountSwitcher)
