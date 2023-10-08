SELECT * 
FROM player_quests AS p
LEFT JOIN quest as q
ON q.quest_id = p.quest_id
WHERE p.player_id = $1 AND p.quest_id = $2