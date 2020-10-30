import { JsonRpc } from '@protonprotocol/protonjs'
export const rpc = new JsonRpc(['https://proton.cryptolions.io', 'https://proton.eoscafeblock.com'], { fetch: fetch })
