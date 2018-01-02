import React, { Fragment } from 'react'

import './MenuItem.css'

export default class MenuItem extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="MenuItem">
                    <div className="MenuItem-title">{this.props.title}</div>
                    <div className="MenuItem-ui">{this.props.ui}</div>
                </div>
                { this.props.children }
            </Fragment>
        )
    }
}