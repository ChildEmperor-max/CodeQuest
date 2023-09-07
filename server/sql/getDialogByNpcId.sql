SELECT dialog.id, npc.npc_name, dialog.dialog, dialog.response_to, dialog.branch
FROM npc
LEFT JOIN dialog
ON npc.id = $1
WHERE dialog.npc_id = $1
ORDER BY dialog.id ASC