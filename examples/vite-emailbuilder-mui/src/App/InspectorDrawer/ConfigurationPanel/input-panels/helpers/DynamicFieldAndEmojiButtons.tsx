import React, { useEffect, useRef, useState } from 'react';

import { useDynamicFields } from '../../../../../dynamicFieldsStore';

type Props = {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
};

function insertAtCursor(props: Props, insertText: string) {
  const { inputRef, value, onChange } = props;
  const input = inputRef.current;
  const start = input?.selectionStart ?? value.length;
  const end = input?.selectionEnd ?? value.length;
  onChange(value.slice(0, start) + insertText + value.slice(end));
  requestAnimationFrame(() => {
    if (input) {
      const cursor = start + insertText.length;
      input.focus();
      input.setSelectionRange(cursor, cursor);
    }
  });
}

export default function DynamicFieldAndEmojiButtons(props: Props) {
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLElement>(null);
  const fields = useDynamicFields();

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (fieldsRef.current && !fieldsRef.current.contains(ev.target as Node)) {
        setFieldsOpen(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(ev.target as Node)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker || !emojiOpen) return;
    const handleEmojiClick = (ev: Event) => {
      insertAtCursor(props, (ev as CustomEvent).detail.unicode);
      setEmojiOpen(false);
    };
    picker.addEventListener('emoji-click', handleEmojiClick);
    return () => picker.removeEventListener('emoji-click', handleEmojiClick);
  }, [emojiOpen, props]);

  return (
    <div className="vozzi-eb-toolbar">
      <style>{TOOLBAR_CSS}</style>
      {fields.length > 0 && (
        <div ref={fieldsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={`vozzi-eb-toolbar-action${fieldsOpen ? ' active' : ''}`}
            data-tooltip="Custom Fields"
            onClick={() => {
              setFieldsOpen((o) => !o);
              setEmojiOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <text x="2" y="17" fill="currentColor" stroke="none" fontSize="15" fontWeight="600">
                {'{ }'}
              </text>
            </svg>
          </button>
          {fieldsOpen && (
            <div className="vozzi-eb-toolbar-popover vozzi-eb-toolbar-menu">
              {fields.map((field) => (
                <div
                  key={field.slug}
                  className="vozzi-eb-toolbar-menu-item"
                  onMouseDown={(ev) => ev.preventDefault()}
                  onClick={() => {
                    insertAtCursor(props, `{${field.slug}}`);
                    setFieldsOpen(false);
                  }}
                >
                  {field.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={emojiRef} style={{ position: 'relative' }}>
        <button
          type="button"
          className={`vozzi-eb-toolbar-action${emojiOpen ? ' active' : ''}`}
          data-tooltip="Emoji"
          onClick={() => {
            setEmojiOpen((o) => !o);
            setFieldsOpen(false);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.8 14.8a4 4 0 0 1-5.6 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            />
          </svg>
        </button>
        {emojiOpen && (
          <div className="vozzi-eb-toolbar-popover">
            {React.createElement('emoji-picker', { ref: pickerRef })}
          </div>
        )}
      </div>
    </div>
  );
}

const TOOLBAR_CSS = `
.vozzi-eb-toolbar {
  display: flex;
  width: fit-content;
  gap: 4px;
  margin-bottom: 20px;
  padding: 3px 4px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fafafa;
}
.vozzi-eb-toolbar-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 8px;
  border: 0;
  border-radius: 6px;
  color: #374151;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}
.vozzi-eb-toolbar-action:hover {
  color: #111827;
  background: #e5e7eb;
}
.vozzi-eb-toolbar-action.active {
  color: #fff;
  background: #1e293b;
}
.vozzi-eb-toolbar-action svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
}
.vozzi-eb-toolbar-action::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  z-index: 20;
  width: max-content;
  max-width: 180px;
  padding: 5px 8px;
  border-radius: 4px;
  color: #fff;
  background: #111827;
  font-size: 12px;
  line-height: 1.2;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(-2px);
  transition: opacity 0.15s, transform 0.15s;
}
.vozzi-eb-toolbar-action:hover::after,
.vozzi-eb-toolbar-action:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.vozzi-eb-toolbar-action.active::after {
  display: none;
}
.vozzi-eb-toolbar-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1300;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .18);
}
.vozzi-eb-toolbar-menu {
  min-width: 200px;
  max-height: 240px;
  overflow-y: auto;
}
.vozzi-eb-toolbar-menu-item {
  padding: 6px 10px;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
}
.vozzi-eb-toolbar-menu-item:hover {
  color: #111827;
  background: #e5e7eb;
}
`;
