export function ListItem({ item }) {
  return (
      `<div class="bg-white p-4 rounded-lg shadow mb-4">
          <h2 class="text-xl font-bold">${item.name}</h2>
          <p class="text-gray-600">${item.description}</p>
      </div>`
  );
}
