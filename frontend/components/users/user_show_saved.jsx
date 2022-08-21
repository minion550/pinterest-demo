import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {fetchBoards} from '../../actions/board_actions'
import { openModal } from '../../actions/modal_actions'
import LoadingContainer from '../generic/loading'
import BoardPreviewContainer from "../boards/board_preview_show"
import { filterUserBoards } from '../../reducers/selector'

const UserShowSavedContainer = (props) => {
    if (!boards) return null
    const {fetchBoards, isUser, openModal, user, boards} = props
    const boardsEmpty = Object.keys(boards).length === 0
    const [loading, setLoading] = useState(boardsEmpty)

    const noSavedBoardsMessage = () => {
        return `${isUser ? "You haven't" : `${user.username} hasn't`} saved any Pins yet`
    }

    useEffect( () => {
        fetchBoards(user.id).finally((setLoading(false)))
    }, [])
    
    const noBoards = () => {
          return (     
          <div className="no-saved-container">
                <h1>{noSavedBoardsMessage()}</h1>
                <Link to="/">
                    <div className={`find-ideas-button ${isUser ? "" : "hide"}`}>
                        <h1>Find ideas</h1>
                    </div>
                </Link>
            </div>
            )
    }

    const boardsIndex = () => {
        return (
        <div className="boards-index-container">
            {
                Object.keys(boards).map( (boardId, i) => <BoardPreviewContainer
                key={i}
                board={boards[parseInt(boardId)]}
                openModal={openModal}
                user={user} 
                isUser={isUser}
                /> )
            }
        </div>
        )

    }
          
    return loading ? <LoadingContainer/> : boardsEmpty ? noBoards() : boardsIndex()

}

// const mSTP = ({entities: {boards}}) => {
//     return {
//         boards: boards
//     }
// }

const mSTP = (state, props) => {
    return {
        boards: filterUserBoards(state, props.user.id)
    }
}

const mDTP = dispatch => {
    return {
        fetchBoards: (userId) => dispatch(fetchBoards(userId)),
        openModal: (formType, props) => dispatch(openModal(formType, props))
    }
}

export default connect(mSTP, mDTP)(UserShowSavedContainer)