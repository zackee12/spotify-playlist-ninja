import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class TrackTable extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        style: React.PropTypes.object,
        tracks: React.PropTypes.array.isRequired,
    };

    render() {
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Song</TableHeaderColumn>
                        <TableHeaderColumn>Artist</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.props.tracks.map((track, index) =>
                        <TableRow key={`tracktablerow_${index}`}>
                            <TableRowColumn>{track.name}</TableRowColumn>
                            <TableRowColumn>{track.artists.map((artist) => artist.name).join(', ')}</TableRowColumn>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }
}