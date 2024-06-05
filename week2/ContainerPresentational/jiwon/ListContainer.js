import { ListItem } from './ListItem.js';

export function ListContainer({ items }) {
  return items.map((item) => ListItem({ item })).join('');
}
