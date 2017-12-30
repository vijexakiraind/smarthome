import React from 'react'

import './Switch.css'

export default class Switch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: this.props.current,
            direction: 1
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ selected: newProps.current })
    }

    calcStyle() {
        if(this.props.states === 2) {
            if(this.state.selected === 0)
                return {
                    borderColor: '#eaeaea',
                    backgroundColor: '#eaeaea'
                }
            else
                return {
                    borderColor: '#6eeb43',
                    backgroundColor: '#6eeb43'
                }
        }
        else {
            if(this.state.selected === 0)
                return {
                    borderColor: '#6eeb43',
                    backgroundColor: '#6eeb43'
                }
            else if(this.state.selected === 1)
                return {
                    borderColor: '#eaeaea',
                    backgroundColor: '#eaeaea'
                }
            else return {
                borderColor: '#272727',
                backgroundColor: '#272727'
            }
        }
    }

    next() {
        let newSel = this.state.selected + this.state.direction

        if(newSel === this.props.states || newSel < 0) {
            newSel -= 2 * this.state.direction
            this.setState({ direction: -this.state.direction })
        }

        this.setState({ selected: newSel })

        this.props.onChange(newSel)
    }

    render() {
        const border = 2

        const { height, states } = this.props
        const innrHeight = height - 2*border

        const width = innrHeight + innrHeight * (states - 1) * 0.6

        return (
            <div
                className="Switch"
                style={{
                    height: innrHeight,
                    width,
                    borderRadius: height / 2,
                    border: `${border}px solid`,
                    ...this.calcStyle()
                }}
                onClick={this.next.bind(this)}
            >
                <div
                className="Switch-circle"
                style={{
                    transition: 'transform .2s ease',
                    transform: `translateX(${this.state.selected * innrHeight * 0.6}px)`,
                    height: innrHeight - 2,
                    width: innrHeight - 2,
                    borderRadius: innrHeight / 2                   
                }}
                >
                    <div className="Switch-circle-content">{this.props.content}</div>
                </div>
            </div>
        )
    }
}