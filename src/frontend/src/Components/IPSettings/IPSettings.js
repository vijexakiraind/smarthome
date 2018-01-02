import React from 'react'

import './IPSettings.css'

export default class IPSettings extends React.Component {
    render() {
        return (
            <div className="IPSettings">
                <div className="IPSettings-item">
                    <div className="IPSettings-label">
                        IP of your network
                    </div>
                    <input className="IPSettings-input" type="text" placeholder="123.123.123.123" />
                </div>
                <div className="IPSettings-item">
                    <div className="IPSettings-label">
                        Local IP of server
                    </div>
                    <input className="IPSettings-input" type="text" placeholder="123.123.123.123" />
                </div>
            </div>
        )
    }
}