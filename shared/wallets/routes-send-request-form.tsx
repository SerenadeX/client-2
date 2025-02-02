import * as Constants from '../constants/wallets'
import ChooseAsset from './send-form/choose-asset/container'
import PickAsset from './send-form/pick-asset'
import ConfirmForm from './confirm-form/container'
import QRScan from './qr-scan/container'
import SendForm from './send-form/container'

export const newModalRoutes = {
  [Constants.chooseAssetFormRouteKey]: {
    getScreen: (): typeof ChooseAsset => require('./send-form/choose-asset/container').default,
    upgraded: true,
  },
  [Constants.pickAssetFormRouteKey]: {
    getScreen: (): typeof PickAsset => require('./send-form/pick-asset').default,
    upgraded: true,
  },
  [Constants.confirmFormRouteKey]: {
    getScreen: (): typeof ConfirmForm => require('./confirm-form/container').default,
    upgraded: true,
  },
  qrScan: {getScreen: (): typeof QRScan => require('./qr-scan/container').default, upgraded: true},
  sendReceiveForm: {
    getScreen: (): typeof SendForm => require('./send-form/container').default,
    upgraded: true,
  },
}
