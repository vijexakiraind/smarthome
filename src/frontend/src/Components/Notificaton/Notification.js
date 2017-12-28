import React from 'react'

import './Notification.css'
import ic_close from './../../Icons/ic_close.svg'
import ic_close_dark from './../../Icons/ic_close_dark.svg'

export default class Notification extends React.Component {
    render() {
        const f_ic_close = this.props.dark ? ic_close_dark : ic_close

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
                    <img src={f_ic_close} alt="Close" />
                </div>
            </div>
        )
    }
}