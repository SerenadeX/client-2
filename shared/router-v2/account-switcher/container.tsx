import * as LoginGen from '../../actions/login-gen'
import * as ProfileGen from '../../actions/profile-gen'
import * as RouteTreeGen from '../../actions/route-tree-gen'
import * as SettingsConstants from '../../constants/settings'
import * as TrackerConstants from '../../constants/tracker2'
import AccountSwitcher, {Props} from './index'
import {connect, TypedState, TypedDispatch} from '../../util/container'
import {memoize} from '../../util/memoize'
import * as SettingsGen from '../../actions/settings-gen'
import * as ProvisionGen from '../../actions/provision-gen'
import * as SignupGen from '../../actions/signup-gen'

type OwnProps = {}

const mapStateToProps = (state: TypedState) => ({
  accountRows: state.config.configuredAccounts
    .filter(account => account.username !== state.config.username)
    .sortBy(account => account.username)
    .toArray(),
  fullname: TrackerConstants.getDetails(state, state.config.username).fullname || '',
  username: state.config.username,
})

const mapDispatchToProps = (dispatch: TypedDispatch) => ({
  _onProfileClick: username => dispatch(ProfileGen.createShowUserProfile(username)),
  onAddAccount: () => dispatch(ProvisionGen.createStartProvision()),
  onCancel: () => dispatch(RouteTreeGen.createNavigateUp()),
  onCreateAccount: () => dispatch(SignupGen.createRequestAutoInvite()), // TODO make this route
  onSelectAccount: username => dispatch(LoginGen.createLogin({doUserSwitch: true, password: null, username})), // TODO: handle logged-out case
  onSignOut: () => dispatch(RouteTreeGen.createNavigateAppend({path: [SettingsConstants.logOutTab]})),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps: OwnProps): Props => ({
    accountRows: stateProps.accountRows,
    fullname: stateProps.fullname,
    onAddAccount: dispatchProps.onAddAccount,
    onCancel: dispatchProps.onCancel,
    onCreateAccount: dispatchProps.onCreateAccount,
    onProfileClick: () => dispatchProps._onProfileClick(stateProps.username),
    onSelectAccount: dispatchProps.onSelectAccount,
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
