INSERT into character (player_id, character_name, level, xp, character_bio, inventory)
VALUES ($1, $2, 1, '{"current_xp": 0, "max_xp": 20}', 'not set', '{}');