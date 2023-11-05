UPDATE player_quests
SET quest_status = 'inactive', dialog_id = 1, quest_id = 3
WHERE id = 2

UPDATE player_quests
SET quest_status = 'locked', dialog_id = 8, quest_id = 4
WHERE id = 1