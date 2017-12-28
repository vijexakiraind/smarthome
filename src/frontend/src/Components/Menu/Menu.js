import React from 'react'

import './Menu.css'
import ic_settings from './../../Icons/ic_settings.svg'
import ic_settings_dark from './../../Icons/ic_settings_dark.svg'
import ic_close from './../../Icons/ic_close.svg'
import ic_close_dark from './../../Icons/ic_close_dark.svg'

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.pull = this.pull.bind(this)
        this.pullStart = this.pullStart.bind(this)
        this.pullEnd = this.pullEnd.bind(this)
        this.toggle = this.toggle.bind(this)
        //this.open = this.open.bind(this)
        //this.close = this.close.bind(this)

        this.state = {
            touch: null,
            dPosY: 0,
            prevPosY: 0,
            opened: false,
            closed: true,
            moveStart: null,
        }
    }

    pullStart(e) {
        if(!this.state.touch) {
            this.setState({
                touch: {
                    x: e.changedTouches[0].screenX,
                    y: e.changedTouches[0].screenY,
                },
                opened: false,
                closed: false,
                moveStart: new Date()
            })
        }
    }

    pull(e) {
        let pos = this.state.prevPosY + e.changedTouches[0].screenY - this.state.touch.y

        if(pos > 0) 
            pos = 0

        if(pos < -window.innerHeight + 63) 
            pos = -window.innerHeight + 63

        this.setState({
            dPosY: pos
        })
    }

    pullEnd() {
        this.setState({
            touch: null,
            prevPosY: this.state.dPosY
        })

        const vel = 1000 * (this.state.prevPosY - this.state.dPosY) / (new Date() - this.state.moveStart)

        const passedUp = vel > 600
        const passedDown = vel < -600

        if(passedUp)
            this.open()
        else if(passedDown)
            this.close()
        else if(this.state.dPosY < -window.innerHeight / 2)
            this.open()
        else
            this.close()
    }

    toggle() {
        if(this.state.opened)
            this.close()
        else if(this.state.closed)
            this.open()
    }

    open() {
        this.setState({
            opened: true,
            closed: false,
            dPosY: -window.innerHeight + 63,
            prevPosY: -window.innerHeight + 63
        })
    }

    close() {
        this.setState({
            closed: true,
            opened: false,
            dPosY: 0,
            prevPosY: 0
        })
    }

    render() {
        const f_ic_settings = this.props.dark ? ic_settings_dark : ic_settings
        const f_ic_close = this.props.dark ? ic_close_dark : ic_close

        const transform = `translateY(${this.state.dPosY}px)`
        const transition = (this.state.opened || this.state.closed) ? 'transform .2s ease-out' : ''

        return (
            <div className="Menu"
                style={{
                    transform,
                    transition
                }}
                
            >
                <div className="Menu-pull-tab"
                    onTouchStart={this.pullStart}
                    onTouchMove={this.pull}
                    onTouchEnd={this.pullEnd}
                    onClick={this.toggle}
                >
                    <div className="Menu-pull-tab-icon">
                        <img src={this.state.opened ? f_ic_close : f_ic_settings} alt={'Settings'} />
                    </div>
                </div>
            </div>
        )
    }
}
