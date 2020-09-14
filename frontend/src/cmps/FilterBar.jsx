import React, { Component } from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Input from '@material-ui/core/Input';
// import FilterBarGoogleMaps from './FilterBarGoogleMaps';


export default class FilterBar extends Component {

    state = {
        filterBy: this.props.gFilter
    }

    handleChange = ({ target }) => {
        this.setState({ filterBy: this.props.gFilter }, () => {
            const field = target.name
            let value = (target.type === 'number') ? parseInt(target.value) : target.value
            // if (value === 'all') value = ''
            this.setState(prevState => ({ filterBy: { ...prevState.filterBy, [field]: value } }), () => {
                this.props.changeFilter(this.state.filterBy);
            })
        })
    }

    getOtherLocation = (value) => {
        this.setState(prevState => ({ filterBy: { ...prevState.filterBy, otherLocation: value } }), () => {
            this.props.handleChange(this.state.filterBy)
        })
    }

    render() {
        return (
            <div className={`${this.props.filterBarClass} event-list-filter full flex column justify-flex-end align-center`}>
                {this.state.filterBy && <section className="filters-set flex justify-center align-center space-between wrap">
                    <div>
                        <FormControl>
                            <InputLabel shrink id="date-select-label">Date</InputLabel>
                            <Select
                                labelId="date-select-label"
                                id="date-select"
                                value={this.state.filterBy.date}
                                onChange={this.handleChange}
                                name="date"
                                displayEmpty
                            >
                                <MenuItem value=""><em>Anytime</em></MenuItem>
                                <MenuItem value={1}>Today</MenuItem>
                                <MenuItem value={7}>This Week</MenuItem>
                                <MenuItem value={30}>This Month</MenuItem>
                                <MenuItem value={365}>This Year</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl>
                            <InputLabel shrink id="price-select-label">Budget</InputLabel>
                            <Select
                                labelId="price-select-label"
                                id="price-select"
                                value={this.state.filterBy.price}
                                onChange={this.handleChange}
                                name="price"
                                displayEmpty
                            >
                                <MenuItem value="">Any</MenuItem>
                                <MenuItem value={0}>Free Only</MenuItem>
                                <MenuItem value={5}>Up to $5</MenuItem>
                                <MenuItem value={10}>Up to $10</MenuItem>
                                <MenuItem value={50}>Up to $50</MenuItem>
                                <MenuItem value={100}>Up to $100</MenuItem>
                                <MenuItem value={150}>Up to $150</MenuItem>
                                <MenuItem value={200}>Up to $200</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {/* <div>
                        <FormControl>
                            <InputLabel shrink id="radius-select-label">Distance</InputLabel>
                            <Select
                                labelId="radius-select-label"
                                id="radius-select"
                                value={this.state.filterBy.radius}
                                onChange={this.handleChange}
                                name="radius"
                                displayEmpty
                            >
                                <MenuItem value="">Anywhere</MenuItem>
                                <MenuItem value={2}>Within 2 km</MenuItem>
                                <MenuItem value={5}>Within 5 km</MenuItem>
                                <MenuItem value={10}>Within 10 km</MenuItem>
                                <MenuItem value={50}>Within 50 km</MenuItem>
                                <MenuItem value={100}>Within 100 km</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex justify-center align-flex-end">
                        <FormControl>
                            <InputLabel shrink id="location-select-label">From</InputLabel>
                            <Select
                                labelId="location-select-label"
                                id="location-select"
                                value={this.state.filterBy.locationType}
                                onChange={this.handleChange}
                                name="locationType"
                                displayEmpty
                            >
                                <MenuItem value="">My Location</MenuItem>
                                <MenuItem value={'otherLocation'}>Other Location</MenuItem>
                            </Select>
                        </FormControl>
                        {(this.state.filterBy.locationType === 'otherLocation') && (
                            <FilterBarGoogleMaps onSubmit={this.getOtherLocation} />
                        )}
                    </div> */}
                    <div>
                        <FormControl>
                            <InputLabel shrink id="sortby-select-label">Sort By</InputLabel>
                            <Select
                                labelId="sortby-select-label"
                                id="sortby-select"
                                value={this.state.filterBy.sortBy}
                                onChange={this.handleChange}
                                name="sortBy"
                                displayEmpty
                            >
                                <MenuItem value="startAt">Date</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl>
                            <InputLabel shrink id="orderby-select-label">Order By</InputLabel>
                            <Select
                                labelId="orderby-select-label"
                                id="orderby-select"
                                value={this.state.filterBy.orderBy}
                            onChange={this.handleChange}
                                name="orderBy"
                                displayEmpty
                            >
                                <MenuItem value="1">Ascending</MenuItem>
                                <MenuItem value="-1">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </section>}
            </div>
        )
    }
}
