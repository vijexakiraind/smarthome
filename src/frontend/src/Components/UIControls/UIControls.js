import React from 'react'

import './UIControls.css'

import PowerSwitch from '../UIs/PowerSwitch'

export default class UIControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            values: this.props.values
        }

        this.onChange = this.onChange.bind(this)
    }

    onChange(i, value) {
        this.props.setValue(i, value)

        const newValues = [...this.props.values]
        newValues[i] = value

        this.setState({
            values: newValues
        })
    }

    render() {
        if(this.props.type === 'power-switch')
            return (
                <PowerSwitch on={this.state.values[0]} onChange={this.onChange} />
            )
    }
}