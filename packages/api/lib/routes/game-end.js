'use strict';

module.exports = {
    method: 'post',
    path: '/games/{id}/end',
    options: {
        auth: {
            strategy: 'player',
            access: {
                scope: 'game-{params.id}'
            }
        },
        handler: async (request) => {

            const {
                db: { transact },
                gameService: {
                    end,
                    present
                }
            } = request.services();

            const { id } = request.params;
            const { credentials: { nickname } } = request.auth;

            const game = await transact(end(id, null));

            return present(game, nickname);
        }
    }
};
