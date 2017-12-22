import React from 'react'

import './Notification.css'
import closeIcon from './close.svg'

export default class Notification extends React.Component {
    render() {
        return (
            <div className="Notification pwa">
                <div className="Notification-info">
                    <div className="Notification-title">
                        {this.props.text}
                    </div>
                    <div className="Notification-sub">
                        {this.props.sub}
                    </div>
                </div>
                <div className="Notification-action" onClick={this.props.close}>
                    <img src={closeIcon} alt="Close" />
                </div>
            </div>
        )
    }
}