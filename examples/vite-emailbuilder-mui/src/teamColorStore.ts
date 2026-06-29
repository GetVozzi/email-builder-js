let _color: string | null = null;
let _textColor: string | null = null;

export function setTeamColor(color: string, textColor: string) {
  _color = color;
  _textColor = textColor;
}

export function getTeamColor() { return _color; }
export function getTeamTextColor() { return _textColor; }
