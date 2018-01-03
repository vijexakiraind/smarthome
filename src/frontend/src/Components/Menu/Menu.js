import React, { Fragment } from 'react'

import Switch from './../Switch/Switch'
import MenuItem from './../MenuItem/MenuItem'
import IPSettings from './../IPSettings/IPSettings'

import './Menu.css'
import ic_settings from './../../Icons/ic_settings.svg'
import ic_settings_dark from './../../Icons/ic_settings_dark.svg'
import ic_close from './../../Icons/ic_close.svg'
import ic_close_dark from './../../Icons/ic_close_dark.svg'

const headerHeight = 65

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.pull = this.pull.bind(this)
        this.pullStart = this.pullStart.bind(this)
        this.pullEnd = this.pullEnd.bind(this)
        this.toggle = this.toggle.bind(this)

        this.state = {
            touch: null,
            dPosY: 0,
            prevPosY: 0,
            opened: false,
            closed: true,
            moveStart: null,
            animated: false
        }

        window.addEventListener('resize', this.resize.bind(this))
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
            animated: true,
            opened: true,
            closed: false,
            dPosY: -window.innerHeight + headerHeight,
            prevPosY: -window.innerHeight + headerHeight
        })

        setTimeout(() => { this.setState({ animated: false }) }, 200)
    }

    close() {
        this.setState({
            animated: true,
            closed: true,
            opened: false,
            dPosY: 0,
            prevPosY: 0
        })

        setTimeout(() => { this.setState({ animated: false }) }, 200)
    }

    resize() {
        if(this.state.opened)
            this.setState({
                dPosY: -window.innerHeight + headerHeight,
                prevPosY: -window.innerHeight + headerHeight
            })
    }

    setTheme(i) {
        // todo
        switch(i) {
            case 0: {
                this.props.setAutoTheme(true)
                break
            }
            case 1: {
                this.props.setAutoTheme(false)
                this.props.setTheme(false)
                break
            }
            default: {
                this.props.setAutoTheme(false)
                this.props.setTheme(true)
                break
            }
        }
    }

    setAutoIPs(i) {
        this.props.setAutoIPs(i === 0 ? false : true)
    }

    themeSelect() {
        if(this.props.autoTheme) return 0
        else if(this.props.dark) return 2
        else return 1
    }

    render() {
        const f_ic_settings = this.props.dark ? ic_settings_dark : ic_settings
        const f_ic_close = this.props.dark ? ic_close_dark : ic_close

        const overlayOpacity = -this.state.dPosY / (window.innerHeight - headerHeight)
        const transform = `translateY(${this.state.dPosY}px)`
        const transition = this.state.animated ? 'transform .2s ease-out' : ''

        return (
            <Fragment>
                { !this.state.closed &&
                <div className="Menu-overlay" style={{ opacity: overlayOpacity }}>
                    <div>{'Settings'}</div>
                </div> }
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
                        { !this.state.closed && <div className="Menu-pull-tab-drag-area"></div>}
                        <div className="Menu-pull-tab-icon">
                            <img src={this.state.opened ? f_ic_close : f_ic_settings} alt={'Settings'} />
                        </div>
                    </div>
                    <MenuItem
                        title={'Theme colors'}
                        ui={
                        <Switch
                            height={30}
                            states={3}
                            current={this.themeSelect()}
                            onChange={c => this.setTheme(c)}
                            content={this.themeSelect() === 0 ? 'A' : ''}
                        />
                        }
                    />
                    <MenuItem
                        title={'Auto IP management'}
                        ui={
                        <Switch
                            height={30}
                            states={2}
                            current={this.props.autoIPs ? 1 : 0}
                            onChange={c => this.setAutoIPs(c)}
                            content={this.props.autoIPs ? 'A' : 'M'}
                        />
                        }
                    >
                        { !this.props.autoIPs && <IPSettings /> }
                    </MenuItem>
                </div>
            </Fragment>
        )
    }
}
