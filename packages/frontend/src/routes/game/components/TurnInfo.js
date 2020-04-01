const React = require('react');
const { useState } = require('react');
const T = require('prop-types');
// const { default: Styled } = require('styled-components');
const { useTheme } = require('@material-ui/core/styles');
const { default: useMediaQuery } = require('@material-ui/core/useMediaQuery');
const DifferenceInSeconds = require('date-fns/differenceInSeconds');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: ListItemSecondaryAction } = require('@material-ui/core/ListItemSecondaryAction');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Grow } = require('@material-ui/core/Grow');
const { default: CheckIcon } = require('@material-ui/icons/Check');
const { default: StarsIcon } = require('@material-ui/icons/Stars');
const ReactCountdownClock = require('react-countdown-clock');
// const { default: Teal } = require('@material-ui/core/colors/teal');
// const { default: Red } = require('@material-ui/core/colors/red');
const PlayerListItem = require('./PlayerListItem');
// const { Textfit } = require('react-textfit');

const internals = {};

module.exports = function TurnInfo({ turn, me, score, ...others }) {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    const { getLastItem, flat, words } = internals;
    const { status, player, lastPlayer, word, lastWord, go, round, start, end } = turn;

    const isMe = Boolean(me && player.nickname === me.nickname);
    const isMyTeam = Boolean(me && player.team === me.team);
    const currentScore = getLastItem(score.player[player.nickname][round]);
    const lastScore = lastPlayer && getLastItem(flat(score.player[lastPlayer.nickname]));
    const lastRoundTeamA = round !== 0 && score.team.a[round - 1];
    const lastRoundTeamB = round !== 0 && score.team.b[round - 1];
    const tie = lastRoundTeamA === lastRoundTeamB;
    const winningTeam = lastRoundTeamA > lastRoundTeamB ? 'a' : 'b';
    const winningScore = lastRoundTeamA > lastRoundTeamB ? lastRoundTeamA : lastRoundTeamB;
    const losingScore = lastRoundTeamA > lastRoundTeamB ? lastRoundTeamB : lastRoundTeamA;
    const now = new Date();
    const started = now < start;

    const [isIn, setIsIn] = useState(false);

    return (
        <Box display='flex' flexDirection='column' {...others}>
            <PlayerListItem
                ContainerComponent='div'
                player={player}
                me={me}
                outlineAvatar
                secondary={me ?
                    (isMe ? 'you\'re up!' :
                        (isMyTeam ? 'your team is up!' : 'the other team is up')
                    ) : null}
                onClick={() => setIsIn((x) => !x)}
            >
                <ListItemSecondaryAction>
                    {status === 'in-progress' && (
                        <Box borderRadius='borderRadius' border={1} textAlign='center' p={1} px={2}>
                            <Typography variant='subtitle2'>{currentScore}</Typography>
                            <Typography variant='caption'>{words(currentScore)}</Typography>
                        </Box>
                    )}
                </ListItemSecondaryAction>
            </PlayerListItem>
            <Box flex={1} display='flex' alignItems='center' justifyContent='center'>
                {!isMe && status === 'initialized' && (
                    <div>
                        {go === 0 && <Typography variant='subtitle1' color='textSecondary'>starting round {round + 1}</Typography>}
                        <Typography variant='h4' color='textSecondary'>waiting...</Typography>
                    </div>
                )}
                {isMe && status === 'initialized' && (
                    <div>
                        {go === 0 && <Typography variant='subtitle1' color='textSecondary'>starting round {round + 1}</Typography>}
                        TODO start button
                    </div>
                )}
                {status === 'in-progress' && !started && (
                    <div>
                        <Typography variant='h2'>{DifferenceInSeconds(start, now)}</Typography>
                    </div>
                )}
                {!isMe && status === 'in-progress' && started && (
                    <Box p={2}>
                        <ReactCountdownClock
                            key={smUp}
                            seconds={DifferenceInSeconds(end, start)}
                            size={smUp ? 200 : 150}
                            weight={smUp ? 15 : 10}
                            alpha={.8}
                            font={theme.typography.fontFamily}
                        />
                    </Box>
                )}
                {isMe && status === 'in-progress' && started && (
                    <>TODO {word}</>
                )}
            </Box>
            <Box>
                {status === 'initialized' && lastScore !== null && go !== 0 && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar variant='rounded'><CheckIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${lastPlayer.nickname} got ${lastScore} ${words(lastScore)}!`}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </ListItem>
                )}
                {status === 'initialized' && lastScore !== null && go === 0 && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar variant='rounded'><StarsIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={tie ?
                                `team a and team b tied last round ${winningScore} to ${winningScore}` :
                                `team ${winningTeam} won last round ${winningScore} to ${losingScore}`}
                            secondary={`${lastPlayer.nickname} got ${lastScore} ${words(lastScore)}!`}
                            primaryTypographyProps={{ variant: 'subtitle1' }}
                            secondaryTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </ListItem>
                )}
                {!isMe && status === 'in-progress' && lastWord && (
                    <Grow in={isIn}>
                        <Box textAlign='center'>
                            <CheckIcon />
                            <Typography>{lastWord}</Typography>
                        </Box>
                    </Grow>
                )}
                {isMe && status === 'in-progress' && started && (
                    <Grow in={isIn}>
                        <Box textAlign='center'>
                            <CheckIcon />
                            <Typography>{lastWord}</Typography>
                        </Box>
                    </Grow>
                )}
            </Box>
        </Box>
    );
};

module.exports.propTypes = {
    me: T.shape({
        nickname: T.string.isRequired,
        team: T.oneOf(['a', 'b']).isRequired
    }),
    score: T.shape({
        team: T.shape({
            a: T.arrayOf(T.number).isRequired,
            b: T.arrayOf(T.number).isRequired
        }).isRequired,
        player: T.objectOf(T.arrayOf(T.number).isRequired).isRequired
    }),
    turn: T.object.isRequired
};

internals.getLastItem = (arr) => arr[arr.length - 1];

internals.flat = (arr) => {

    return arr.reduce((a, b) => [].concat(a).concat(b), []);
};

internals.words = (count) => {

    if (count === 1) {
        return 'word';
    }

    return 'words';
};
