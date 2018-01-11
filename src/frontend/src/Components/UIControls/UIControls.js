import React from 'react'

import './UIControls.css'

import PowerSwitch from '../UIs/PowerSwitch'

export default class UIControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value
        }

        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        this.setState({
            value
        })
    }

    render() {
        if(this.props.type === 'power-switch')
            return (
                <PowerSwitch on={this.state.value} onChange={this.onChange} />
            )
    }
}