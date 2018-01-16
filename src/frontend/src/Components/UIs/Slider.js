import React from 'react'

import './Slider.css'

const minAn = -0.07
const maxAn = 1.5

const r = 435

const cX = 650
const cY = 582

const zones = 10
const zoneSize = (maxAn - minAn) / zones

class PowerSwitch extends React.Component {
    constructor(props) {
        super(props)

        const angle = this.props.val * (maxAn - minAn) + minAn

        this.state = {
            start: null,
            delta: { x: 0, y: 0 },
            val: this.props.val,
            angle,
            zone: Math.trunc((angle - minAn) / zoneSize)
        }

        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
    }

    touchStart(e) {
        navigator.vibrate(5)
        const clientX = (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX)
        const clientY = (~e.type.indexOf('mouse') !== 0 ? e.clientY : e.changedTouches[0].clientY)

        this.setState({
            start: {
                x: clientX,
                y: clientY,
                angle: this.state.angle
            }
        })
    }

    touchMove(e) {
        const clientX = (~e.type.indexOf('mouse') !== 0 ? e.clientX : e.changedTouches[0].clientX)
        const clientY = (~e.type.indexOf('mouse') !== 0 ? e.clientY : e.changedTouches[0].clientY)
        
        const deltaX = (clientX - this.state.start.x) * 2.3704
        const deltaY = (clientY - this.state.start.y) * 2.3704

        const rX = Math.cos(this.state.start.angle) * -r
        const rY = Math.sin(this.state.start.angle) * -r

        const fingerX = cX + rX + this.state.delta.x
        const fingerY = cY + rY + this.state.delta.y

        let newAngle = Math.atan((fingerY - cY) / (fingerX - cX))
        if(newAngle < -0.5 && (fingerY - cY) < 0)
            newAngle = maxAn
        if(newAngle > maxAn)
            newAngle = maxAn
        if(newAngle < minAn)
            newAngle = minAn

        const newZone = Math.trunc((newAngle - minAn) / zoneSize)
        
        if(newZone !== this.state.zone)
            navigator.vibrate(5)

        this.setState({
            delta: {
                x: deltaX,
                y: deltaY
            },
            angle: newAngle,
            zone: newZone
        })
    }

    touchEnd(e) {
        navigator.vibrate(5)
        this.setState({
            delta: {
                x: 0,
                y: 0
            },
            start: null
        })
    }

    render() {
        const rX = Math.cos(this.state.angle) * -r
        const rY = Math.sin(this.state.angle) * -r 

        const fingerX = cX + this.state.delta.x + (this.state.start ? Math.cos(this.state.start.angle) * -r : rX)
        const fingerY = cY + this.state.delta.y + (this.state.start ? Math.sin(this.state.start.angle) * -r : rY)

        return(
            <svg className="Slider"
                onMouseLeave={this.touchEnd}
                onMouseMove={this.state.start ? this.touchMove : undefined}
                version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="30 30 670 670" width="270" height="270">
               
                <path className="Slider-track" d="M200 581.62L200.37 563.08L201.49 544.73L203.34 526.59L205.89 508.67L209.15 490.97L213.09 473.53L217.69 456.35L222.96 439.45L228.86 422.83L235.39 406.53L242.52 390.54L250.26 374.89L258.57 359.59L267.46 344.65L276.9 330.09L286.87 315.92L297.37 302.17L308.38 288.83L319.88 275.93L331.86 263.48L344.31 251.5L357.21 240L370.55 228.99L384.31 218.49L398.47 208.51L413.03 199.08L427.97 190.19L443.27 181.88L458.92 174.14L474.91 167L491.22 160.48L507.83 154.57L524.73 149.31L541.91 144.7L559.36 140.77L577.05 137.51L594.97 134.95L613.11 133.11L613.34 133.1L613.64 133.06L615 133L616.36 133.06L617.69 133.24L618.99 133.53L620.23 133.93L621.43 134.44L622.57 135.04L623.65 135.74L624.66 136.52L625.6 137.39L626.47 138.33L627.25 139.35L627.95 140.43L628.55 141.57L629.06 142.76L629.46 144.01L629.76 145.3L629.94 146.63L630 148L629.94 149.36L629.76 150.69L629.46 151.98L629.06 153.23L628.55 154.42L627.95 155.56L627.25 156.64L626.47 157.66L625.6 158.6L624.66 159.47L623.65 160.25L622.57 160.95L621.43 161.55L620.23 162.06L618.99 162.46L617.69 162.75L616.36 162.93L615 163L615 163.07L598.64 164.73L581.91 167.12L565.4 170.16L549.12 173.83L533.08 178.13L517.31 183.04L501.8 188.55L486.58 194.64L471.66 201.31L457.05 208.53L442.77 216.29L428.83 224.58L415.24 233.39L402.02 242.7L389.18 252.5L376.73 262.77L364.69 273.51L353.07 284.69L341.89 296.31L331.15 308.35L320.88 320.8L311.08 333.64L301.77 346.86L292.96 360.45L284.67 374.39L276.91 388.67L269.69 403.28L263.03 418.2L256.93 433.42L251.43 448.92L246.51 464.7L242.21 480.74L238.54 497.02L235.5 513.53L233.11 530.26L231.39 547.19L230.35 564.32L230 581.62L230.35 598.92L231.11 611.37L231.23 612.26L231.29 613.62L231.23 614.98L231.05 616.31L230.75 617.61L230.35 618.85L229.84 620.05L229.24 621.19L228.54 622.27L227.76 623.28L226.89 624.22L225.95 625.09L224.94 625.87L223.86 626.57L222.72 627.17L221.52 627.68L220.27 628.08L218.98 628.38L217.65 628.56L216.29 628.62L214.92 628.56L213.59 628.38L212.3 628.08L211.06 627.68L209.86 627.17L208.72 626.57L207.64 625.87L206.63 625.09L205.68 624.22L204.82 623.28L204.03 622.27L203.34 621.19L202.73 620.05L202.23 618.85L201.82 617.61L201.53 616.31L201.35 614.98L201.29 613.62L201.19 613.62L200.37 600.15L200 581.62Z" id="a1vQh0ljeF"></path>
                
                <circle className={'Slider-button-visible ' + 'step' + this.state.zone }
                    cx={cX + rX}
                    cy={cY + rY}
                    r="40"
                ></circle>

                <circle className={'Slider-indicator ' + 'step' + this.state.zone}
                    cx={cX + rX}
                    cy={cY + rY}
                    r="15"
                ></circle>

                <circle className="Slider-button"
                    onTouchStart={this.touchStart}
                    onTouchMove={this.touchMove}
                    onTouchEnd={this.touchEnd}

                    onMouseDown={this.touchStart}
                    onMouseUp={this.touchEnd}

                    opacity="0"
                    cx={fingerX}
                    cy={fingerY}
                    r="90"
                ></circle>

                <text x="425" y="613" fontSize="50" fill="#9e9e9e" fontWeight="bold">
                    {Math.round(100 * (this.state.angle - minAn) / (maxAn - minAn))}%
                </text>

                { /*
                <circle fill="green" opacity="0.7" cx={cX} cy={cY} r="15"></circle>
                <line stroke="blue" strokeWidth="2" opacity="0.7" x1={cX + rX * 1.1} y1={cY + rY * 1.1} x2={cX - rX * 0.05} y2={cY - rY * 0.05 } />
                */ }
            </svg>
            
        )
    }
}

export default PowerSwitch