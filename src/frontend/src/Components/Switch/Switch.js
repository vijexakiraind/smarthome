import React from 'react'

import './Switch.css'

const border = 2

export default class Switch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: this.props.current,
            direction: 1,
            touch: null
        }

        this.pull = this.pull.bind(this)
        this.pullStart = this.pullStart.bind(this)
        this.pullEnd = this.pullEnd.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.setState({ selected: newProps.current })
    }

    calcClass() {
        if(this.props.states === 2) {
            if(this.state.selected === 0) return ''
            else return ' on'
        }
        else {
            if(this.state.selected === 0) return ' on'
            else return ''
        }
    }

    next() {
        let newSel = this.state.selected + this.state.direction

        if(newSel === this.props.states || newSel < 0) {
            newSel -= 2 * this.state.direction
            this.setState({ direction: -this.state.direction })
        }

        navigator.vibrate(5)
        this.setState({ selected: newSel })

        this.props.onChange(newSel)
    }

    moveLeft(newOrigin) {
        const newSel = this.state.selected - 1

        if(newSel >= 0) {
            navigator.vibrate(5)
            this.setState({ selected: newSel, touch: { x: newOrigin } })
            this.props.onChange(newSel)
        }
    }

    moveRight(newOrigin) {
        const newSel = this.state.selected + 1

        if(newSel < this.props.states) {
            navigator.vibrate(5)
            this.setState({ selected: newSel, touch: { x: newOrigin } })
            this.props.onChange(newSel)
        }
    }

    pullStart(e) {
        if(!this.state.touch) {
            this.setState({
                touch: {
                    x: e.changedTouches[0].screenX
                }
            })
        }
    }

    pull(e) {
        let delta = e.changedTouches[0].screenX - this.state.touch.x

        const magn = 2
        const movedK = (1/magn) * delta / ((this.props.height - 2*border) * 0.6) + this.state.selected

        if(movedK > this.state.selected + 0.5) {
            this.moveRight(e.changedTouches[0].screenX)
        }
        else if(movedK < this.state.selected - 0.5) {
            this.moveLeft(e.changedTouches[0].screenX)
        }
    }

    pullEnd() {
        this.setState({
            touch: null
        })
    }

    render() {
        const { height, states } = this.props
        const innrHeight = height - 2*border

        const width = innrHeight + innrHeight * (states - 1) * 0.6

        return (
            <div
                className={'Switch' + this.calcClass()}
                style={{
                    width
                }}
                onClick={this.next.bind(this)}
                onTouchStart={this.pullStart}
                onTouchMove={this.pull}
                onTouchEnd={this.pullEnd}
            >
                <div
                className="Switch-circle"
                style={{
                    transform: `translateX(${this.state.selected * innrHeight * 0.6}px)`                
                }}
                >
                    <div className="Switch-circle-content">{this.props.content}</div>
                </div>
            </div>
        )
    }
}