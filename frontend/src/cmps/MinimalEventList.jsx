import React from 'react'
import MinimalEventPreview from './MinimalEventPreview'
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


export class MinimalEventList extends React.Component {

    state = {
        type: 'created',
        createdCheckbox: true,
        subscribedCheckbox: false
    }

    handleChange = (ev) => {
        if (ev.target.value === 'created')
            this.setState({ type: ev.target.value, createdCheckbox: true, subscribedCheckbox: false })
        else
            this.setState({ type: ev.target.value, createdCheckbox: false, subscribedCheckbox: true })

    }

    render() {
        const eventsToRender = this.state.type === 'created' ? this.props.createdEvents : this.props.subscribedEvents

        return (
            <section className="minimal-event-list-container user-details-list">

                <div className="list-header flex align-center space-between">
                    <h4>Events</h4>
                    <div>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                <FormControlLabel
                                    value='created'
                                    checked={this.state.createdCheckbox}
                                    control={<Radio color="primary" />}
                                    label="Created"
                                    onChange={this.handleChange}
                                />
                                <FormControlLabel
                                    value='subscribed'
                                    checked={this.state.subscribedCheckbox}
                                    control={<Radio color="primary" />}
                                    label="Subscribed"
                                    onChange={this.handleChange}
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>

                </div>
                <div className="list">
                    {eventsToRender.length === 0 && this.state.type === 'created' && <h5>No events yet. Create and invite your friends!</h5>}
                    {eventsToRender.length === 0 && this.state.type === 'subscribed' && <h5>No events yet. You should join one!</h5>}
                    <ul>
                        {eventsToRender.map(event => <MinimalEventPreview key={event._id} event={event} />)}
                    </ul>
                </div>
            </section>
        )
    }
}