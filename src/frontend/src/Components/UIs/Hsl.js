import React from 'react'

import './Hsl.css'

import HslToRgba from '../../Utils/HslToRgb'

export default class Hsl extends React.Component {
    constructor(props) {
        super(props)    
        
        this.state = {
            hue: 0,
            hueStart: null
        }

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
        return (
            <div>
                <div className="Hsl-empty"></div>
                <canvas className="Hsl-canvas" ref="canvas" height="220" width="270" />
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