SELECT *
FROM quest AS q
LEFT JOIN player_quests AS p
ON p.quest_id = q.quest_id
WHERE p.player_id = $1