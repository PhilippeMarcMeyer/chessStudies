
import React from 'react';
import './comment.styles.css';

const Comment = (props) => {


    let comments = props.comments;

    return (
        <div className="comment-container">
            {
                !props.commentIsOpen ? 
                <div className="comment-zone" onClick={props.openComments}>{comments}</div>
                :
                <textarea id="comment-input"  placeholder="Your text" defaultValue={comments} className="comment-input"></textarea>
            }
            <span data-target="#comment-input" className={`button save ${!props.commentIsOpen  ? "hidden" : ""}`} onClick={props.saveComment}></span>
        </div>

    )
}

export default Comment;
