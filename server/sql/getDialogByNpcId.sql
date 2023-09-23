SELECT dialog.id, npc.npc_name, dialog.dialog, dialog.response_to, dialog.open_helper_id, dialog.dialog_branch, dialog.is_array, dialog.stage, dialog.quest_id, dialog.open_editor, dialog.quest_hint_id
FROM npc
LEFT JOIN dialog
ON npc.id = $1
WHERE dialog.npc_id = $1
ORDER BY dialog.id ASC