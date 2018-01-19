import React from 'react'

import './UIControls.css'

import PowerSwitch from '../UIs/PowerSwitch'
import Slider from '../UIs/Slider'
import Hsl from '../UIs/Hsl'

export default class UIControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            values: this.props.values,
            test: 0
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
        if(this.props.type === 'slider')
            return (
                <Slider val={this.state.test} onChange={this.onChange} />
            )
        if(this.props.type === 'hsl')
            return (
                <Hsl val={this.state.test} onChange={this.onChange} />
            )
    }
}