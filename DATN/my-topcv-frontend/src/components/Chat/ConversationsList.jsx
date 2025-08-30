import React from 'react';

export default function ConversationsList({ conversations, onSelect, activeId }) {
  return (
    <div className="w-full md:w-80 border-r h-full overflow-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Conversations</h3>
      </div>
      <ul>
        {conversations.length === 0 && (
          <li className="p-4 text-sm text-gray-500">No conversations yet</li>
        )}
        {conversations.map((c) => (
          <li key={c.conversationId} className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${activeId === c.conversationId ? 'bg-gray-100' : ''}`} onClick={() => onSelect(c)}>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-700">
              {c.participant.name ? c.participant.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{c.participant.name}</div>
              {/* you can show last message preview or time here if you add it to API */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}