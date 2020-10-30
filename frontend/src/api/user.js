import { ConnectWallet } from '@protonprotocol/proton-web-sdk';
import { rpc } from '@/api/proton'

const appIdentifier = 'protonvote'

export let link
export let session

export const createLink = async ({ showSelector } = { showSelector: true }) => {
    link = await ConnectWallet({
        linkOptions: {
            rpc
        },
        transportOptions: {
            requestAccount: 'protonvoting', /* Optional: Your proton account */
            requestStatus: false, /* Optional: Display request success and error messages, Default true */
            backButton: true
        },
        selectorOptions: {
            appName: 'Proton Vote', /* Optional: Name to show in modal, Default 'app' */
            // appLogo: 'https://protondemos.com/static/media/taskly-logo.ad0bfb0f.svg', /* Optional: Logo to show in modal */
            // walletType: 'proton' /* Optional: Connect to only specified wallet (e.g. 'proton', 'anchor') */
            showSelector /* Optional: Reconnect without modal if false, Default true */
        }
    })
}

export const login = async () => {
    await createLink()
    session = (await link.login(appIdentifier)).session
    console.log(session)
    localStorage.setItem('saved-user-auth', JSON.stringify(session.auth))
    return session
}

export const transact = async (actions, broadcast) => {
    console.log({
        transaction: {
            actions
        },
        broadcast
    })
    return await session.transact({
        transaction: {
            actions
        }
    }, { broadcast })
}

export const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth)
    }
    session = undefined
    link = undefined
    localStorage.removeItem('saved-user-auth')
}

export const reconnect = async () => {
    if (!link) {
        await createLink({ showSelector: false })
    }

    // eslint-disable-next-line no-undef
    const savedUserAuth = JSON.parse(localstorage.getItem('saved-user-auth'))
    session = await link.restoreSession(appIdentifier, savedUserAuth)
}

export default {
    link,
    login,
    transact,
    logout,
    reconnect
}