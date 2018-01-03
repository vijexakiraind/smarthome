import React from 'react'

import './IPSettings.css'

export default class IPSettings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            globalValid: true,
            localValid: true
        }

        this.validateLocal = this.validateLocal.bind(this)
        this.validateGlobal = this.validateGlobal.bind(this)
    }

    validateLocal() {
        const ip = this.refs.local.value

        if(!/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || 
            ip.split('.').some(n => parseInt(n, 10) > 255)) {
            this.setState({ localValid: false })
            return
        }

        this.setState({ localValid: true })
    }

    validateGlobal() {
        const ip = this.refs.global.value

        if(!/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || 
            ip.split('.').some(n => parseInt(n, 10) > 255)) {
            this.setState({ globalValid: false })
            return
        }

        this.setState({ globalValid: true })
    }

    render() {
        return (
            <div className="IPSettings">
                <div className="IPSettings-item">
                    <div className="IPSettings-label">
                        IP of your network
                    </div>
                    <input ref="global"
                        maxLength="15"
                        onChange={this.validateGlobal}
                        className={'IPSettings-input' + (!this.state.globalValid ? ' error' : '')}
                        type="text"
                        placeholder="12.123.12.123"
                    />
                </div>
                <div className="IPSettings-item">
                    <div className="IPSettings-label">
                        Local IP of server
                    </div>
                    <input ref="local"
                        maxLength="15"
                        onChange={this.validateLocal}
                        className={'IPSettings-input' + (!this.state.localValid ? ' error' : '')}
                        type="text"
                        placeholder="192.168.1.123"
                    />
                </div>
            </div>
        )
    }
}