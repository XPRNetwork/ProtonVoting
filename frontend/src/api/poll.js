import { link } from './user'
import { sha256 } from '@protonprotocol/protonjs'

export const fetchPoll = async (pollId) => {
    if (!link) return undefined

    const res = await link.rpc.get_table_rows({
        code: 'protonvoting',
        scope: 'protonvoting',
        table: 'polls',
        limit: 1,
        lower_bound: pollId,
        upper_bound: pollId
    })

    if (res.rows && res.rows.length) {
        return res.rows[0]
    } else {
        return undefined
    }
}

export const fetchVoteByKey = async (publicKey, pollId) => {
    if (!link) return undefined

    const hashedKey = sha256(publicKey.key.data)

    const res = await link.rpc.get_table_rows({
        code: 'protonvoting',
        scope: pollId,
        table: 'votes',
        limit: 1,
        key_type: 'sha256',
        index_position: 2,
        lower_bound: hashedKey,
        upper_bound: hashedKey
    })

    if (res.rows && res.rows.length) {
        return res.rows[0]
    } else {
        return undefined
    }
}