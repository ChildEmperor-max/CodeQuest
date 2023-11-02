UPDATE player_quests 
SET quest_status = 'inactive'
WHERE quest_id IN (
    SELECT q.next_quest_id
	FROM quest AS q
	LEFT JOIN player_quests AS p
	ON q.quest_id = $2
	WHERE p.player_id = $1
) AND player_id = $1;