WITH CompletedPlayerQuests AS (
  SELECT *, COUNT(*) OVER() AS total_count
  FROM player_quests AS p
	LEFT JOIN quest as q
	ON p.quest_id = q.quest_id
  WHERE quest_status = 'completed' AND player_id = $1
)
SELECT * FROM CompletedPlayerQuests;
