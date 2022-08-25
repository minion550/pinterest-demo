import React from 'react'
import SavePinButton from '../buttons/save_button'
import { abbreviate } from '../../util/function_util'
import { MAX_NAME_CHAR } from '../../util/constants_util'

const MiniBoardPreview = ({board, pin, updateCurrentSelection, query}) => {
    const show = board?.name.toLowerCase().includes(query.toLowerCase())
    const content = () => {
        return (
            <div onClick={()=> updateCurrentSelection(board)} 
            className={`mini-board-preview-container ${show ? "" : "hide"}`}>
                <div className='mini-board-cover'>
                </div>
                <div className="mini-board-info">
                    <div className='mini-board-name'>
                        <h1>{abbreviate(board?.name ?? "Profile", MAX_NAME_CHAR)}</h1>
                    </div>
                    <div>
                        <SavePinButton boardId={board?.id} pinId={pin.id}/>
                    </div>
                </div>
            </div>
        )
    }
    return content()
}

export default MiniBoardPreview