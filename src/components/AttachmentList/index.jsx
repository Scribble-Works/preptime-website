import React, { useState, useEffect } from 'react'
import './index.css'

export default function AttachmentList({ tempAttachments, clearFunc }) {

    const checkProgress = attachment => {
        return attachment.progress === null ? false : true;
    }

    const AttachmentListItem = ({ attachment, clearFunc }) => {

        return (
            <li className="attachment-item">
                <img src={attachment.iconURL} alt="attachment icon" className="icon" />
                <div className="file-details">
                    <p className="filename"><b>{ attachment.title }</b></p>
                    <div className="file-info">
                        <span className="uploaded-date">File Size: { attachment.size } bytes</span>
                        {
                            checkProgress(attachment) ? (
                                <span className="upload-progress">
                                    <span className="loader"></span>
                                </span>
                            ) : null
                        }
                    </div>
                </div>
                <button className="close" onClick={_ => clearFunc()}>
                    <i className="fas fa-times"></i>
                </button>
            </li>
        )
    }

    return (
        <div className='attachment'>
            {
                tempAttachments.length > 0 ? (
                    <ul className="temp-list">
                        {
                            tempAttachments.map(attachment => 
                                <AttachmentListItem attachment={attachment} key={attachment._id} clearFunc={clearFunc} />
                            )
                        }
                    </ul>
                ) : null
            }
        </div>
    )
}
