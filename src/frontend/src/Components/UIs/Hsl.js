import React from 'react'

import './Hsl.css'

import HslToRgba from '../../Utils/HslToRgb'

export default class Hsl extends React.Component {
    constructor(props) {
        super(props)    
        
        this.state = {
            hue: 0,
            saturation: 1,
            lightness: 1,
            hueStart: null
        }

        this.mainTouchStart = this.mainTouchStart.bind(this)
        this.mainTouchMove = this.mainTouchMove.bind(this)
        this.mainTouchEnd = this.mainTouchEnd.bind(this)

        this.hueTouchStart = this.hueTouchStart.bind(this)
        this.hueTouchMove = this.hueTouchMove.bind(this)
        this.hueTouchEnd = this.hueTouchEnd.bind(this)
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d')

        this.imData = this.ctx.createImageData(270, 220)

        this.updateHue()
    }

    updateHue() {
        for(let i = 0; i < 220; i++)
            for(let j = 0; j < 270; j++) {
                const rgba = HslToRgba(this.state.hue, j / 270, (220 - i) / 220 )
                for(let k = 0; k < 4; k++)
                    this.imData.data[4*(i*270+j)+k] = rgba[k]
            }
        
        this.ctx.putImageData(this.imData, 0, 0)
    }

    mainTouchStart(e) {
        navigator.vibrate(5)
        this.setState({
            mainStart: {
                x: (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX),
                y: (~e.type.indexOf('mouse') !== 0 ? e.clientY : e.changedTouches[0].clientY)
            }
        })

        if(~e.type.indexOf('mouse') !== 0) {
            document.body.addEventListener('mousemove', this.mainTouchMove)
            document.body.addEventListener('mouseup', this.mainTouchEnd)
        }
    }

    mainTouchMove(e) {
        const fingerX = (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX)
        const fingerY = (~e.type.indexOf('mouse') !== 0 ? e.clientY : e.changedTouches[0].clientY)

        const deltaPxX = fingerX - this.state.mainStart.x
        const deltaPxY = fingerY - this.state.mainStart.y

        let newSatVal = this.state.saturation + deltaPxX / 244
        let newLitVal = this.state.lightness + deltaPxY / 194

        if(newSatVal > 1)
            newSatVal = 1
        else if(newSatVal < 0)
            newSatVal = 0

        if(newLitVal > 1)
            newLitVal = 1
        else if(newLitVal < 0)
            newLitVal = 0
    
        if(this.state.saturation !== newSatVal ||
            this.state.lightness !== newLitVal)
            this.setState({
                saturation: newSatVal,
                lightness: newLitVal,
                mainStart: {
                    x: fingerX,
                    y: fingerY
                }
            })
    }

    mainTouchEnd(e) {
        navigator.vibrate(5)
        this.setState({
            mainStart: null
        })

        if(~e.type.indexOf('mouse') !== 0) {
            document.body.removeEventListener('mousemove', this.mainTouchMove)
            document.body.removeEventListener('mouseup', this.mainTouchEnd)
        }
    }

    hueTouchStart(e) {
        navigator.vibrate(5)
        this.setState({
            hueStart: (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX)
        })

        if(~e.type.indexOf('mouse') !== 0) {
            document.body.addEventListener('mousemove', this.hueTouchMove)
            document.body.addEventListener('mouseup', this.hueTouchEnd)
        }
    }

    hueTouchMove(e) {
        const fingerX = (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX)
        const deltaPx = fingerX - this.state.hueStart
        let newVal = this.state.hue + deltaPx / 256
        if(newVal > 1)
            newVal = 1
        else if(newVal < 0)
            newVal = 0
    
        if(newVal !== this.state.hue) {
            this.setState({
                hue: newVal,
                hueStart: fingerX
            })
            this.updateHue()
        }
    }

    hueTouchEnd(e) {
        navigator.vibrate(5)
        this.setState({
            hueStart: null
        })

        if(~e.type.indexOf('mouse') !== 0) {
            document.body.removeEventListener('mousemove', this.hueTouchMove)
            document.body.removeEventListener('mouseup', this.hueTouchEnd)
        }
    }

    render() {
        const { saturation, lightness } = this.state
        return (
            <div>
                <div className="Hsl-empty"></div>
                <canvas className="Hsl-canvas" ref="canvas" height="220" width="270" />
                <div className="Hsl-main"
                    style={{ /* 1 to 244; -225 to -31 */
                        transform: `translate(${1 + saturation * 244}px, ${-225 + lightness * 194}px)`
                    }}
                    onTouchStart={this.mainTouchStart}
                    onTouchMove={this.mainTouchMove}
                    onTouchEnd={this.mainTouchEnd}
                    onMouseDown={this.mainTouchStart}
                ></div>
                <div className="Hsl-hue-container">
                    <div className="Hsl-hue"
                        style={{
                            transform: `translateX(${1 + this.state.hue * 256}px)`
                        }}
                        onTouchStart={this.hueTouchStart}
                        onTouchMove={this.hueTouchMove}
                        onTouchEnd={this.hueTouchEnd}
                        onMouseDown={this.hueTouchStart}
                    >
                        <div className="Hsl-hue-area"></div>
                    </div>
                    <div className="Hsl-hue-palet"></div>
                </div>
            </div>
        )
    }
}