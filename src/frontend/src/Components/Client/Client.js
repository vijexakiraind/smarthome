import React from 'react'

import './Client.css'

import UIControls from '../UIControls/UIControls'

export default class Client extends React.Component {
    render() {
        const client = this.props.empty ?
            <div className="empty-Client-placeholder">
                <div className="empty-Client-placeholder-title">
                    Empty slot
                </div>
                <div className="empty-Client-placeholder-ui">
                    <a onClick={() => alert('fuck you')}>Connect new device</a>
                </div>
            </div>
            :
            <React.Fragment>
                <div className="Client-header">
                    <div className="Client-title">
                        { this.props.ui.title }
                    </div>
                    <div className="Client-actions">
                        <div className="Client-edit" onClick={() => alert('?')}>
                            (edit) { /* todo icon */ }
                        </div>
                    </div>
                </div>
                <div className="Client-body power-switch">
                    <UIControls
                        type={this.props.ui.type}
                        value={false /* todo */ }
                    />
                </div>
            </React.Fragment>

        return (
            <div className={'Client' + (this.props.empty ? ' empty' : '')}>
                {client}                
            </div>
        )
    }
}