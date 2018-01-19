import React from 'react'

import './Hsl.css'

import HslToRgba from '../../Utils/HslToRgb'

export default class Hsl extends React.Component {
    constructor(props) {
        super(props)

        
    }

    componentDidMount() {
        this.ctx = this.refs.canvas.getContext('2d')

        this.imData = this.ctx.createImageData(270, 220)

        for(let i = 0; i < 220; i++)
            for(let j = 0; j < 270; j++) {
                const rgba = HslToRgba(0, j / 270, (220 - i) / 220 )
                for(let k = 0; k < 4; k++)
                    this.imData.data[4*(i*270+j)+k] = rgba[k]
            }

        this.ctx.putImageData(this.imData, 0, 0)
    }

    render() {
        return (
            <div>
                <div className="Hsl-empty"></div>
                <canvas className="Hsl-canvas" ref="canvas" height="220" width="270" />
                <div className="Hsl-hue-container"></div>
            </div>
        )
    }
}