const React = require('react');
const T = require('prop-types');
const { default: Box } = require('@material-ui/core/Box');
const { default: List } = require('@material-ui/core/List');
const { default: ListSubheader } = require('@material-ui/core/ListSubheader');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: Divider } = require('@material-ui/core/Divider');
const PlayerListItem = require('./PlayerListItem');
const Types = require('../../../components/types');

const internals = {};

module.exports = function TeamList({ players, me, ...others }) {

    const { onTeamA, onTeamB } = internals;

    const teamA = players.filter(onTeamA);
    const teamB = players.filter(onTeamB);

    return (
        <Box display='flex' flexWrap='wrap' {...others}>
            <Box flex={1} component={List} subheader={<ListSubheader>team a</ListSubheader>}>
                {teamA.map((player) => (

                    <PlayerListItem key={player.nickname} player={player} me={me} />
                ))}
            </Box>
            <Box flex={1} component={List} subheader={<ListSubheader>team b</ListSubheader>}>
                {teamB.map((player) => (

                    <PlayerListItem key={player.nickname} player={player} me={me} />
                ))}
            </Box>
            {!players.length && (
                <Box width='100%' textAlign='center'>
                    <Box mb={1}>
                        <Divider light variant='middle' />
                    </Box>
                    <Typography color='textSecondary' variant='subtitle1'>
                        Nobody has joined yet
                    </Typography>
                    <Typography color='textSecondary' variant='caption'>
                        but please do!
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

module.exports.propTypes = {
    me: Types.player,
    players: T.arrayOf(Types.player).isRequired
};

internals.onTeamA = ({ team }) => team === 'a';

internals.onTeamB = ({ team }) => team === 'b';
