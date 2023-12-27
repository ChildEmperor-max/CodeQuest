SELECT
  (c.inventory->$2->>'count')::int AS item_count,
  i.*
FROM
  character AS c
LEFT JOIN
  items AS i ON i.item_id = $2
WHERE
  c.player_id = $1;
