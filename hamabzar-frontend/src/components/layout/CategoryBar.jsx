// آیکون هر دسته‌بندی بر اساس id — چون mockCategories فقط id/name داره و آیکون نداره
const CATEGORY_ICONS = {
  1: "fa-solid fa-bolt", // دریل و فرز
  2: "fa-solid fa-stairs", // نردبان (fallback اگر نبود: ladder)
  3: "fa-solid fa-seedling", // باغبانی
  4: "fa-solid fa-fire", // جوشکاری
  5: "fa-solid fa-soap", // نظافت و شستشو
  6: "fa-solid fa-hammer", // نجاری
  7: "fa-solid fa-paint-roller", // رنگ‌کاری
  8: "fa-solid fa-ruler-combined", // اندازه‌گیری
};

export default function CategoryBar({ categories, activeCategoryId, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-6 py-2.5">
      <button
        onClick={() => onSelect(null)}
        className={`flex min-w-[70px] shrink-0 flex-col items-center gap-1 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs transition ${
          activeCategoryId === null
            ? "border-primary-600 bg-primary-50 font-medium text-primary-600"
            : "border-gray-100 bg-white text-gray-500 hover:border-primary-100 hover:text-primary-600"
        }`}
      >
        <i className="fa-solid fa-border-all text-[20px]" />
        همه
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex min-w-[70px] shrink-0 flex-col items-center gap-1 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs transition ${
            activeCategoryId === cat.id
              ? "border-primary-600 bg-primary-50 font-medium text-primary-600"
              : "border-gray-100 bg-white text-gray-500 hover:border-primary-100 hover:text-primary-600"
          }`}
        >
          <i className={`${CATEGORY_ICONS[cat.id] || "fa-solid fa-toolbox"} text-[20px]`} />
          {cat.name}
        </button>
      ))}
    </div>
  );
}
